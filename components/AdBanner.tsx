// components/AdBanner.tsx
export default function AdBanner({ placeholder = "Advertisement" }) {
  return (
    <div className="w-full my-8 flex flex-col items-center justify-center">
      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{placeholder}</span>
      {/* Google AdSense / Monetag Code will go inside this box later */}
      <div className="w-full max-w-4xl h-[90px] md:h-[120px] bg-slate-800/50 border border-slate-700 border-dashed rounded-xl flex items-center justify-center text-slate-500 overflow-hidden">
        {/* Replace this text with actual <script> tag when you get approval */}
        <p className="text-sm">728x90 / Responsive Ad Slot</p>
      </div>
    </div>
  );
}