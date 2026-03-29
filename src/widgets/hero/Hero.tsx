import heroImg from '@/shared/assets/images/hero.png';

export const Hero = () => {
  return (
    <section
      className="pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(115deg, #Ccfbf1 0%, #E9D5FF 50%, #DDD6FE 100%)' }}
    >
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 max-w-xl">
          <p className="text-[#6B7280] text-[15px] font-medium tracking-wide">
            An Early childhood platform
          </p>
          <h1 className="text-5xl md:text-[64px] font-bold text-[#111827] leading-[1.05] tracking-tight">
            Less Paperwork,<br />
            More Play.
          </h1>
          <p className="text-[16px] text-[#4B5563] leading-[1.6] max-w-[420px] font-medium pt-2">
            LittleSparks team saves everything for your nursery and childcare service into one online, organized space so you can stay present with every child.
          </p>
          <div className="pt-6">
            <button className="px-8 py-3 border border-[#D1D5DB] text-[#4B5563] text-sm font-semibold rounded-[32px] hover:bg-white transition-colors shadow-sm bg-transparent">
              Request Form
            </button>
          </div>
        </div>

        <div className="relative flex justify-end items-center md:pr-4">
          <div className="relative inline-block">
            <img
              src={heroImg}
              alt="Children playing"
              className="w-full max-w-[580px] h-auto object-cover rounded-[32px] shadow-sm"
            />

          </div>
        </div>
      </div>
    </section>
  );
};
