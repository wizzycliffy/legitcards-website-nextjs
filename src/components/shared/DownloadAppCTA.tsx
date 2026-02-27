import React from 'react';
import Link from 'next/link';

export function DownloadAppCTA() {
  return (
    <div className="w-full bg-white dark:bg-gray-900 overflow-hidden flex flex-col md:flex-row items-center border-t border-gray-100 dark:border-gray-800 relative min-h-[400px]">
      {/* Left side: Phone placeholder */}
      <div className="w-full md:w-[45%] lg:w-1/2 h-64 md:h-full min-h-[450px] flex items-end justify-center pt-8 md:pt-16 bg-[#e0e1e6] dark:bg-gray-800 relative overflow-hidden">
        {/* Phone Frame */}
        <div className="w-[230px] md:w-[260px] h-[480px] md:h-[550px] bg-white dark:bg-gray-950 rounded-t-[3rem] border-[12px] border-[#1d1d1f] dark:border-black shadow-2xl translate-y-[20px] relative overflow-hidden flex flex-col">
          {/* Dynamic Island Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90px] h-7 bg-[#1d1d1f] rounded-full z-10 flex items-center justify-end px-2">
            <div className="w-3 h-3 bg-blue-900/40 rounded-full border border-blue-800/20 mr-1"></div>
          </div>
          
          {/* Inner screen content placeholder */}
          <div className="w-full flex-1 bg-gray-50 dark:bg-gray-900 flex flex-col pt-12 px-5 gap-5 relative">
             <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-bold">A</div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-medium">Welcome,</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Alika</span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
             </div>
             
             {/* Available Balance Card */}
             <div className="w-full py-1 space-y-1">
                <span className="text-[10px] text-gray-400 font-medium ml-1">Available Balance</span>
                <div className="flex items-center gap-1 font-bold text-xl text-gray-800 dark:text-white">
                   <span className="text-green-500">₦</span> 15,584,834
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3 mt-1">
                <div className="w-full h-28 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-emerald-100 dark:border-emerald-800/30">
                   <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/30">
                     <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   </div>
                   <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">Buy Gift Card</span>
                </div>
                <div className="w-full h-28 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-blue-100 dark:border-blue-800/30">
                   <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/30">
                     <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                   </div>
                   <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">Sell Gift Card</span>
                </div>
             </div>
             
             <div className="w-full h-20 bg-white dark:bg-gray-800 rounded-2xl mt-2 flex items-center p-3 gap-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700"></div>
                <div className="flex-1">
                   <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                   <div className="h-2 w-16 bg-gray-100 dark:bg-gray-600 rounded"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Right side: Content */}
      <div className="w-full md:w-[55%] lg:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-white dark:bg-gray-900">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] leading-tight font-bold text-[#0A2540] dark:text-white mb-5">
          Download The App
        </h2>
        <p className="text-[#3b5973] dark:text-gray-300 mb-10 max-w-md text-[17px] leading-relaxed">
          Experience the best of Legit Cards on your phone or tablet. Available for iOS and Android operating systems.
        </p>
        
        <div className="flex flex-col xl:flex-row gap-4">
          <Link href="#" className="flex items-center gap-4 bg-black text-white px-8 py-[18px] rounded-full hover:bg-gray-900 transition-colors w-full xl:w-auto justify-center min-w-[240px]">
            <svg viewBox="0 0 384 512" className="w-[26px] h-[26px] fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 24 184.8 8 273.5q-9 52.8 21.4 122.6c14 31.5 30 55.8 55 53.6 24-.5 35-15 65.6-15 31.5 0 43.9 14 62.1 16.2 19.8 1.4 39-24 55-46.7 21-26.7 29.1-53.6 30.6-56.6-2-.2-53-15.1-54-68.9zM224 96c11-14 18-33 18-53 0-4.7-.5-9.3-1.4-14-19.6 1.4-44.6 13.5-59.5 29.5-12 11.5-20.2 28.5-18.2 47.5 5 1.5 10.4 2.2 15.6 2.2 16.4 0 35.5-11.7 45.5-23.2z"></path>
            </svg>
            <span className="text-[19px] font-bold">Get on iPhone</span>
          </Link>
          
          <Link href="#" className="flex items-center gap-4 bg-[#05A357] text-white px-8 py-[18px] rounded-full hover:bg-[#04914d] transition-colors w-full xl:w-auto justify-center min-w-[240px]">
            <svg viewBox="0 0 512 512" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"></path>
            </svg>
            <span className="text-[19px] font-bold tracking-tight">Get on Android</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
