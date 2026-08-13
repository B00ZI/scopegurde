import React, { useState, useRef, useEffect } from 'react';
import { Brain, Sparkles, Wand2, ArrowRight, ChevronDown, Plus, Search, Check, X } from 'lucide-react';
import { ai, aiStatus } from '../lib/ai';
import { PageHeader } from '../components/PageHeader';
import { MOCK_CLIENTS } from '../lib/mockData';

interface CreateChangeOrderProps {
  onGenerate: (details: any, tone: string) => void; 
  onCancel: () => void;
}

/**
 * CREATE SCOPE WIZARD (STEP 1)
 * 
 * Purpose: The entry point for the scope creation funnel.
 * Supports dual-mode input:
 * 1. AI EXTRACTOR: Dump raw meeting notes or emails into a text area. 
 *    Gemini parses specific deliverables, pricing, and timing.
 * 2. MANUAL ENTRY: Traditional form-based entry for structured data.
 */
export function CreateChangeOrderPage({ onGenerate, onCancel }: CreateChangeOrderProps) {
  // --- STATE MANAGEMENT ---
  const [availableClients, setAvailableClients] = useState(MOCK_CLIENTS);
  const [brainDump, setBrainDump] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [tone, setTone] = useState('friendly');
  
  // The final structured model that describes the scope.
  const [details, setDetails] = useState({
    title: '',
    deliverables: '',
    priceAdjustment: '',
    extraTimeDays: '',
    validUntil: ''
  });

  // --- COMBOBOX (CLIENT SELECTION) STATE ---
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter clients locally based on search input
  const filteredClients = availableClients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // --- EVENT HANDLERS ---

  const handleCreateClient = (name: string) => {
    const newClient = {
      id: `new-${Date.now()}`,
      name: name,
      email: '',
      ongoingScopes: 0,
      changeOrders: 0,
      totalRevenue: 0,
    };
    setAvailableClients([newClient, ...availableClients]);
    setSelectedClient(newClient);
    setIsDropdownOpen(false);
    setClientSearch('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * AI PROCESSING ROUTINE:
   * Takes the raw text from 'brainDump' and uses LLM to map it into structured data.
   */
  const handleAIAction = async () => {
    if (!brainDump) return;
    setIsExtracting(true);
    setExtractionError(null);
    try {
      const extracted = await ai.extractScopeFromBrainDump(brainDump);
      setDetails({
        title: extracted.title || '',
        deliverables: extracted.deliverables?.join('\n') || '',
        priceAdjustment: extracted.priceAdjustment?.toString() || '',
        extraTimeDays: extracted.extraTimeDays?.toString() || '',
        validUntil: details.validUntil // Preserve existing date if set
      });
    } catch (error) {
      console.error('AI Extraction failed:', error);
      setExtractionError('Extraction failed. Please try again or fill the form manually.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-2 pb-8 animate-in fade-in duration-300">
      <PageHeader 
        title="New Scope Adjustment" 
        subtitle="Draft scope modifications using AI or manual entry." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Data Input (AI and Manual Forms) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* SECTION 1: AI Brain Dump Box */}
          <section className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h3 className="font-h3 text-on-surface flex items-center gap-2">
                <Brain className="text-primary w-6 h-6" />
                Brain Dump
              </h3>
              <span className={`bg-primary-container text-on-primary-container font-label-caps px-2 py-1 rounded self-start sm:self-auto ${aiStatus.enabled ? '' : 'bg-outline text-on-surface-container-lowest'}`}>
                {aiStatus.enabled ? 'AI Assisted' : 'Offline Mode'}
              </span>
            </div>
            <p className="font-body-sm text-secondary mb-2">
              Paste client emails, call notes, or raw thoughts. {aiStatus.enabled ? 'Our AI will extract the scope, pricing, and timeline adjustments.' : 'Details are extracted locally with smart defaults.'}
            </p>
            {!aiStatus.enabled && (
              <p className="font-body-sm text-on-surface-variant mb-6">
                AI is offline. To enable real AI extraction, set <span className="font-semibold text-primary">AI_PROVIDER=gemini</span> and <span className="font-semibold text-primary">GEMINI_API_KEY</span> in <span className="font-semibold">.env</span>.
              </p>
            )}
            <textarea 
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
              className="w-full h-40 bg-surface border border-surface-container-highest rounded-lg p-4 sm:p-6 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none mb-4" 
              placeholder="e.g., The client wants to add a user dashboard with 3 widget types..."
            />
            {extractionError && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/20 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {extractionError}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-4 border-t border-surface-container-highest pt-6">
              <button 
                onClick={handleAIAction}
                disabled={!brainDump || isExtracting}
                className="w-full sm:w-auto bg-primary text-on-primary font-button px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-colors disabled:opacity-50 shadow-sm"
              >
                {isExtracting ? <span className="animate-spin"><Wand2 className="w-5 h-5" /></span> : <Sparkles className="w-5 h-5" />}
                Extract Details
              </button>
            </div>
          </section>

          {/* SECTION 2: Structured Details (Populated by AI or user) */}
          <section className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 sm:p-8 shadow-sm">
            <h3 className="font-h3 text-on-surface mb-8 border-b border-surface-container-highest pb-4">Scope Details</h3>
            <div className="space-y-6">
              {/* Scope Title */}
                <div>
                  <label className="block font-label-caps text-on-surface-variant mb-2 uppercase">Scope Title</label>
                <input 
                  id="scope-title-input"
                  value={details.title}
                  onChange={(e) => setDetails({ ...details, title: e.target.value })}
                  className="w-full bg-surface border border-surface-container-highest rounded-lg px-4 sm:px-6 py-3 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  placeholder="e.g., Additional User Dashboard Features" 
                  type="text"
                />
              </div>
              
              {/* Deliverables List */}
              <div>
                <label className="block font-label-caps text-on-surface-variant mb-2 uppercase">Deliverables & Tasks</label>
                <p className="font-body-sm text-secondary mb-3">Enter each task on a new line.</p>
                <textarea 
                  value={details.deliverables}
                  onChange={(e) => setDetails({ ...details, deliverables: e.target.value })}
                  className="w-full h-32 bg-surface border border-surface-container-highest rounded-lg p-4 sm:p-6 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" 
                  placeholder="- Task 1\n- Task 2"
                />
              </div>
              
              {/* Pricing and Timeline Modifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-caps text-on-surface-variant mb-2 uppercase">Price Adjustment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary font-body-base">$</span>
                    <input 
                      value={details.priceAdjustment}
                      onChange={(e) => setDetails({ ...details, priceAdjustment: e.target.value })}
                      className="w-full bg-surface border border-surface-container-highest rounded-lg pl-8 pr-6 py-3 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
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
                      className="w-full bg-surface border border-surface-container-highest rounded-lg px-6 py-3 pr-20 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      placeholder="0" 
                      type="number"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-body-sm">+ Days</span>
                  </div>
                </div>
              </div>

              {/* Offer Expiration */}
              <div>
                <label className="block font-label-caps text-on-surface-variant mb-3 uppercase">Offer Valid Until</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[3, 7, 14].map((days) => (
                    <button
                      key={days}
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + days);
                        setDetails({ ...details, validUntil: d.toISOString().split('T')[0] });
                      }}
                      className="px-3 py-1.5 text-[11px] font-black tracking-wider uppercase rounded-full bg-surface-container-low border border-surface-container-highest hover:bg-surface-container text-secondary hover:text-on-surface transition-colors"
                    >
                      +{days} Days
                    </button>
                  ))}
                  <button
                      onClick={() => {
                        const d = new Date();
                        d.setMonth(d.getMonth() + 1);
                        setDetails({ ...details, validUntil: d.toISOString().split('T')[0] });
                      }}
                      className="px-3 py-1.5 text-[11px] font-black tracking-wider uppercase rounded-full bg-surface-container-low border border-surface-container-highest hover:bg-surface-container text-secondary hover:text-on-surface transition-colors"
                    >
                      +1 Month
                    </button>
                </div>
                <input 
                  type="date"
                  value={details.validUntil}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDetails({ ...details, validUntil: e.target.value })}
                  className="w-full bg-surface border border-surface-container-highest rounded-lg px-6 py-3 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                />
                <p className="font-body-sm text-secondary mt-2">Sets an expiration date to create urgency and trigger automatic follow-ups.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Settings & Final Actions */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* SECTION 3: Context and Client Routing */}
          <section className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 sm:p-8 shadow-sm">
            <h3 className="font-h3 text-on-surface mb-6">Context</h3>
            <div className="space-y-8">
              
              {/* Client Combobox Component */}
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

                  {/* Dropdown Options Box */}
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
                      
                      {/* Dropdown Options List */}
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
                                <span className="text-[11px] text-secondary lowercase font-bold tracking-wider">{client.email || 'No email set'}</span>
                              </div>
                              {selectedClient?.id === client.id && <Check className="w-4 h-4 text-primary" />}
                            </div>
                          ))
                        ) : clientSearch ? (
                          // Zero State: Allow creating a new client if search fails
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
                          // Zero state: Initial empty state without typing
                          <div className="px-4 py-8 text-center">
                            <p className="font-body-sm text-secondary">Start typing to search or add a client</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tone Override Options */}
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
                      <div className="relative flex items-center justify-center">
                        <input 
                          checked={tone === t}
                          onChange={() => setTone(t)}
                          className="peer sr-only" 
                          name="tone" 
                          type="radio" 
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-surface-container-highest peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                          {tone === t && <div className="w-2 h-2 rounded-full bg-on-primary animate-in zoom-in" />}
                        </div>
                      </div>
                      <span className="ml-3 font-body-base text-on-surface capitalize">{t === 'friendly' ? 'Friendly & Collaborative' : t === 'neutral' ? 'Neutral & Direct' : 'Firm & Contractual'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: Submission State */}
          <section className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm overflow-hidden">
            <div className="bg-primary/5 -mx-6 -mt-6 p-6 border-b border-surface-container-highest mb-6 flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                 <ArrowRight className="text-primary w-6 h-6" />
               </div>
               <h3 className="font-h3 text-on-surface mb-1">Ready to Finalize</h3>
               <p className="font-body-sm text-secondary">Complete all required fields to preview the scope and outbound message.</p>
            </div>
            <div className="space-y-4">
              {/* Submit Button -> Fires callback to App.tsx to move to next Step */}
              <button 
                onClick={() => onGenerate(details, tone)}
                className="w-full bg-primary text-on-primary font-button px-4 py-3.5 rounded-lg shadow-sm hover:opacity-90 transition-colors flex justify-center items-center gap-2 active:scale-[0.98]"
              >
                Preview Scope
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={onCancel}
                className="w-full bg-surface-container-low border border-surface-container-highest text-on-surface font-button px-4 py-2.5 rounded-lg hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
