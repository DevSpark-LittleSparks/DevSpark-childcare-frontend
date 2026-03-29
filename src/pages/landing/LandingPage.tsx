import { Header } from '@/widgets/header/Header';
import { Hero } from '@/widgets/hero/Hero';
import { WhyChoose } from '@/widgets/features/WhyChoose';
import { CardFeatures } from '@/widgets/features/CardFeatures';
import { Compliance } from '@/widgets/features/Compliance';
import { CTA } from '@/widgets/cta/CTA';
import { Footer } from '@/widgets/footer/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-900 font-sans">
      <Header />
      <main>
        <Hero />
        <WhyChoose />
        <CardFeatures />
        <Compliance />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
