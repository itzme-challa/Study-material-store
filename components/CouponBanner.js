import { useState } from 'react';
import { toast } from 'react-toastify';

export default function CouponBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`Copied ${code} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-3 md:mb-0">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
          </svg>
          <span className="font-semibold">Special Offers!</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => copyCode('STUDY20')}
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${copied ? 'bg-white text-indigo-600' : 'bg-indigo-800 hover:bg-indigo-900'}`}
          >
            <span className="font-mono">STUDY20</span>
            <span className="ml-1">-20%</span>
          </button>
          
          <button 
            onClick={() => copyCode('LEARN15')}
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${copied ? 'bg-white text-indigo-600' : 'bg-indigo-800 hover:bg-indigo-900'}`}
          >
            <span className="font-mono">LEARN15</span>
            <span className="ml-1">-15%</span>
          </button>
        </div>
      </div>
    </div>
  );
}
