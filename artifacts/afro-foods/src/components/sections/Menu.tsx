import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, SearchX, Grip, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MENU_ITEMS, CATEGORIES, type Category } from "@/data/menu";
import { useCart } from "@/store/use-cart";
import { useSearch } from "@/store/use-search";
import { formatNaira, cn } from "@/lib/utils";

const categoryMap: Record<Category, { label: string }> = {
  "All": { label: "All" },
  "Chicken Meals 🍗": { label: "🍗 Chicken" },
  "Rice Dishes 🍛": { label: "🍛 Rice" },
  "Local Meals 🍲": { label: "🍲 Local" },
  "Snacks 🍩": { label: "🍩 Snacks" },
  "Ice Cream 🍦": { label: "🍦 Ice Cream" },
  "Drinks 🥤": { label: "🥤 Drinks" },
};

const getGradientForCategory = (category: string) => {
  if (category.includes("Chicken") || category.includes("Rice")) return "from-orange-50 to-amber-100";
  if (category.includes("Local")) return "from-green-50 to-emerald-100";
  if (category.includes("Snacks") || category.includes("Ice Cream")) return "from-pink-50 to-rose-100";
  return "from-blue-50 to-cyan-100";
};

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const { addItem, items, updateQuantity, openCart } = useCart();
  const { query, setQuery } = useSearch();
  const { toast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartItemQuantity = (id: string) => {
    const cartItem = items.find((i) => i.id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item: typeof MENU_ITEMS[0]) => {
    addItem(item);
    toast({
      title: `${item.emoji} Added to cart!`,
      description: item.name,
    });
  };

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
  };

  const clearAll = () => {
    setQuery("");
    setActiveCategory("All");
  };

  const hasFilter = query.trim() !== "" || activeCategory !== "All";

  return (
    <section id="menu" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Our Menu</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Discover Our Delicious <br className="hidden sm:block" /> Offerings
          </h3>
          <p className="text-muted-foreground">
            From our signature grilled chicken to authentic local dishes, find your next favourite meal right here.
          </p>
        </div>

        {/* ── SEARCH BAR (inline, always visible) ─────────────────────────── */}
        <div className="relative max-w-xl mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search for chicken, rice, jollof…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-border rounded-2xl text-sm font-medium shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── CATEGORY FILTER TAB BAR ──────────────────────────────────────── */}
        <div className="flex overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 no-scrollbar gap-2 snap-x">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <motion.button
                key={category}
                whileTap={{ scale: 0.93 }}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "whitespace-nowrap px-4 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm snap-start flex items-center gap-1.5 shrink-0 border",
                  isActive
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/30"
                    : "bg-white text-muted-foreground hover:bg-orange-50 hover:text-primary hover:border-primary/40 border-border"
                )}
              >
                {category === "All" && (
                  <Grip size={14} className={isActive ? "text-white" : "text-muted-foreground"} />
                )}
                {categoryMap[category].label}
              </motion.button>
            );
          })}
        </div>

        {/* ── ACTIVE FILTER SUMMARY ────────────────────────────────────────── */}
        <AnimatePresence>
          {hasFilter && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-between mb-5 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5"
            >
              <span className="text-sm text-foreground font-medium">
                {filteredItems.length === 0
                  ? "No results"
                  : `${filteredItems.length} item${filteredItems.length !== 1 ? "s" : ""} found`}
                {query && (
                  <> for <span className="text-primary font-bold">"{query}"</span></>
                )}
                {activeCategory !== "All" && (
                  <> in <span className="text-primary font-bold">{categoryMap[activeCategory].label}</span></>
                )}
              </span>
              <button
                onClick={clearAll}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <X size={12} /> Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MENU GRID ─────────────────────────────────────────────────────── */}
        {filteredItems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const quantity = getCartItemQuantity(item.id);
                const isPopular = item.id.endsWith("1");

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="bg-white rounded-3xl p-3 flex flex-col group shadow-sm border border-border/60 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                  >
                    {/* Emoji / visual */}
                    <div
                      className={cn(
                        "relative w-full h-36 rounded-2xl flex items-center justify-center text-[4rem] mb-4 bg-gradient-to-br overflow-hidden select-none",
                        getGradientForCategory(item.category)
                      )}
                    >
                      {isPopular && (
                        <div className="absolute top-2.5 left-2.5 bg-primary text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                          Popular
                        </div>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        {item.emoji}
                      </motion.div>
                    </div>

                    <div className="px-1 flex-1 flex flex-col pb-1">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h4 className="text-[14px] font-bold text-foreground leading-snug flex-1">
                          {item.name}
                        </h4>
                        <span className="text-sm font-extrabold text-primary shrink-0">
                          {formatNaira(item.price)}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <AnimatePresence mode="wait">
                          {quantity > 0 ? (
                            <motion.div
                              key="stepper"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              transition={{ duration: 0.15 }}
                              className="flex items-center justify-between w-full h-11 bg-white border-2 border-primary rounded-xl px-2 shadow-sm"
                            >
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={() => updateQuantity(item.id, quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </motion.button>
                              <span className="font-bold text-foreground text-base w-5 text-center">
                                {quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={() => updateQuantity(item.id, quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </motion.button>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="add"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              transition={{ duration: 0.15 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAddToCart(item)}
                              className="w-full h-11 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
                            >
                              <Plus size={16} />
                              Add to Cart
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 text-3xl">
              🔍
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">No items found</h4>
            <p className="text-muted-foreground max-w-sm mb-6">
              {query
                ? `Nothing matched "${query}". Try a different word.`
                : "No items in this category yet."}
            </p>
            <button
              onClick={clearAll}
              className="px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              Show All Items
            </button>
          </motion.div>
        )}

        {/* ── VIEW CART STICKY CTA ─────────────────────────────────────────── */}
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openCart}
                className="flex items-center gap-3 bg-primary text-white px-6 py-3.5 rounded-2xl shadow-2xl shadow-primary/40 font-bold text-sm"
              >
                <span className="bg-white/20 rounded-lg w-7 h-7 flex items-center justify-center font-bold text-xs">
                  {items.reduce((t, i) => t + i.quantity, 0)}
                </span>
                View Cart
                <span className="font-extrabold">
                  {formatNaira(items.reduce((t, i) => t + i.price * i.quantity, 0))}
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
