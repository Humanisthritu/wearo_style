
import CategoriesSection from "@/components/layout/CategoriesSection";
import HeroSection from "@/components/layout/HeroSection";
import NewArrivalsSection from "@/components/layout/NewArrivalsSection";
import OfferBanner from "@/components/layout/OfferBanner";
import TrendingSection from "@/components/layout/TrendingSection";
import TrustBadges from "@/components/layout/TrustBadges";


export default function Home() {
  return (
  <>
   <HeroSection/>
   <TrustBadges/>
   <CategoriesSection/>
   <TrendingSection/>
   <OfferBanner/>
   <NewArrivalsSection/>
  </>
  );
}
