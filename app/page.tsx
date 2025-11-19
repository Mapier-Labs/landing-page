import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import StatusSection from '@/components/StatusSection';
import TeamSection from '@/components/TeamSection';
import WaitlistForm from '@/components/WaitlistForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StatusSection />
      <TeamSection />
      <WaitlistForm />
      <Footer />
    </main>
  );
}
