import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - Pincode Club',
  description: 'Legal disclaimer and terms of information usage for Pincode Club.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Disclaimer</h1>
      <div className="bg-[#0f172a] p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl space-y-6 text-slate-300 leading-relaxed">
        <p>The information provided on Pincode Club (the "Website") is for general informational purposes only.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">Accuracy of Information</h2>
        <p>While we strive to keep the data up-to-date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information contained on the website. Data such as PIN codes and IFSC codes may change, and users are advised to cross-verify with official sources before making critical decisions.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">Not an Official Source</h2>
        <p>Pincode Club is an independent, privately-run platform. It is <strong>not affiliated with, endorsed by, or connected to India Post, the Government of India, or the Reserve Bank of India (RBI)</strong>. For official and legally binding information, please refer to the respective official government portals.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">Use at Your Own Risk</h2>
        <p>Any reliance you place on the information on this website is strictly at your own risk. In no event will we be liable for any loss or damage arising out of, or in connection with, the use of this website.</p>
      </div>
    </div>
  );
}