import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import legitMock from '@/assets/legitMock.png';

export function DownloadAppCTA() {
  return (
    <div className="w-full bg-white dark:bg-gray-900 overflow-hidden flex flex-col md:flex-row items-center border-t border-gray-100 dark:border-gray-800 relative min-h-[400px]">
      {/* Left side: Phone placeholder */}
      <div className="w-full md:w-[45%] lg:w-1/2 h-64 md:h-full min-h-[450px] flex items-end justify-center pt-8 md:pt-16 bg-[#e0e1e6] dark:bg-gray-800 relative overflow-hidden">
        {/* Phone Frame Image */}
        <div className="relative w-full h-[400px] md:h-[550px] flex items-end justify-center">
           <Image 
             src={legitMock} 
             alt="Legit Cards Mobile App" 
             className="w-auto h-full object-contain translate-y-8"
             priority
           />
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
          <Link href="https://apps.apple.com/us/app/legitcards-gift-cards-app/id6448065082" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-black text-white px-8 py-[18px] rounded-full hover:bg-gray-900 transition-colors w-full xl:w-auto justify-center min-w-[240px]">
            <svg viewBox="0 0 384 512" className="w-[26px] h-[26px] fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 24 184.8 8 273.5q-9 52.8 21.4 122.6c14 31.5 30 55.8 55 53.6 24-.5 35-15 65.6-15 31.5 0 43.9 14 62.1 16.2 19.8 1.4 39-24 55-46.7 21-26.7 29.1-53.6 30.6-56.6-2-.2-53-15.1-54-68.9zM224 96c11-14 18-33 18-53 0-4.7-.5-9.3-1.4-14-19.6 1.4-44.6 13.5-59.5 29.5-12 11.5-20.2 28.5-18.2 47.5 5 1.5 10.4 2.2 15.6 2.2 16.4 0 35.5-11.7 45.5-23.2z"></path>
            </svg>
            <span className="text-[19px] font-bold">Get on iPhone</span>
          </Link>
          
          <Link href="https://play.google.com/store/apps/details?id=com.legitcardsusers" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#05A357] text-white px-8 py-[18px] rounded-full hover:bg-[#04914d] transition-colors w-full xl:w-auto justify-center min-w-[240px]">
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
