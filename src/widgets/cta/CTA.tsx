import { Button } from '@/shared/ui/Button';

export const CTA = () => {
  return (
    <section id="discover" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-[#0A0637] rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform" />

          <h3 className="text-sm font-bold text-white uppercase tracking-widest italic opacity-80">
            Educators change lives, we're just their cheerleaders
          </h3>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white">
            Discover <span className="text-[#1D9E75]">LittleSparks!</span>
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto font-medium">
            Ready to transform your early childhood service with streamlined paperwork, enhanced family engagement and safety features? 
            <br /> <span className="mt-4 block font-bold">Begin your journey to simplified management.</span>
          </p>
          <div className="pt-6">
            <Button variant="secondary" size="lg" className="rounded-full px-12 py-4 bg-white text-[#0F6E56] hover:bg-gray-100 shadow-xl">
              Try it out
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
