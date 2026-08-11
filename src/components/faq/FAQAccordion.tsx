'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-ivory/10 border-t border-b border-ivory/10">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between py-3 md:py-4 text-left group cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="type-h6 text-ivory group-hover:text-primary transition-colors pr-4">
                {item.question}
              </span>
              {/* Hamburger → X toggle */}
              <span className="flex-shrink-0 w-4 h-4 flex flex-col items-center justify-center gap-[3px] text-ivory/35">
                <span
                  className={`block w-3.5 h-[1.5px] bg-current transition-all duration-200 origin-center ${
                    isOpen ? 'rotate-45 translate-y-[4.5px]' : ''
                  }`}
                />
                <span
                  className={`block w-3.5 h-[1.5px] bg-current transition-all duration-200 ${
                    isOpen ? 'opacity-0 scale-0' : ''
                  }`}
                />
                <span
                  className={`block w-3.5 h-[1.5px] bg-current transition-all duration-200 origin-center ${
                    isOpen ? '-rotate-45 -translate-y-[4.5px]' : ''
                  }`}
                />
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isOpen ? 'max-h-48 pb-3 md:pb-4' : 'max-h-0'
              }`}
            >
              <p className="text-base text-ivory/55 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
