import FAQs from '@/components/FAQs';
import { FeaturesSection } from '@/components/FeaturesSection';
import Hero from '@/components/Hero';

export default async function Home() {
  return (
    <div className="">
      <Hero />
      <FAQs />
      <FeaturesSection />
    </div>
  );
}
