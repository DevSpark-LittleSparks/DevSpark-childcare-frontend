import { Button } from '@/shared/ui/Button';
import tabletImg from '@/shared/assets/images/tablet.png';

export const WhyChoose = () => {
  return (
    <section id="why" className="py-24 bg-white">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 relative group">
          <div className="absolute -inset-4 bg-primary-100 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500" />
          <img 
            src={tabletImg} 
            alt="Tablet App Mockup" 
            className="relative rounded-3xl shadow-2xl hover:scale-[1.05] transition-transform duration-500"
          />
        </div>

        <div className="order-1 md:order-2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Why Choose <span className="text-primary-500 underline decoration-4 decoration-primary-200 underline-offset-8">LittleSparks?</span>
          </h2>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            The nursery and childcare management app that does almost everything. So you get more time with children.
          </p>
          <div className="pt-4">
            <Button variant="primary">Explore More</Button>
          </div>
        </div>
      </div>
    </section>
  );
};
