import { useState } from 'react';

const CloseButton = ({ onClick }) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }}
    className="absolute right-3 top-1 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full p-0.5 transition-all border border-white/10"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>
);

const BuiltBy = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end gap-2 group z-[9999]">
      {showPrompt && (
        <div
          onClick={() => window.open('https://projectcode.dev/dashboard/settings/profile', '_blank')}
          className="relative bg-zinc-900 text-white p-3 rounded-xl shadow-2xl cursor-pointer hover:bg-zinc-800 transition-all text-xs border border-zinc-700/50 animate-in fade-in slide-in-from-bottom-2"
        >
          <CloseButton onClick={() => setShowPrompt(false)} />
          <div className="font-semibold mb-0.5">Remove branding?</div>
          <div className="opacity-70">Pay &#36;5 payment to remove.</div>
          <div className="mt-2 text-blue-400 font-bold">Pay →</div>
        </div>
      )}
      <div className="relative">
        <a href="https://projectcode.dev" target="_blank" rel="noopener noreferrer">
          <div className="bg-zinc-900 text-white px-5 pt-1.5 pb-2.5 rounded-full text-center hover:bg-zinc-800 transition-colors border border-zinc-700/50 shadow-xl">
            <span className="text-[9px] uppercase tracking-wider opacity-70">Built with</span>
            <span className="block text-xs font-medium">myself</span>
          </div>
        </a>
        <CloseButton onClick={() => setShowPrompt(!showPrompt)} />
      </div>
    </div>
  );
};

export default BuiltBy;