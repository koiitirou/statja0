'use client';
import Script from 'next/script';


const GoogleAdsense = () => (
  <>
    {process.env.NODE_ENV === 'production' && (
      <Script
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7235402962103532'
        crossOrigin='anonymous'
        strategy='afterInteractive'
      />
    )}
  </>
);

export default GoogleAdsense;
