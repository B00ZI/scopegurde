import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  label?: string;
  searchPlaceholder?: string;
  hideSearch?: boolean;
}

export function SearchableDropdown({ value, onChange, options, placeholder = "Select...", searchPlaceholder = "Search...", label, hideSearch }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => 
    option.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="flex flex-col gap-2 relative" ref={wrapperRef}>
      {label && <label className="text-xs font-semibold text-secondary uppercase tracking-wider">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-between"
      >
        <span className={selectedOption ? "text-on-surface truncate" : "text-secondary truncate"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-secondary flex-shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full z-10 bg-surface-container-lowest border border-surface-container-highest rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[200px]">
          {!hideSearch && (
            <div className="p-2 border-b border-surface-container-highest flex items-center shrink-0">
              <Search className="w-4 h-4 text-secondary mr-2 shrink-0" />
              <input 
                type="text" 
                autoFocus
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-on-surface focus:outline-none placeholder:text-secondary"
              />
            </div>
          )}
          <div className="overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-secondary text-center">No results found</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(value === option.value ? '' : option.value); // Toggle off if clicked again, or change value
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-container flex items-center justify-between transition-colors ${
                    value === option.value ? 'bg-primary/5 text-primary' : 'text-on-surface'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
