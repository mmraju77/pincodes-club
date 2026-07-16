// components/SponsorCard.tsx
import Link from 'next/link';

interface SponsorProps {
  title: string;
  description: string;
  link: string;
  buttonText: string;
}

export default function SponsorCard({ title, description, link, buttonText }: SponsorProps) {
  return (
    <div className="bg-gradient-to-br from-amber-900/30 to-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">Sponsored</div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{title}</h3>
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">{description}</p>
      <Link 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-center font-bold rounded-xl transition-all shadow-md"
      >
        {buttonText}
      </Link>
    </div>
  );
}