// @ts-nocheck
'use client';

import { useEffect } from 'react';

export default function AdBanner({ dataAdSlot, dataAdFormat = 'auto', dataFullWidthResponsive = true }) {
  useEffect(() => {
    try {
      // 🚨 Safe ad loading logic to prevent Next.js Hydration errors
      if (typeof window !== "undefined") {
        const adsbygoogle = (window as any).adsbygoogle || [];
        // Ensures the ad placement is pushed only once per component mount
        adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense Error: Failed to load ads", error);
    }
  }, []);

  return (
    <div className="w-full my-8 flex justify-center items-center overflow-hidden bg-slate-900/30 rounded-2xl border border-slate-700/50 p-2 min-h-[100px] relative">
      {/* 
        NOTE: Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your official AdSense Publisher ID in the future.
      */}
      <ins className="adsbygoogle w-full max-w-full"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" 
           data-ad-slot={dataAdSlot}
           data-ad-format={dataAdFormat}
           data-full-width-responsive={dataFullWidthResponsive.toString()}>
      </ins>
      
      {/* Watermark placeholder until ads are approved and active */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none opacity-20">
        <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Advertisement Space</span>
      </div>
    </div>
  );
}