import { useState, useEffect } from "react";
import { Home, UtensilsCrossed, ShoppingCart, Phone } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const TABS = [
  { id: "home", label: "Home", icon: Home, href: "#home" },
  { id: "menu", label: "Menu", icon: UtensilsCrossed, href: "#menu" },
  { id: "cart", label: "Cart", icon: ShoppingCart, href: null },
  { id: "contact", label: "Contact", icon: Phone, href: "#contact" },
];

export function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState("home");
  const { totalItems, openCart } = useCart();
  const cartCount = totalItems();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "menu", "contact"];
      let current = activeTab;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
          }
        }
      }
      
      if (current !== activeTab) {
        setActiveTab(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  const handleTabClick = (tab: typeof TABS[0]) => {
    if (tab.id === "cart") {
      openCart();
    } else if (tab.href) {
      setActiveTab(tab.id);
      const element = document.getElementById(tab.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border shadow-[0_-5px_15px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && tab.id !== "cart";
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className="relative flex flex-col items-center p-2 w-16"
            >
              <div className="relative mb-1">
                <Icon 
                  size={24} 
                  className={cn(
                    "transition-colors",
                    isActive || (tab.id === "cart" && cartCount > 0) ? "text-primary" : "text-muted-foreground"
                  )} 
                />
                {tab.id === "cart" && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
