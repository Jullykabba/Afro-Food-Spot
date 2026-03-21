import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, SearchX, Grip } from "lucide-react";
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
  const { addItem, items, updateQuantity } = useCart();
  const { query } = useSearch();
  const { toast } = useToast();

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
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      const top = menuSection.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section id="menu" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Our Menu</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Discover Our Delicious <br className="hidden sm:block" /> Offerings
          </h3>
          <p className="text-muted-foreground">
            From our signature grilled chicken to authentic local dishes, find your next favorite meal right here.
          </p>
        </div>

        {/* Category Filter Tab Bar */}
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 no-scrollbar gap-3 snap-x">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <motion.button
                key={category}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "whitespace-nowrap px-5 py-2.5 rounded-full font-semibold transition-all shadow-sm snap-start flex items-center gap-2 shrink-0",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/30 -translate-y-0.5"
                    : "bg-white text-muted-foreground hover:bg-gray-50 border border-border"
                )}
              >
                {category === "All" && (
                  <Grip size={16} className={isActive ? "text-white" : "text-muted-foreground"} />
                )}
                {categoryMap[category].label}
              </motion.button>
            );
          })}
        </div>

        {/* Active filter label */}
        {activeCategory !== "All" && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredItems.length} items</span> in{" "}
              <span className="text-primary font-semibold">{categoryMap[activeCategory].label}</span>
            </span>
            <button
              onClick={() => setActiveCategory("All")}
              className="text-xs text-muted-foreground underline hover:text-primary transition-colors"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const quantity = getCartItemQuantity(item.id);
                const isPopular = item.id.endsWith("1");

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92, y: -8 }}
                    transition={{ duration: 0.22, delay: index * 0.04 }}
                    className="bg-white rounded-3xl p-3 flex flex-col group shadow-sm border border-border/60 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                  >
                    {/* Emoji / Image area */}
                    <div
                      className={cn(
                        "relative w-full h-36 rounded-2xl flex items-center justify-center text-[4rem] mb-4 bg-gradient-to-br overflow-hidden",
                        getGradientForCategory(item.category)
                      )}
                    >
                      {isPopular && (
                        <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                          Popular
                        </div>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        {item.emoji}
                      </motion.div>
                    </div>

                    <div className="px-2 flex-1 flex flex-col pb-2">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="text-[15px] font-bold text-foreground leading-tight flex-1">
                          {item.name}
                        </h4>
                        <span className="text-base font-extrabold text-primary shrink-0">
                          {formatNaira(item.price)}
                        </span>
                      </div>

                      <div className="mt-auto pt-3">
                        <AnimatePresence mode="wait">
                          {quantity > 0 ? (
                            <motion.div
                              key="stepper"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.15 }}
                              className="flex items-center justify-between w-full h-12 bg-white border-2 border-primary rounded-xl px-2 shadow-sm"
                            >
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              >
                                <Minus size={18} />
                              </motion.button>
                              <span className="font-bold text-foreground text-lg w-6 text-center">
                                {quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              >
                                <Plus size={18} />
                              </motion.button>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="add"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.15 }}
                              whileTap={{ scale: 0.95 }}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => handleAddToCart(item)}
                              className="w-full h-12 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
                            >
                              <Plus size={18} />
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
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <SearchX size={32} className="text-muted-foreground" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">No items found</h4>
            <p className="text-muted-foreground max-w-md">
              {query
                ? `No results for "${query}". Try a different search term.`
                : `No items in this category yet.`}
            </p>
            <button
              onClick={() => { setActiveCategory("All"); }}
              className="mt-4 px-6 py-2 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              View All Items
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
