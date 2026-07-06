// 2. Fetch Districts/Cities Logic inside DynamicIfscPage
// Inside your useEffect where you fetch data, ensure we differentiate between District and City
  
  // Logic to show Districs vs Cities
  let displayCards: { name: string; url: string }[] = [];
  
  if (dataList.length > 0) {
    if (bankSlug && !stateSlug) {
      // Show States
      const states = Array.from(new Set(dataList.map(d => d.state))).filter(Boolean) as string[];
      displayCards = states.sort().map(s => ({ name: s, url: `/ifsc-directory/${bankSlug}/${formatToSlug(s)}` }));
    } 
    else if (bankSlug && stateSlug && !citySlug && !branchSlug) {
      // THIS IS THE FIX: Show Districts first
      const districts = Array.from(new Set(dataList.map(d => d.district))).filter(Boolean) as string[];
      displayCards = districts.sort().map(d => ({ name: d, url: `/ifsc-directory/${bankSlug}/${stateSlug}/${formatToSlug(d)}` }));
    }
    else if (bankSlug && stateSlug && citySlug && !branchSlug) {
      // Show Cities/Branches
      const cities = Array.from(new Set(dataList.map(d => d.centre || d.city))).filter(Boolean) as string[];
      displayCards = cities.sort().map(c => ({ name: c, url: `/ifsc-directory/${bankSlug}/${stateSlug}/${citySlug}/${formatToSlug(c)}` }));
    }
  }