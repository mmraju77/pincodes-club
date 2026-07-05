'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';

// Phase 12.7: Bulletproof State Extractor with Andaman Fix for District Client
const getSafeKeyword = (stateName: string) => {
  if (!stateName) return '';
  const s = stateName.toLowerCase().replace(/[^a-z]/g, '');
  if (s.includes('tamil') || s.includes('pudu') || s.includes('pondi')) return 'tamil';
  if (s.includes('chhattisgarh') || s.includes('chattisgarh')) return 'chattis';
  if (s.includes('kerala') || s.includes('lakshadweep')) return 'kerala';
  if (s.includes('maharashtra') || s.includes('goa')) return 'maharashtra';
  if (s.includes('gujarat') || s.includes('daman') || s.includes('diu') || s.includes('dadra')) return 'gujarat';
  if (s.includes('bengal') || s.includes('andaman') || s.includes('nicobar') || s.includes('sikkim')) return 'bengal';
  if (s.includes('punjab') || s.includes('chandigarh')) return 'punjab';
  if (s.includes('jammu') || s.includes('kashmir')) return 'jammu';
  if (s.includes('arunachal') || s.includes('manipur') || s.includes('meghalaya') || s.includes('mizoram') || s.includes('nagaland') || s.includes('tripura')) return 'north';
  return stateName.split(' ')[0].trim();
};

const getDistrictDescription = (districtName: string, stateName: string) => {
  if (!districtName || !stateName) return null;
  
  const name = districtName.toLowerCase();
  
  if (name.includes('alluri sitharama raju')) return <p>The <strong>Alluri Sitharama Raju</strong> district, a breathtaking expanse of lush green hills and vibrant tribal culture in Andhra Pradesh, is named after the legendary Indian freedom fighter. Known for picturesque locations like Araku Valley and Paderu, this region is a blend of rich heritage and natural beauty. Navigating the postal network of this hilly terrain is now easier than ever with <strong>Pincode Club</strong>. Whether you are sending parcels to remote villages or verifying banking details, our directory provides the most accurate <strong>Alluri Sitharama Raju pin codes</strong> and IFSC information. We understand how crucial reliable <strong>postal services</strong> are for connecting these beautiful rural landscapes with the rest of the country. Explore our comprehensive database to instantly find the exact postal codes for any post office in this magnificent district.</p>;
  if (name.includes('visakhapatnam')) return <p>Visakhapatnam, affectionately known as the "City of Destiny," is a bustling coastal metropolis in Andhra Pradesh. Renowned for its pristine beaches, oldest shipyard, and thriving IT and industrial sectors, Vizag is a major economic hub. With rapid urban development, keeping track of the correct postal data is essential for businesses and residents alike. <strong>Pincode Club</strong> is your ultimate resource for finding precise <strong>Visakhapatnam pin codes</strong> effortlessly. From the busy commercial streets of Dwaraka Nagar to the serene neighborhoods of Bheemili, our platform ensures you have access to verified data for all your mailing and banking needs. Efficient <strong>postal services</strong> are the backbone of this growing smart city, and we are here to provide lightning-fast, reliable directory services for everyone in Visakhapatnam.</p>;
  if (name.includes('kakinada')) return <p>Kakinada, often celebrated as the "Fertilizer City" and a prominent port city of Andhra Pradesh, is famous for its rich Godavari culture, historical significance, and the mouth-watering Kakinada Kaja. As a rapidly developing smart city and a crucial hub for trade and education, accurate communication networks are vital. Through <strong>Pincode Club</strong>, finding exact <strong>Kakinada pin codes</strong> is a seamless experience. Whether you are managing logistics for local businesses or simply sending a gift to a loved one, our platform guarantees 100% accurate postal and banking information. The efficiency of local <strong>postal services</strong> relies on correct pin codes, and our comprehensive directory makes it incredibly easy to search and verify post offices across the entire Kakinada district.</p>;
  if (name.includes('anakapalli')) return <p>Anakapalli is a significant agricultural and historical district in Andhra Pradesh, globally renowned for hosting one of the largest jaggery markets in India. Steeped in history with ancient Buddhist heritage sites like Bojjannakonda, the region perfectly balances tradition with modern agricultural commerce. For farmers, traders, and everyday residents, reliable communication is key. <strong>Pincode Club</strong> simplifies this by offering a lightning-fast search tool to find authentic <strong>Anakapalli pin codes</strong>. Ensuring your goods and documents reach the right destination is easy when you have access to accurate data. We support the smooth functioning of <strong>postal services</strong> by providing a trustworthy, free, and up-to-date directory for every village and town within the Anakapalli district.</p>;
  if (name.includes('vizianagaram')) return <p>Vizianagaram, meaning the "City of Victory," is the cultural capital of North Coastal Andhra Pradesh. Famous for its magnificent forts, historical educational institutions, and a deep-rooted legacy in classical music and arts, this district is a treasure trove of heritage. To support the connectivity of its diverse towns and historic villages, <strong>Pincode Club</strong> offers a dedicated, highly accurate database of <strong>Vizianagaram pin codes</strong>. Whether you are a student applying for exams or a business sending official documents, having the right postal code is crucial. Our directory enhances your experience with local <strong>postal services</strong> by providing instant, verified access to PIN and IFSC codes, ensuring your mail always reaches the right doorstep in Vizianagaram.</p>;
  
  const firstChar = name.charCodeAt(0);
  const templateIndex = isNaN(firstChar) ? 0 : firstChar % 3;

  const dName = districtName.toUpperCase();
  const sName = stateName.toUpperCase();

  if (templateIndex === 0) {
    return <p>Welcome to the official postal directory for <strong>{dName}</strong> district in the state of <strong>{sName}</strong>. As a vital region with a growing local economy and rich community life, accurate communication and logistics are essential for everyday activities in {dName}. <strong>Pincode Club</strong> provides the most reliable and lightning-fast search platform to find exact <strong>{dName} PIN codes</strong>, post office locations, and banking IFSC details. Whether you are a local resident, a business owner, or someone sending a parcel to {dName}, our 100% free and updated database ensures your mail reaches the right destination without any delay. Browse the complete list of post offices below.</p>;
  } else if (templateIndex === 1) {
    return <p>Finding reliable postal information for <strong>{dName}</strong> in <strong>{sName}</strong> is now simpler than ever. The <strong>{dName}</strong> district relies heavily on an efficient postal and banking network to connect its diverse towns and beautiful villages. At <strong>Pincode Club</strong>, our mission is to offer you a seamless experience when searching for <strong>{dName} pin codes</strong>. From handling daily logistics for small businesses to helping residents verify post office branches, our verified directory is built to save you time. Explore the comprehensive data below to quickly locate the exact PIN or IFSC code you need anywhere within the {dName} region.</p>;
  } else {
    return <p>Are you looking for accurate postal data in <strong>{dName}</strong>, <strong>{sName}</strong>? You have come to the right place! <strong>Pincode Club</strong> is India's ultimate directory hub, meticulously organizing every single post office within the <strong>{dName}</strong> district. A robust postal system is the backbone of connectivity for the people of {dName}. That is why we ensure that every <strong>{dName} pin code</strong> and banking detail on our platform is 100% accurate and easy to find. Scroll down to seamlessly navigate through all the postal divisions and discover the exact location information you are searching for.</p>;
  }
};

export default function DistrictClient() {
  const [pincodesList, setPincodesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 32;

  const params = useParams();
  const rawState = params?.state as string;
  const rawDistrict = params?.district as string;
  
  const decodedState = rawState ? decodeURIComponent(rawState) : '';
  const decodedDistrict = rawDistrict ? decodeURIComponent(rawDistrict) : '';

  useEffect(() => {
    if (decodedDistrict) {
      fetchPincodes(decodedDistrict);
    }
  }, [decodedDistrict, decodedState]);

  const fetchPincodes = async (districtName: string) => {
    setIsLoading(true);
    try {
      const keyword = getSafeKeyword(decodedState);
      let allData: any[] = [];
      let keepFetching = true;
      let offset = 0;
      const pageSize = 1000;

      while (keepFetching) {
        const { data, error } = await supabase
          .from('pincodes')
          .select('*')
          .or(`circlename.ilike.%${keyword}%,statename.ilike.%${keyword}%`)
          .range(offset, offset + pageSize - 1);
        
        if (error) {
          console.error("Database Error:", error.message);
          break;
        }
        
        if (data && data.length > 0) {
          allData = [...allData, ...data];
          offset += pageSize;
          if (data.length < pageSize) keepFetching = false;
        } else {
          keepFetching = false;
        }
      }

      if (allData.length > 0) {
        const normalizedTargetState = decodedState.toLowerCase().replace(/[^a-z]/g, '');
        const normalizedTargetDistrict = districtName.toLowerCase().replace(/[^a-z]/g, '');
        
        const finalData = allData.filter((row: any) => {
          const rStr = JSON.stringify(row).toLowerCase().replace(/[^a-z]/g, '');
          const dNameRaw = row.districtname || row.Districtname || row.district || row.divisionname || '';
          const dName = dNameRaw.toLowerCase().replace(/[^a-z]/g, '');
          
          const isDistrictMatch = dName === normalizedTargetDistrict || dName.includes(normalizedTargetDistrict) || normalizedTargetDistrict.includes(dName);
          if (!isDistrictMatch) return false;

          // Andaman & Nicobar strict fallback fix
          if (normalizedTargetState.includes('andaman') || normalizedTargetState.includes('nicobar')) {
            return rStr.includes('andaman') || rStr.includes('nicobar') || rStr.includes('a&n') || rStr.includes('aandn');
          }

          if (normalizedTargetState.includes('pudu') || normalizedTargetState.includes('pondi')) return rStr.includes('pudu') || rStr.includes('pondi');
          if (normalizedTargetState.includes('sikkim')) return rStr.includes('sikkim');
          if (normalizedTargetState.includes('arunachal')) return rStr.includes('arunachal');
          if (normalizedTargetState.includes('manipur')) return rStr.includes('manipur');
          if (normalizedTargetState.includes('meghalaya')) return rStr.includes('meghalaya');
          if (normalizedTargetState.includes('mizoram')) return rStr.includes('mizoram');
          if (normalizedTargetState.includes('nagaland')) return rStr.includes('nagaland');
          if (normalizedTargetState.includes('tripura')) return rStr.includes('tripura');
          if (normalizedTargetState.includes('chandigarh')) return rStr.includes('chandigarh');
          if (normalizedTargetState.includes('dadra') || normalizedTargetState.includes('nagar')) return rStr.includes('dadra') || rStr.includes('nagar');
          if (normalizedTargetState.includes('daman') || normalizedTargetState.includes('diu')) return rStr.includes('daman') || rStr.includes('diu');
          if (normalizedTargetState.includes('goa')) return rStr.includes('goa');
          if (normalizedTargetState.includes('lakshadweep')) return rStr.includes('lakshadweep');
          
          if (normalizedTargetState.includes('tamil')) return !(rStr.includes('pudu') || rStr.includes('pondi'));
          if (normalizedTargetState.includes('bengal')) return !(rStr.includes('andaman') || rStr.includes('sikkim') || rStr.includes('nicobar') || rStr.includes('a&n'));
          if (normalizedTargetState.includes('punjab')) return !rStr.includes('chandigarh');
          if (normalizedTargetState.includes('gujarat')) return !(rStr.includes('dadra') || rStr.includes('daman') || rStr.includes('diu') || rStr.includes('nagar'));
          if (normalizedTargetState.includes('maharashtra')) return !rStr.includes('goa');
          if (normalizedTargetState.includes('kerala')) return !rStr.includes('lakshadweep');
          if (normalizedTargetState.includes('chhattisgarh') || normalizedTargetState.includes('chattisgarh')) return rStr.includes('chattis');
          
          return true;
        });

        finalData.sort((a, b) => (a.officename || '').localeCompare(b.officename || ''));
        setPincodesList(finalData);
      }
    } catch (err: any) {
      console.error("Fetch Error:", err.message);
    }
    setIsLoading(false);
  };

  const filteredPincodes = pincodesList.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    // Ultimate local search logic
    const isNameMatch = item.officename?.toLowerCase().includes(query);
    const isPinMatch = item.pincode?.toString().includes(query);
    const isDivMatch = item.divisionname?.toLowerCase().includes(query);
    return isNameMatch || isPinMatch || isDivMatch;
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
        // Voice Search Fix
        let cleaned = transcript.replace(/[^\w\s]/gi, '').trim();
        if (/^[\d\s]+$/.test(cleaned)) {
            cleaned = cleaned.replace(/\s+/g, ''); 
        } else {
            cleaned = cleaned.replace(/\s+/g, ' '); 
        }
        setSearchQuery(cleaned);
        setCurrentPage(1);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  const seoContent = getDistrictDescription(decodedDistrict, decodedState);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 min-h-screen space-y-8">
      
      {/* Ultra Compact Header Navigation */}
      <div className="bg-[#0f172a] p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start mb-3">
            <Link href="/pin-codes" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-colors text-xs">
              ALL STATES
            </Link>
            <span className="text-slate-600 font-bold text-sm">&rarr;</span>
            <Link href={`/pin-codes/${rawState}`} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-colors text-xs uppercase">
              {decodedState}
            </Link>
            <span className="text-slate-600 font-bold text-sm">&rarr;</span>
            <span className="px-3 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold rounded-lg text-xs uppercase">
              {decodedDistrict}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            PIN Codes in {decodedDistrict.toUpperCase()}
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Browse all post offices in {decodedDistrict}, {decodedState}.</p>
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search within district..." 
              className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-slate-500 text-sm"
            />
            <div onClick={startListening} className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-orange-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7-7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Optimized District Blog Content */}
      {seoContent && (
        <div className="bg-slate-900/50 p-5 md:p-6 rounded-2xl border border-slate-800 shadow-sm text-slate-300 leading-relaxed text-sm">
          {seoContent}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 font-medium text-sm">Fetching post offices...</p>
        </div>
      ) : (
        <>
          {currentResults.length > 0 ? (
            <div className="space-y-8">
              {/* Ultra Compact Post Office Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentResults.map((item, index) => (
                  <Link 
                    key={index}
                    href={`/pin-codes/${encodeURIComponent(decodedState)}/${encodeURIComponent(decodedDistrict)}/${item.pincode}`}
                    className="group block h-full"
                  >
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer h-full shadow-md flex flex-col justify-between">
                      <div className="mb-3">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1" title={item.officename}>
                            {item.officename}
                          </h3>
                          <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold px-2 py-0.5 rounded text-xs shrink-0">
                            {item.pincode}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase text-slate-500 font-semibold">{item.officetype || 'POST OFFICE'}</span>
                      </div>
                      <div className="mt-auto text-xs text-slate-400">
                        <p className="line-clamp-1">Division: <span className="text-slate-200">{item.divisionname || 'N/A'}</span></p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 pt-6 border-t border-slate-800/50">
                  <button 
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-[#0f172a] border border-slate-800 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-sm"
                  >
                    &larr; Prev
                  </button>
                  <span className="text-slate-400 font-medium bg-[#0f172a] px-4 py-2 rounded-lg border border-slate-800 text-sm">
                    <span className="text-white font-bold">{currentPage}</span> / {totalPages}
                  </span>
                  <button 
                    onClick={() => {
                      setCurrentPage(p => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-[#0f172a] border border-slate-800 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-sm"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#0f172a] rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2">No post offices found</h3>
              <p className="text-slate-400 text-sm">Try adjusting your search query.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}