import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Services } from '@/components/landing/Services';
import { Stats } from '@/components/landing/Stats';
import { Testimonials } from '@/components/landing/Testimonials';
import { Contact } from '@/components/landing/Contact';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Services />
        <Stats />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
