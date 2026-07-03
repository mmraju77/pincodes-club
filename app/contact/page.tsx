import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Pincode Club',
  description: 'Get in touch with the Pincode Club team for any queries or feedback.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Contact Us</h1>
      <div className="bg-[#0f172a] p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl space-y-8 text-slate-300 leading-relaxed text-lg">
        <p>We would love to hear from you! Whether you have a question about our directory, spotted an error, or just want to share feedback, please reach out to our team.</p>
        
        <div className="space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-5">
            <div className="bg-orange-500/10 p-4 rounded-xl text-orange-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-1">Headquarters</h3>
              <p className="text-slate-400">Andhra Pradesh, India</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="bg-blue-500/10 p-4 rounded-xl text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-1">Email Us</h3>
              <p className="text-slate-400">contact@pincodeclub.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}