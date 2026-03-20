import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingBag, Menu, X, UtensilsCrossed, Search, HomeIcon, Info, Layers, Star, Phone } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { useSearch } from "@/store/use-search";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { name: "Home", href: "#home", icon: HomeIcon },
  { name: "About", href: "#about", icon: Info },
  { name: "Menu", href: "#menu", icon: UtensilsCrossed },
  { name: "Services", href: "#services", icon: Layers },
  { name: "Reviews", href: "#reviews", icon: Star },
  { name: "Contact", href: "#contact", icon: Phone },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { openCart, totalItems } = useCart();
  const { query, setQuery } = useSearch();
  const itemsCount = totalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scroll Spy
      const sections = NAV_LINKS.map(link => link.name.toLowerCase());
      let current = activeSection;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold based on viewport
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
          }
        }
      }
      if (current !== activeSection) {
        setActiveSection(current);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(href.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm py-3" 
            : "bg-white border-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#home" onClick={(e) => handleLinkClick(e, "#home")} className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md shadow-primary/20">
              <UtensilsCrossed size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">
              Afro <span className="text-primary">Foods</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 mx-auto bg-muted/30 px-2 py-1.5 rounded-full border border-border/50">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.name.toLowerCase();
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Search */}
            <div className="hidden md:flex relative w-48 lg:w-64 transition-all focus-within:w-64 lg:focus-within:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/20 rounded-full text-sm transition-all outline-none"
              />
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors hover:bg-primary/5 rounded-full"
            >
              {isSearchExpanded ? <X size={20} /> : <Search size={20} />}
            </button>

            <button
              onClick={openCart}
              className="relative p-2.5 text-foreground hover:text-primary transition-colors bg-muted/50 hover:bg-primary/5 rounded-full"
            >
              <ShoppingBag size={20} />
              {itemsCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                >
                  {itemsCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-muted rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white border-t border-border px-4 py-3"
            >
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search for food..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/20 rounded-xl text-sm transition-all outline-none"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[65px] bg-white border-b border-border shadow-xl z-40 lg:hidden rounded-b-3xl"
          >
            <div className="flex flex-col p-4 space-y-2">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = activeSection === link.name.toLowerCase();
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={cn(
                      "flex items-center gap-4 text-lg font-medium p-4 rounded-2xl transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                    )}
                  >
                    <Icon size={24} className={isActive ? "text-primary" : "text-muted-foreground"} />
                    {link.name}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
