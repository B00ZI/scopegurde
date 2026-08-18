import { useSyncExternalStore } from 'react';
import {
  MOCK_PROJECTS,
  MOCK_CHANGE_REQUESTS,
  MOCK_CONTRACT_SECTIONS,
  MOCK_ORIGINAL_CONTRACT,
  MOCK_MESSAGES,
  MOCK_ACTIVITY,
} from './mockData';
import { ActivityEvent, ChangeRequest, ContractSection, Project, RoomMessage } from '../types';

type Listener = () => void;

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

const EMPTY_MESSAGES: RoomMessage[] = [];
const EMPTY_ACTIVITY: ActivityEvent[] = [];

let projects: Project[] = [...MOCK_PROJECTS];
let changeRequests: ChangeRequest[] = [...MOCK_CHANGE_REQUESTS];
const changeRequestsCache = new Map<string, ChangeRequest[]>();
let changeRequestsVersion: ChangeRequest[] = changeRequests;
const contractSectionsMap: Record<string, ContractSection[]> = {};
const originalContracts: Record<string, string> = {};
const messagesMap: Record<string, RoomMessage[]> = {};
const activityMap: Record<string, ActivityEvent[]> = {};

export function nowDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// --- Projects -------------------------------------------------------------
export function getProjects(): Project[] {
  return projects;
}

export function useProjects(): Project[] {
  return useSyncExternalStore(subscribe, () => projects);
}

export function useProject(id: string): Project | undefined {
  return useSyncExternalStore(subscribe, () => projects.find((p) => p.id === id));
}

export function addProject(p: Project): void {
  projects = [p, ...projects];
  emit();
}

export function updateProject(id: string, patch: Partial<Project>): void {
  projects = projects.map((p) => (p.id === id ? { ...p, ...patch } : p));
  emit();
}

export function deleteProject(id: string): void {
  projects = projects.filter((p) => p.id !== id);
  emit();
}

// --- Change requests ------------------------------------------------------
export function useAllChangeRequests(): ChangeRequest[] {
  return useSyncExternalStore(subscribe, () => changeRequests);
}

export function useChangeRequests(projectId: string): ChangeRequest[] {
  return useSyncExternalStore(subscribe, () => {
    if (changeRequestsVersion !== changeRequests) {
      changeRequestsVersion = changeRequests;
      changeRequestsCache.clear();
    }
    let list = changeRequestsCache.get(projectId);
    if (!list) {
      list = changeRequests.filter((c) => c.projectId === projectId);
      changeRequestsCache.set(projectId, list);
    }
    return list;
  });
}

export function addChangeRequest(cr: ChangeRequest): void {
  changeRequests = [cr, ...changeRequests];
  emit();
}

export function updateChangeRequest(id: string, patch: Partial<ChangeRequest>): void {
  changeRequests = changeRequests.map((c) => (c.id === id ? { ...c, ...patch } : c));
  emit();
}

// --- Contract sections ----------------------------------------------------
export function useContractSections(projectId: string): ContractSection[] {
  return useSyncExternalStore(subscribe, () => contractSectionsMap[projectId] ?? MOCK_CONTRACT_SECTIONS);
}

export function setContractSections(projectId: string, next: ContractSection[]): void {
  contractSectionsMap[projectId] = next;
  emit();
}

// --- Original contract ----------------------------------------------------
export function useOriginalContract(projectId: string): string | undefined {
  return useSyncExternalStore(subscribe, () => originalContracts[projectId] ?? MOCK_ORIGINAL_CONTRACT[projectId]);
}

export function setOriginalContract(projectId: string, text: string): void {
  originalContracts[projectId] = text;
  emit();
}

// --- Messages -------------------------------------------------------------
export function useMessages(projectId: string): RoomMessage[] {
  return useSyncExternalStore(subscribe, () => messagesMap[projectId] ?? MOCK_MESSAGES[projectId] ?? EMPTY_MESSAGES);
}

export function addMessage(msg: RoomMessage): void {
  const base = messagesMap[msg.projectId] ?? MOCK_MESSAGES[msg.projectId] ?? EMPTY_MESSAGES;
  messagesMap[msg.projectId] = [...base, msg];
  emit();
}

// --- Activity -------------------------------------------------------------
export function useActivity(projectId: string): ActivityEvent[] {
  return useSyncExternalStore(subscribe, () => activityMap[projectId] ?? MOCK_ACTIVITY[projectId] ?? EMPTY_ACTIVITY);
}

export function logActivity(
  projectId: string,
  entry: Omit<ActivityEvent, 'id' | 'projectId' | 'time'>
): void {
  const base = activityMap[projectId] ?? MOCK_ACTIVITY[projectId] ?? EMPTY_ACTIVITY;
  activityMap[projectId] = [
    ...base,
    { id: `ACT-${Date.now()}`, projectId, time: 'Just now', ...entry },
  ];
  emit();
}
