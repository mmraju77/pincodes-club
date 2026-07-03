import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Pincode Club',
  description: 'Learn more about Pincode Club, your trusted source for India postal and banking directory.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">About Us</h1>
      <div className="bg-[#0f172a] p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl space-y-6 text-slate-300 leading-relaxed text-lg">
        <p>Welcome to <strong className="text-white">Pincode Club</strong>, India's most accurate and lightning-fast directory hub for PIN codes, IFSC codes, and postal information.</p>
        <p>Operating out of Andhra Pradesh, India, our mission is to simplify the process of finding vital location and banking data for millions of users across the country.</p>
        <p>We understand that finding reliable postal data can be frustrating. That is why we built a platform that is 100% free, fast, and easy to navigate. Whether you are sending a parcel, verifying a bank branch, or looking up a local post office, we have you covered.</p>
        <p className="pt-4 text-orange-400 font-medium">Thank you for trusting Pincode Club!</p>
      </div>
    </div>
  );
}