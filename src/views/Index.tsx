'use client';
import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { DownloadAppSection } from "@/components/home/DownloadAppSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { SupportedCardsSection } from "@/components/home/SupportedCardsSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <DownloadAppSection />
      <HowItWorksSection />
      <SupportedCardsSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
