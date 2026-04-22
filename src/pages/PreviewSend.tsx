import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Copy, Send, Loader2, Mail, MessageCircle, ChevronUp, Save, FileText } from 'lucide-react';
import { generateClientMessage } from '../lib/gemini';

interface PreviewSendProps {
  details: any;
  tone: string;
  onBack: () => void;
  onPreviewPortal: () => void;
}

export function PreviewSendPage({ details, tone, onBack, onPreviewPortal }: PreviewSendProps) {
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSendMenuOpen, setIsSendMenuOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const msg = await generateClientMessage(details, tone);
        setMessage(msg);
      } catch (error) {
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    }
    load();
  }, [details, tone]);

  // Handle click outside send menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSendMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const renderMessageWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary underline hover:text-primary-container transition-colors break-all"
            onClick={(e) => {
              e.preventDefault();
              if (part.includes('approval-portal')) {
                onPreviewPortal();
              }
            }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-8 max-w-container-max mx-auto w-full flex flex-col gap-10">
        <section className="flex flex-col gap-2 max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <h2 className="font-h2 text-on-surface">Final Message Preview</h2>
            <div className="flex items-center gap-3">
              <span className="font-label-caps text-on-surface-variant px-3 py-1 bg-surface-container rounded">DRAFT</span>
            </div>
          </div>
          <p className="font-body-sm text-on-surface-variant">Review the surcharge notification below. You can copy this for WhatsApp or send it directly via email.</p>
          
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-10 mt-6 shadow-sm min-h-[400px] flex flex-col relative group">
            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center text-secondary gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="font-body-base">AI is drafting your message...</p>
              </div>
            ) : (
              <>
                <div className="font-body-base text-on-surface space-y-4 leading-relaxed whitespace-pre-wrap font-sans">
                  {renderMessageWithLinks(message)}
                </div>
                {!isGenerating && (
                  <button 
                    onClick={handleCopy}
                    className="absolute top-4 right-4 p-2.5 rounded-lg bg-surface-container-highest border border-surface-container-highest text-on-surface hover:text-primary transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 shadow-sm"
                  >
                    {copyStatus ? <span className="text-xs font-bold text-primary">{copyStatus}</span> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        <section className="mt-auto pt-10 pb-8 max-w-3xl mx-auto w-full flex flex-col sm:flex-row justify-end gap-4">
          <button 
            className="px-8 py-3 bg-surface-container-low border border-surface-container-highest text-on-surface hover:bg-surface-container-high rounded-lg font-button transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm active:scale-95"
          >
            <Save className="w-4 h-4 text-secondary" />
            Save Draft
          </button>
          
          <div className="relative w-full sm:w-auto" ref={menuRef}>
            <button 
              onClick={() => setIsSendMenuOpen(!isSendMenuOpen)}
              className="px-8 py-3 bg-primary text-on-primary hover:opacity-90 rounded-lg font-button transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
              Send Now
              <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${isSendMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSendMenuOpen && (
              <div className="absolute bottom-full right-0 mb-3 w-64 bg-surface-container-lowest border border-surface-container-highest rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="p-3 border-b border-surface-container-highest bg-surface-container-low">
                  <span className="font-label-caps text-secondary text-[10px]">Select Delivery Method</span>
                </div>
                <div className="flex flex-col p-1">
                  <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 text-on-surface hover:text-primary transition-all text-left">
                    <Mail className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="font-sans text-[13px] font-semibold">Direct Email</span>
                      <span className="text-[10px] text-secondary">Send as an official notice</span>
                    </div>
                  </button>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 text-on-surface hover:text-primary transition-all text-left"
                  >
                    <Copy className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="font-sans text-[13px] font-semibold">Copy to Clipboard</span>
                      <span className="text-[10px] text-secondary">Ready for WhatsApp/Slack</span>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 text-on-surface hover:text-primary transition-all text-left">
                    <MessageCircle className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="font-sans text-[13px] font-semibold">WhatsApp Business</span>
                      <span className="text-[10px] text-secondary">Share directly via mobile</span>
                    </div>
                  </button>
                  <div className="h-px bg-surface-container-highest my-1 mx-2" />
                  <button 
                    onClick={onPreviewPortal}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 text-primary transition-all text-left"
                  >
                    <FileText className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="font-sans text-[13px] font-bold">Preview Approve Page</span>
                      <span className="text-[10px] text-primary/60">See what the client sees</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
