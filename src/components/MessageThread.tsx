import { useEffect, useRef, useState } from 'react';
import { Send, UserCircle } from 'lucide-react';
import { addMessage, nowTime, useMessages } from '../lib/appStore';

const FREELANCER_REPLIES = [
  'Got it — I’ll take a look and get back to you today.',
  'Thanks! I’ll include this in the next update.',
  'Noted. I’ll have an answer for you by tomorrow morning.',
];

const CLIENT_REPLIES = [
  'Sounds good, thanks!',
  'Perfect, appreciate the quick response.',
  'Great — looking forward to it!',
];

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

interface MessageThreadProps {
  projectId: string;
  mode: 'freelancer' | 'client';
}

export function MessageThread({ projectId, mode }: MessageThreadProps) {
  const messages = useMessages(projectId);
  const [text, setText] = useState('');
  const repliedRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last) return;
    if (last.sender !== mode) return;
    if (repliedRef.current === last.id) return;
    repliedRef.current = last.id;
    const other = mode === 'freelancer' ? 'client' : 'freelancer';
    const t = window.setTimeout(() => {
      addMessage({
        id: `MSG-${Date.now()}`,
        projectId,
        sender: other,
        text: pick(other === 'client' ? CLIENT_REPLIES : FREELANCER_REPLIES),
        time: nowTime(),
      });
    }, 1600);
    return () => window.clearTimeout(t);
  }, [messages, mode, projectId]);

  const send = () => {
    const value = text.trim();
    if (!value) return;
    addMessage({
      id: `MSG-${Date.now()}`,
      projectId,
      sender: mode,
      text: value,
      time: nowTime(),
    });
    setText('');
  };

  return (
    <div className="bg-surface-container-low rounded-xl border border-surface-container-highest overflow-hidden">
      <div ref={scrollRef} className="max-h-60 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-secondary py-4">No messages yet — say hello.</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender === mode;
            return (
              <div key={m.id} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
                {!mine && (
                  <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                    <UserCircle className="w-5 h-5 text-secondary" />
                  </div>
                )}
                <div className={`max-w-[75%] ${mine ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-surface-container-highest text-on-surface'} rounded-2xl px-3.5 py-2 ${mine ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
                  <p className="text-sm leading-snug">{m.text}</p>
                  <p className={`text-[10px] mt-1 ${mine ? 'text-on-primary/70' : 'text-secondary'}`}>{m.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="p-3 border-t border-surface-container-highest flex items-center gap-2 bg-surface-container-lowest">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              send();
            }
          }}
          placeholder={mode === 'freelancer' ? 'Reply to your client…' : 'Write a message…'}
          className="flex-1 bg-surface border border-surface-container-highest rounded-lg px-3.5 py-2 text-sm text-on-surface placeholder:text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        />
        <button
          onClick={send}
          className="p-2.5 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all active:scale-95 flex items-center justify-center"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
