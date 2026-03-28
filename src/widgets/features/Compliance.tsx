import { Button } from '@/shared/ui/Button';
import dashboardImg from '@/shared/assets/images/dashboard.png';

export const Compliance = () => {
  return (
    <section id="safety" className="py-24 bg-[#F0FAF9] relative overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-white/50 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-500" />
          <img 
            src={dashboardImg} 
            alt="Safety and Compliance Dashboard" 
            className="relative rounded-3xl shadow-2xl hover:scale-[1.03] transition-transform duration-500"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Safety & Compliance - <br />
            <span className="text-[#1D9E75]">Effortlessly Archived</span>
          </h2>
          <p className="text-lg text-gray-700 font-medium leading-relaxed">
            You spend precious time in the same place. You'll save countless hours on paperwork - know exactly how it's amazing to get all reporting sheets done in one place for your whole centre.
          </p>
          <div className="pt-4">
            <Button className="bg-[#0F6E56] hover:bg-[#04342C]">Discover Us</Button>
          </div>
        </div>
      </div>
    </section>
  );
};
