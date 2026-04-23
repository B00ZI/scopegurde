import { useState, useRef, useEffect } from 'react';
import { Brain, Sparkles, Wand2, ArrowRight, ChevronDown, Plus, Search, Check, X } from 'lucide-react';
import { extractScopeFromBrainDump } from '../lib/gemini';
import { PageHeader } from '../components/PageHeader';

interface CreateChangeOrderProps {
  onGenerate: (details: any, tone: string) => void;
  onCancel: () => void;
}

const INITIAL_CLIENTS = [
  { id: 'acme', name: 'Acme Corp', industry: 'Retail' },
  { id: 'globex', name: 'Globex Logistics', industry: 'Shipping' },
  { id: 'initech', name: 'Initech', industry: 'Software' },
  { id: 'stark', name: 'Stark Industries', industry: 'Defense' },
  { id: 'wayne', name: 'Wayne Enterprises', industry: 'Technology' },
];

export function CreateChangeOrderPage({ onGenerate, onCancel }: CreateChangeOrderProps) {
  const [availableClients, setAvailableClients] = useState(INITIAL_CLIENTS);
  const [brainDump, setBrainDump] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [tone, setTone] = useState('friendly');
  const [details, setDetails] = useState({
    title: '',
    deliverables: '',
    priceAdjustment: '',
    extraTimeDays: ''
  });

  // Combobox State
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof INITIAL_CLIENTS[0] | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredClients = availableClients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleCreateClient = (name: string) => {
    const newClient = {
      id: `new-${Date.now()}`,
      name: name,
      industry: 'Newly Added'
    };
    setAvailableClients([newClient, ...availableClients]);
    setSelectedClient(newClient);
    setIsDropdownOpen(false);
    setClientSearch('');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAIAction = async () => {
    if (!brainDump) return;
    setIsExtracting(true);
    try {
      const extracted = await extractScopeFromBrainDump(brainDump);
      setDetails({
        title: extracted.title || '',
        deliverables: extracted.deliverables?.join('\n') || '',
        priceAdjustment: extracted.priceAdjustment?.toString() || '',
        extraTimeDays: extracted.extraTimeDays?.toString() || ''
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="max-w-container-max mx-auto py-8">
      <div className="mb-8">
        <p className="font-sans text-sm font-medium text-secondary">Draft scope modifications using AI or manual entry.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Brain Dump Card */}
          <section className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-h3 text-on-surface flex items-center gap-2">
                <Brain className="text-primary w-6 h-6" />
                Brain Dump
              </h3>
              <span className="bg-primary-container text-on-primary-container font-label-caps px-2 py-1 rounded">AI Assisted</span>
            </div>
            <p className="font-body-sm text-secondary mb-6">
              Paste client emails, call notes, or raw thoughts. Our AI will extract the scope, pricing, and timeline adjustments.
            </p>
            <textarea 
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
              className="w-full h-40 bg-surface border border-surface-container-highest rounded-lg p-6 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none mb-6" 
              placeholder="e.g., The client wants to add a user dashboard with 3 widget types. This wasn't in the original scope. It will take an extra 4 days and we should bill $1,500 for it. They also want it rushed."
            />
            <div className="flex items-center gap-4 border-t border-surface-container-highest pt-6">
              <button 
                onClick={handleAIAction}
                disabled={!brainDump || isExtracting}
                className="bg-primary text-on-primary font-button px-6 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {isExtracting ? <span className="animate-spin"><Wand2 className="w-5 h-5" /></span> : <Sparkles className="w-5 h-5" />}
                AI Generate
              </button>
              <span className="font-body-sm text-secondary">or</span>
              <button className="text-primary font-button px-4 py-2.5 rounded-lg border border-primary hover:bg-primary/5 transition-colors">
                Fill Manually
              </button>
            </div>
          </section>

          {/* Structured Details Card */}
          <section className={`bg-surface-container-lowest border border-surface-container-highest rounded-xl p-8 shadow-sm transition-opacity ${details.title ? 'opacity-100' : 'opacity-50'}`}>
            <h3 className="font-h3 text-on-surface mb-8 border-b border-surface-container-highest pb-4">Scope Details</h3>
            <div className="space-y-6">
              <div>
                <label className="block font-label-caps text-on-surface-variant mb-2 uppercase">Scope Title</label>
                <input 
                  value={details.title}
                  onChange={(e) => setDetails({ ...details, title: e.target.value })}
                  className="w-full bg-surface border border-surface-container-highest rounded-lg px-6 py-3 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="e.g., Additional User Dashboard Features" 
                  type="text"
                />
              </div>
              <div>
                <label className="block font-label-caps text-on-surface-variant mb-2 uppercase">Deliverables & Tasks (Bulleted)</label>
                <textarea 
                  value={details.deliverables}
                  onChange={(e) => setDetails({ ...details, deliverables: e.target.value })}
                  className="w-full h-32 bg-surface border border-surface-container-highest rounded-lg p-6 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" 
                  placeholder="- Task 1\n- Task 2"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-caps text-on-surface-variant mb-2 uppercase">Price Adjustment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary font-body-base">$</span>
                    <input 
                      value={details.priceAdjustment}
                      onChange={(e) => setDetails({ ...details, priceAdjustment: e.target.value })}
                      className="w-full bg-surface border border-surface-container-highest rounded-lg pl-8 pr-6 py-3 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                      placeholder="0.00" 
                      type="number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-label-caps text-on-surface-variant mb-2 uppercase">Extra Time</label>
                  <div className="relative">
                    <input 
                      value={details.extraTimeDays}
                      onChange={(e) => setDetails({ ...details, extraTimeDays: e.target.value })}
                      className="w-full bg-surface border border-surface-container-highest rounded-lg px-6 py-3 pr-20 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                      placeholder="0" 
                      type="number"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-body-sm">+ Days</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-8 shadow-sm">
            <h3 className="font-h3 text-on-surface mb-6">Context</h3>
            <div className="space-y-8">
              <div>
                <label className="block font-label-caps text-on-surface-variant mb-2 uppercase">Client Selection</label>
                <div className="relative" ref={dropdownRef}>
                  <div 
                    className="w-full bg-surface border border-surface-container-highest rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {selectedClient ? (
                        <span className="font-body-base text-on-surface truncate">{selectedClient.name}</span>
                      ) : (
                        <span className="font-body-base text-outline truncate">Select Client...</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-surface-container-highest rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-150 origin-top">
                      <div className="p-2 border-b border-surface-container-highest flex items-center gap-2 bg-surface-container-low">
                        <Search className="w-4 h-4 text-outline" />
                        <input 
                          autoFocus
                          type="text" 
                          placeholder="Search..."
                          value={clientSearch}
                          onChange={(e) => setClientSearch(e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none font-body-sm text-on-surface py-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                        {clientSearch && <X className="w-4 h-4 text-outline cursor-pointer hover:text-on-surface" onClick={() => setClientSearch('')} />}
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredClients.length > 0 ? (
                          filteredClients.map((client) => (
                            <div 
                              key={client.id}
                              className={`px-4 py-3 cursor-pointer hover:bg-primary/5 flex items-center justify-between transition-colors ${selectedClient?.id === client.id ? 'bg-primary/10' : ''}`}
                              onClick={() => {
                                setSelectedClient(client);
                                setIsDropdownOpen(false);
                                setClientSearch('');
                              }}
                            >
                              <div className="flex flex-col">
                                <span className={`font-body-base ${selectedClient?.id === client.id ? 'text-primary font-semibold' : 'text-on-surface'}`}>
                                  {client.name}
                                </span>
                                <span className="text-[11px] text-secondary uppercase font-bold tracking-wider">{client.industry}</span>
                              </div>
                              {selectedClient?.id === client.id && <Check className="w-4 h-4 text-primary" />}
                            </div>
                          ))
                        ) : clientSearch ? (
                          <div className="px-4 py-8 text-center bg-surface-container-low">
                            <p className="font-body-sm text-secondary mb-4 italic">
                              No client with name: <span className="font-semibold text-on-surface">"{clientSearch}"</span>
                            </p>
                            <button 
                              onClick={() => handleCreateClient(clientSearch)}
                              className="bg-primary text-on-primary font-button px-6 py-2.5 rounded-lg flex items-center gap-2 mx-auto hover:opacity-90 transition-all shadow-md group"
                            >
                              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                              Create "{clientSearch}"
                            </button>
                            <p className="mt-4 text-[11px] text-outline px-4 tracking-tight">Do you want to create a new client record for this brand?</p>
                          </div>
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <p className="font-body-sm text-secondary">Start typing to search or add a client</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block font-label-caps text-on-surface-variant mb-2 uppercase">Communication Tone</label>
                <p className="font-body-sm text-secondary mb-3">Adjusts how the AI drafts the final explanation.</p>
                <div className="flex flex-col gap-2">
                  {['friendly', 'neutral', 'firm'].map(t => (
                    <label 
                      key={t}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-surface transition-colors ${
                        tone === t ? 'border-primary bg-primary/5' : 'border-surface-container-highest'
                      }`}
                    >
                      <input 
                        checked={tone === t}
                        onChange={() => setTone(t)}
                        className="text-primary focus:ring-primary" 
                        name="tone" 
                        type="radio" 
                      />
                      <span className="ml-3 font-body-base text-on-surface capitalize">{t === 'friendly' ? 'Friendly & Collaborative' : t === 'neutral' ? 'Neutral & Direct' : 'Firm & Contractual'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-highest border border-surface-container-highest rounded-xl p-8 shadow-sm">
            <p className="font-body-sm text-secondary mb-6 text-center">Complete all required fields to generate the formal document.</p>
            <div className="space-y-4">
              <button 
                onClick={() => onGenerate(details, tone)}
                className="w-full bg-primary text-on-primary font-button px-4 py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-colors flex justify-center items-center gap-2"
              >
                Generate & Preview
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={onCancel}
                  className="bg-surface-container-lowest border border-surface-container-highest text-on-surface font-button px-4 py-2.5 rounded-lg hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button className="bg-surface-container-lowest border border-surface-container-highest text-on-surface font-button px-4 py-2.5 rounded-lg hover:bg-surface-container transition-colors">
                  Draft
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
