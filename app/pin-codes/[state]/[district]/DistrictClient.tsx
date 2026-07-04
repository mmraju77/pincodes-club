'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';

// Phase 12: SEO Automation - Dynamic District Descriptions for AdSense Approval
const getDistrictDescription = (districtName: string) => {
  const name = districtName.toLowerCase();
  
  if (name.includes('alluri sitharama raju')) {
    return (
      <p>The <strong>Alluri Sitharama Raju</strong> district, a breathtaking expanse of lush green hills and vibrant tribal culture in Andhra Pradesh, is named after the legendary Indian freedom fighter. Known for picturesque locations like Araku Valley and Paderu, this region is a blend of rich heritage and natural beauty. Navigating the postal network of this hilly terrain is now easier than ever with <strong>Pincode Club</strong>. Whether you are sending parcels to remote villages or verifying banking details, our directory provides the most accurate <strong>Alluri Sitharama Raju pin codes</strong> and IFSC information. We understand how crucial reliable <strong>postal services</strong> are for connecting these beautiful rural landscapes with the rest of the country. Explore our comprehensive database to instantly find the exact postal codes for any post office in this magnificent district.</p>
    );
  }
  if (name.includes('visakhapatnam')) {
    return (
       <p>Visakhapatnam, affectionately known as the "City of Destiny," is a bustling coastal metropolis in Andhra Pradesh. Renowned for its pristine beaches, oldest shipyard, and thriving IT and industrial sectors, Vizag is a major economic hub. With rapid urban development, keeping track of the correct postal data is essential for businesses and residents alike. <strong>Pincode Club</strong> is your ultimate resource for finding precise <strong>Visakhapatnam pin codes</strong> effortlessly. From the busy commercial streets of Dwaraka Nagar to the serene neighborhoods of Bheemili, our platform ensures you have access to verified data for all your mailing and banking needs. Efficient <strong>postal services</strong> are the backbone of this growing smart city, and we are here to provide lightning-fast, reliable directory services for everyone in Visakhapatnam.</p>
    );
  }
  if (name.includes('kakinada')) {
    return (
      <p>Kakinada, often celebrated as the "Fertilizer City" and a prominent port city of Andhra Pradesh, is famous for its rich Godavari culture, historical significance, and the mouth-watering Kakinada Kaja. As a rapidly developing smart city and a crucial hub for trade and education, accurate communication networks are vital. Through <strong>Pincode Club</strong>, finding exact <strong>Kakinada pin codes</strong> is a seamless experience. Whether you are managing logistics for local businesses or simply sending a gift to a loved one, our platform guarantees 100% accurate postal and banking information. The efficiency of local <strong>postal services</strong> relies on correct pin codes, and our comprehensive directory makes it incredibly easy to search and verify post offices across the entire Kakinada district.</p>
    );
  }
  if (name.includes('anakapalli')) {
    return (
      <p>Anakapalli is a significant agricultural and historical district in Andhra Pradesh, globally renowned for hosting one of the largest jaggery markets in India. Steeped in history with ancient Buddhist heritage sites like Bojjannakonda, the region perfectly balances tradition with modern agricultural commerce. For farmers, traders, and everyday residents, reliable communication is key. <strong>Pincode Club</strong> simplifies this by offering a lightning-fast search tool to find authentic <strong>Anakapalli pin codes</strong>. Ensuring your goods and documents reach the right destination is easy when you have access to accurate data. We support the smooth functioning of <strong>postal services</strong> by providing a trustworthy, free, and up-to-date directory for every village and town within the Anakapalli district.</p>
    );
  }
  if (name.includes('vizianagaram')) {
    return (
      <p>Vizianagaram, meaning the "City of Victory," is the cultural capital of North Coastal Andhra Pradesh. Famous for its magnificent forts, historical educational institutions, and a deep-rooted legacy in classical music and arts, this district is a treasure trove of heritage. To support the connectivity of its diverse towns and historic villages, <strong>Pincode Club</strong> offers a dedicated, highly accurate database of <strong>Vizianagaram pin codes</strong>. Whether you are a student applying for exams or a business sending official documents, having the right postal code is crucial. Our directory enhances your experience with local <strong>postal services</strong> by providing instant, verified access to PIN and IFSC codes, ensuring your mail always reaches the right doorstep in Vizianagaram.</p>
    );
  }
  
  return null;
};

export default function DistrictClient() {
  const [pincodesList, setPincodesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const params = useParams();
  const rawState = params?.state as string;
  const rawDistrict = params?.district as string;
  
  const decodedState = rawState ? decodeURIComponent(rawState) : '';
  const decodedDistrict = rawDistrict ? decodeURIComponent(rawDistrict) : '';

  useEffect(() => {
    if (decodedDistrict) {
      fetchPincodes(decodedDistrict);
    }
  }, [decodedDistrict]);

  const fetchPincodes = async (districtName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pincodes')
        .select('*')
        .ilike('circlename', `%${decodedState}%`)
        .limit(3000);
      
      if (error) throw error;
      if (data) {
        const filtered = data.filter((d: any) => {
          const dName = d.districtname || d.Districtname || d.district || d.divisionname || '';
          return dName.toLowerCase() === districtName.toLowerCase();
        });
        filtered.sort((a, b) => (a.officename || '').localeCompare(b.officename || ''));
        setPincodesList(filtered);
      }
    } catch (err: any) {
      console.error("Database Error:", err.message);
    }
    setIsLoading(false);
  };

  const filteredPincodes = pincodesList.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const isNameMatch = item.officename?.toLowerCase().includes(query);
    const isPinMatch = item.pincode?.toString().includes(query);
    return isNameMatch || isPinMatch;
  });

  const totalPages = Math.ceil(filteredPincodes.length / itemsPerPage);
  const currentResults = filteredPincodes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.lang = 'en-IN'; 

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript.replace(/[^a-zA-Z0-9 ]/g, ""));
        setCurrentPage(1);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  const seoContent = getDistrictDescription(decodedDistrict);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen space-y-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          PIN Codes in {decodedDistrict.toUpperCase()}
        </h1>
        <p className="text-slate-400 text-lg">Browse all post offices in {decodedDistrict}, {decodedState}.</p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-[#0f172a] p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/pin-codes" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-colors text-sm">
            ALL STATES
          </Link>
          <span className="text-slate-600 font-bold">&rarr;</span>
          <Link href={`/pin-codes/${rawState}`} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-colors text-sm">
            {decodedState.toUpperCase()}
          </Link>
          <span className="text-slate-600 font-bold">&rarr;</span>
          <span className="px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold rounded-lg text-sm">
            {decodedDistrict.toUpperCase()}
          </span>
        </div>

        <div className="w-full lg:w-80 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search within district..." 
            className="w-full bg-slate-900/80 text-white border border-slate-700 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-slate-500 text-sm"
          />
          <div onClick={startListening} className={`absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-orange-400'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
        </div>
      </div>

      {/* SEO Optimized District Blog Content for AdSense */}
      {seoContent && (
        <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-sm text-slate-300 leading-relaxed text-sm md:text-base">
          {seoContent}
        </div>
      )}

      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Fetching post offices...</p>
        </div>
      ) : (
        <>
          {currentResults.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentResults.map((item, index) => (
                  <Link 
                    key={index}
                    href={`/pin-codes/${encodeURIComponent(decodedState)}/${encodeURIComponent(decodedDistrict)}/${item.pincode}`}
                    className="group block h-full"
                  >
                    <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer h-full shadow-lg flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                            {item.officename}
                          </h3>
                          <span className="text-xs text-slate-400">{item.officetype || 'POST OFFICE'}</span>
                        </div>
                        <span className="bg-orange-500 text-white font-black px-3 py-1 rounded-lg">
                          {item.pincode}
                        </span>
                      </div>
                      <div className="mt-auto text-sm text-slate-400">
                        <p>Division: <span className="text-slate-200">{item.divisionname}</span></p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-8 border-t border-slate-800/50">
                  <button 
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-[#0f172a] border border-slate-800 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
                  >
                    &larr; Prev
                  </button>
                  <span className="text-slate-400 font-medium bg-[#0f172a] px-6 py-3 rounded-xl border border-slate-800">
                    <span className="text-white font-bold">{currentPage}</span> / {totalPages}
                  </span>
                  <button 
                    onClick={() => {
                      setCurrentPage(p => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 bg-[#0f172a] border border-slate-800 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-24 bg-[#0f172a] rounded-3xl border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-2">No post offices found</h3>
              <p className="text-slate-400">Try adjusting your search query.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}