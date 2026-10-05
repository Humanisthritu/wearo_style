
import CategoriesSection from "@/app/components/layout/CategoriesSection";
import HeroSection from "@/app/components/layout/HeroSection";
import NewArrivalsSection from "@/app/components/layout/NewArrivalsSection";
import OfferBanner from "@/app/components/layout/OfferBanner";
import TrendingSection from "@/app/components/layout/TrendingSection";
import TrustBadges from "@/app/components/layout/TrustBadges";


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
