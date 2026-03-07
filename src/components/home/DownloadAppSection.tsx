import React from 'react';
import { Smartphone } from 'lucide-react';
import Image from 'next/image';
import { AppDownloadButtons } from '@/components/AppDownloadButtons';
import legitMock from '@/assets/legitMock.png';

export function DownloadAppSection() {
  return (
    <section className="py-20 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-6 lg:px-10 md:px-6">
        <div className="max-w-5xl mx-auto bg-card rounded-3xl border border-border shadow-soft overflow-hidden relative group">
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 lg:p-16 gap-10">
            
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 animate-fade-in mb-2">
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-medium">Trade on the go</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                Download the <span className="gradient-text">LegitCards App</span>
              </h2>
              
              <p className="text-muted-foreground text-lg max-w-xl mx-auto md:mx-0">
                Get the best rates, instant payouts, and 24/7 customer support right from your pocket. Available on iOS and Android devices.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <AppDownloadButtons />
              </div>
            </div>
            
            {/* Visual/Image Side */}
            <div className="flex-1 w-full max-w-sm md:max-w-md animate-float relative flex justify-center">
                 <Image 
                   src={legitMock} 
                   alt="Legit Cards Mobile App" 
                   className="w-auto h-[400px] md:h-[500px] object-contain drop-shadow-2xl"
                   priority
                 />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
