import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { BackToTop } from "@/components/layout/BackToTop";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Menu } from "@/components/sections/Menu";
import { Services } from "@/components/sections/Services";
import { Reviews } from "@/components/sections/Reviews";
import { Contact } from "@/components/sections/Contact";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      
      <main className="flex-grow pb-20 md:pb-0">
        <Hero />
        <About />
        <Menu />
        <Services />
        <Reviews />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFAB />
      <BackToTop />
      <MobileBottomNav />
    </div>
  );
}
