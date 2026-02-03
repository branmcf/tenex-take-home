import Hero from "./components/Hero";
import HeroStats from "./components/HeroStats";
import LogoCloud from "./components/LogoCloud";
import PlatformSplit from "./components/PlatformSplit";
import ProductBreakdown from "./components/ProductBreakdown";
import StackSection from "./components/StackSection";
import FeatureGrid from "./components/FeatureGrid";
import FeatureAlts from "./components/FeatureAlts";
import CTA from "./components/CTA";
import Testimonials from "./components/Testimonials";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <HeroStats />
      <LogoCloud />
      <PlatformSplit />
      <ProductBreakdown />
      <StackSection />
      <FeatureGrid />
      <FeatureAlts />
      <CTA />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}
