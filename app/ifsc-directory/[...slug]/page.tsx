// @ts-nocheck
'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { supabase } from '../../../lib/supabase';

// Official Districts Data Store for All Indian States and UTs
const ALL_INDIA_DISTRICTS = {
  'andaman-and-nicobar-islands': ["Nicobar", "North and Middle Andaman", "South Andaman"],
  'andhra-pradesh': [
    "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", 
    "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", 
    "Kakinada", "Krishna", "Kurnool", "Markapuram", "Nandyal", "NTR", "Palnadu", 
    "Parvathipuram Manyam", "Polavaram", "Prakasam", "Rayalaseema", 
    "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam", "Tirupati", 
    "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
  ],
  'arunachal-pradesh': ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Itanagar Capital Complex", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
  'assam': ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  'bihar': ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  'chandigarh': ["Chandigarh"],
  'chhattisgarh': ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  'dadra-and-nagar-haveli': ["Dadra", "Nagar Haveli"],
  'daman-and-diu': ["Daman", "Diu"],
  'delhi': ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  'goa': ["North Goa", "South Goa"],
  'gujarat': ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  'haryana': ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  'himachal-pradesh': ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  'jammu-and-kashmir': ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  'jharkhand': ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  'karnataka': ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  'kerala': ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  'ladakh': ["Kargil", "Leh"],
  'lakshadweep': ["Lakshadweep"],
  'madhya-pradesh': ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  'maharashtra': ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  'manipur': ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  'meghalaya': ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  'mizoram': ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saitual", "Serchhip", "Siaha"],
  'nagaland': ["Chumukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
  'odisha': ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
  'puducherry': ["Karaikal", "Mahe", "Puducherry", "Yanam"],
  'punjab': ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "SAS Nagar", "Tarn Taran"],
  'rajasthan': ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  'sikkim': ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  'tamil-nadu': ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  'telangana': ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Hanamkonda", "Yadadri Bhuvanagiri"],
  'tripura': ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  'uttar-pradesh': ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  'uttarakhand': ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  'west-bengal': ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
};

const formatFromSlug = (slug) => {
  if (!slug) return '';
  return decodeURIComponent(slug).replace(/-/g, ' ').trim();
};

const formatToSlug = (text) => {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const formatContactNumber = (contact) => {
  if (!contact || contact === 'Not Available' || contact === 'NULL') return 'Not Available';
  let strContact = String(contact).trim();
  if (strContact.toUpperCase().includes('E')) return 'Not Available';
  if (strContact.endsWith('.0')) strContact = strContact.slice(0, -2);
  if (strContact === 'NaN' || strContact === '' || strContact === '0') return 'Not Available';
  return strContact;
};

export default function DynamicIfscPage(props) {
  const params = props.params instanceof Promise ? use(props.params) : props.params;
  const slug = params?.slug || [];

  const bankSlug = slug[0] || null;
  const stateSlug = slug[1] || null;
  const districtSlug = slug[2] || null;
  const citySlug = slug[3] || null;
  const branchSlug = slug[4] || null;

  const dbBank = formatFromSlug(bankSlug);
  const dbState = formatFromSlug(stateSlug);
  const dbDistrict = formatFromSlug(districtSlug);
  const dbCity = formatFromSlug(citySlug);
  const dbBranch = formatFromSlug(branchSlug);

  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let q = supabase.from('ifsc_codes').select('*');
        
        if (dbBank) q = q.ilike('bank', `%${dbBank}%`);
        if (dbState) q = q.ilike('state', `%${dbState}%`);
        
        if (dbDistrict) {
            q = q.or(`district.ilike.%${dbDistrict}%,city.ilike.%${dbDistrict}%,centre.ilike.%${dbDistrict}%`);
        }
        if (dbCity) {
            q = q.or(`centre.ilike.%${dbCity}%,city.ilike.%${dbCity}%`);
        }
        if (dbBranch) {
            q = q.ilike('branch', `%${dbBranch}%`);
        }

        q = q.limit(branchSlug ? 1 : 15000); 

        const { data, error } = await q;
        if (error) throw error;
        if (data) setDataList(data);
      } catch (error) {
        console.error("Database query execution error:", error);
      }
      setIsLoading(false);
    };

    if (bankSlug) {
      fetchData();
    }
  }, [dbBank, dbState, dbDistrict, dbCity, dbBranch, bankSlug]);

  let displayCards = [];
  let isFinalBranchView = false;
  let branchDataToShow = [];

  if (dataList.length > 0) {
    
    // LEVEL 1: Shows States
    if (bankSlug && !stateSlug) {
      const uniqueStates = Array.from(new Set(dataList.map(d => d.state?.trim().toUpperCase()))).filter(Boolean);
      displayCards = uniqueStates.sort().map(s => ({
        name: s,
        icon: '🗺️',
        label: 'Select State ➔',
        url: `/ifsc-directory/${bankSlug}/${formatToSlug(s)}`
      }));
    } 
    
    // LEVEL 2: Shows Districts with Intersection Filter
    else if (bankSlug && stateSlug && !districtSlug) {
      let uniqueDistricts = [];
      
      if (ALL_INDIA_DISTRICTS[stateSlug]) {
         // EXPERT ARCHITECT FIX: Only keep an official district if it actually contains active branches in the fetched dataList
         uniqueDistricts = ALL_INDIA_DISTRICTS[stateSlug].filter(officialDist => {
            const normalizedOfficial = officialDist.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            return dataList.some(row => {
               const rowDist = (row.district || '').toLowerCase().replace(/[^a-z0-9]/g, '');
               const rowCity = (row.city || '').toLowerCase().replace(/[^a-z0-9]/g, '');
               const rowCentre = (row.centre || '').toLowerCase().replace(/[^a-z0-9]/g, '');
               
               return rowDist.includes(normalizedOfficial) || 
                      normalizedOfficial.includes(rowDist) ||
                      rowCity.includes(normalizedOfficial) ||
                      rowCentre.includes(normalizedOfficial);
            });
         });
         
         // Fallback if database records are completely distorted and matched nothing
         if (uniqueDistricts.length === 0) {
            uniqueDistricts = Array.from(new Set(dataList.map(d => d.district?.trim().toUpperCase()))).filter(Boolean);
         }
      } else {
         uniqueDistricts = Array.from(new Set(dataList.map(d => d.district?.trim().toUpperCase()))).filter(Boolean);
      }

      displayCards = uniqueDistricts.sort().map(d => ({
        name: d,
        icon: '🏢',
        label: 'Select District ➔',
        url: `/ifsc-directory/${bankSlug}/${stateSlug}/${formatToSlug(d)}`
      }));
    }
    
    // LEVEL 3: Shows Cities
    else if (bankSlug && stateSlug && districtSlug && !citySlug) {
      const uniqueCities = Array.from(new Set(dataList.map(d => (d.centre || d.city)?.trim().toUpperCase()))).filter(Boolean);
      displayCards = uniqueCities.sort().map(c => ({
        name: c,
        icon: '🏙️',
        label: 'Select City ➔',
        url: `/ifsc-directory/${bankSlug}/${stateSlug}/${districtSlug}/${formatToSlug(c)}`
      }));
    }
    
    // LEVEL 4: Shows Branches
    else if (bankSlug && stateSlug && districtSlug && citySlug && !branchSlug) {
      const uniqueBranches = Array.from(new Set(dataList.map(d => d.branch?.trim().toUpperCase()))).filter(Boolean);
      displayCards = uniqueBranches.sort().map(b => ({
        name: b,
        icon: '🏦',
        label: 'View Branch ➔',
        url: `/ifsc-directory/${bankSlug}/${stateSlug}/${districtSlug}/${citySlug}/${formatToSlug(b)}`
      }));
    }
    
    // LEVEL 5: Branch Card
    else if (bankSlug && stateSlug && districtSlug && citySlug && branchSlug) {
      isFinalBranchView = true;
      branchDataToShow = dataList;
    }
  }

  const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      
      <nav className="flex flex-wrap text-sm font-medium gap-2 bg-slate-900/80 p-4 rounded-xl border border-slate-700 shadow-md">
        <Link href="/ifsc-directory" className="text-blue-400 hover:text-white transition-colors">BANKS</Link>
        {bankSlug && (
          <>
            <span className="text-slate-600">➔</span>
            <Link href={`/ifsc-directory/${bankSlug}`} className="text-blue-400 hover:text-white transition-colors capitalize" translate="no">{formatFromSlug(bankSlug)}</Link>
          </>
        )}
        {stateSlug && (
          <>
            <span className="text-slate-600">➔</span>
            <Link href={`/ifsc-directory/${bankSlug}/${stateSlug}`} className="text-blue-400 hover:text-white transition-colors capitalize" translate="no">{formatFromSlug(stateSlug)}</Link>
          </>
        )}
        {districtSlug && (
          <>
            <span className="text-slate-600">➔</span>
            <Link href={`/ifsc-directory/${bankSlug}/${stateSlug}/${districtSlug}`} className="text-blue-400 hover:text-white transition-colors capitalize" translate="no">{formatFromSlug(districtSlug)}</Link>
          </>
        )}
        {citySlug && (
          <>
            <span className="text-slate-600">➔</span>
            <Link href={`/ifsc-directory/${bankSlug}/${stateSlug}/${districtSlug}/${citySlug}`} className="text-blue-400 hover:text-white transition-colors capitalize" translate="no">{formatFromSlug(citySlug)}</Link>
          </>
        )}
        {branchSlug && (
          <>
            <span className="text-slate-600">➔</span>
            <span className="text-slate-200 capitalize" translate="no">{formatFromSlug(branchSlug)}</span>
          </>
        )}
      </nav>

      <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
        <h1 className="text-3xl font-extrabold text-white capitalize mb-2">
          {capitalizeWords(dbBank)}
          {dbState && ` ➔ ${capitalizeWords(dbState)}`}
          {dbDistrict && ` ➔ ${capitalizeWords(dbDistrict)} District`}
          {dbCity && ` ➔ ${capitalizeWords(dbCity)}`}
          {dbBranch && ` ➔ ${capitalizeWords(dbBranch)}`}
        </h1>
        <p className="text-slate-400 text-sm font-light">
          {!stateSlug && "Select a State to view available districts."}
          {stateSlug && !districtSlug && "Select a District to explore cities."}
          {districtSlug && !citySlug && "Select a City to pull branch details."}
          {citySlug && !branchSlug && "Select a Branch to view full details."}
          {branchSlug && "Showing verified live branch records."}
        </p>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Querying active routing infrastructure...</p>
        </div>
      ) : (
        <>
          {!isFinalBranchView && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayCards.length > 0 ? displayCards.map((card, i) => (
                <Link href={card.url} key={i} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-blue-500 transition-all flex flex-col items-center justify-center text-center group shadow-md hover:scale-[1.02]">
                   <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                     {card.icon}
                   </div>
                   <h3 className="text-white font-bold text-base capitalize group-hover:text-blue-400 transition-colors" translate="no">{card.name.toLowerCase()}</h3>
                   <span className="text-slate-500 text-xs mt-3 group-hover:text-blue-400 transition-colors">{card.label}</span>
                </Link>
              )) : (
                <p className="text-slate-400 col-span-full text-center py-12">No regional directory items found under this scope.</p>
              )}
            </div>
          )}

          {isFinalBranchView && (
            <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto w-full">
              {branchDataToShow.length > 0 ? branchDataToShow.map((row, index) => {
                const contact = formatContactNumber(row.contact || row.phone);
                return (
                  <div key={index} className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden flex flex-col transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] -z-10"></div>
                    <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-700/50">
                      <div className="flex-1 pr-4">
                        <h3 className="text-2xl md:text-3xl font-extrabold text-blue-400 mb-2 capitalize" translate="no">{(row.bank || 'N/A').toLowerCase()}</h3>
                        <p className="text-lg font-semibold text-slate-300 capitalize" translate="no">📍 {(row.branch || 'N/A').toLowerCase()}</p>
                      </div>
                      <span className="bg-blue-600 text-white px-5 py-3 rounded-xl text-lg md:text-xl font-black tracking-widest shadow-md shrink-0">{row.ifsc || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 pt-2 text-sm flex-grow">
                      <div><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">City / Centre</span><span className="text-white text-base font-medium capitalize" translate="no">{(row.centre || row.city || 'N/A').toLowerCase()}</span></div>
                      <div><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">Contact Number</span><span className="text-white text-base font-medium">{contact}</span></div>
                      <div><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">MICR Code</span><span className="text-white text-base font-medium">{row.micr || 'Not Available'}</span></div>
                      <div><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">District</span><span className="text-white text-base font-medium capitalize" translate="no">{(row.district || 'N/A').toLowerCase()}</span></div>
                      <div className="col-span-1 md:col-span-2"><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">State</span><span className="text-white text-base font-medium capitalize" translate="no">{(row.state || 'N/A').toLowerCase()}</span></div>
                      <div className="col-span-1 md:col-span-2"><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">Address</span><span className="text-white text-sm leading-relaxed capitalize" translate="no">{(row.address || 'N/A').toLowerCase()}</span></div>
                    </div>
                  </div>
                )
              }) : (
                <div className="col-span-full py-12 text-center text-slate-400">No active branches found matching this location.</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}