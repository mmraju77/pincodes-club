import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Pincode Club',
  description: 'Privacy Policy and data collection guidelines for Pincode Club.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Privacy Policy</h1>
      <div className="bg-[#0f172a] p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl space-y-6 text-slate-300 leading-relaxed">
        <p className="text-orange-400 font-medium">Last Updated: July 2026</p>
        <p>At Pincode Club, your privacy is our top priority. This Privacy Policy outlines how we handle information when you visit our website.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">1. Information We Collect</h2>
        <p>We do not collect any personally identifiable information (PII) unless you voluntarily provide it to us via email or contact forms. We may automatically collect non-personal data such as browser type, device type, and IP address solely for analytics and performance optimization purposes.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">2. Cookies</h2>
        <p>We use cookies to improve user experience and analyze website traffic. You can choose to disable cookies at any time through your internet browser settings.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">3. Third-Party Links</h2>
        <p>Our website may contain links to third-party sites or advertisements. We are not responsible for the privacy practices, cookies, or content of those external websites.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at <strong>contact@pincodeclub.in</strong>.</p>
      </div>
    </div>
  );
}