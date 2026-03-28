import React from 'react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white p-10 rounded-[32px] flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="w-14 h-14 bg-[#F3E8FF] rounded-full flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-[22px] font-bold text-[#111827] mb-3">{title}</h3>
    <p className="text-[#6B7280] text-[15px] leading-[1.6] max-w-[240px]">
      {description}
    </p>
  </div>
);

export const CardFeatures = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-[#0891B2] relative overflow-hidden">
      <div className="container mx-auto px-6 space-y-16 text-center pt-8">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-[44px] font-bold text-[#0A0637] leading-tight tracking-tight">
            Swap Admin For Playtime
          </h2>
          <p className="text-[#1F2937] text-[15px] font-medium pt-2">
            Everything you need to run your center smoothly
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard 
            icon={
              <svg className="w-6 h-6 text-[#111827]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            }
            title="All-in-one" 
            description="We love being obsessive so you don't have to with agency." 
          />
          <FeatureCard 
            icon={
              <svg className="w-6 h-6 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            }
            title="Easy to use" 
            description="An app anyone designed for a way to update and parents." 
          />
          <FeatureCard 
            icon={<span className="text-2xl">❤️</span>}
            title="Child-centered" 
            description="Focus on creating new care growth reports run the work." 
          />
        </div>

        <div className="pt-8 flex justify-center">
          <button className="bg-[#22D3EE] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#0891B2] transition-colors shadow-md">
            See all
          </button>
        </div>
      </div>
    </section>
  );
};
