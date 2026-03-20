import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, SearchX } from "lucide-react";
import { MENU_ITEMS, CATEGORIES, type Category } from "@/data/menu";
import { useCart } from "@/store/use-cart";
import { useSearch } from "@/store/use-search";
import { formatNaira, cn } from "@/lib/utils";

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const { addItem } = useCart();
  const { query } = useSearch();

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Our Menu</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Discover Our Delicious <br className="hidden sm:block"/> Offerings
          </h3>
          <p className="text-muted-foreground">
            From our signature grilled chicken to authentic local dishes, find your next favorite meal right here.
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 no-scrollbar gap-3 snap-x">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "whitespace-nowrap px-6 py-3 rounded-full font-semibold transition-all shadow-sm snap-start",
                activeCategory === category
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "bg-white text-muted-foreground hover:bg-gray-50 border border-border"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={item.id}
                  className="bg-white rounded-[2rem] p-4 flex flex-col group shadow-sm border border-border/60 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  {/* Image Placeholder (Emoji) */}
                  <div className="bg-muted/50 w-full aspect-square rounded-[1.5rem] flex items-center justify-center text-[5rem] mb-4 group-hover:scale-105 transition-transform duration-500">
                    {item.emoji}
                  </div>
                  
                  <div className="px-2 flex-1 flex flex-col">
                    <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">
                      {item.category.replace(/[^a-zA-Z\s]/g, '')}
                    </div>
                    <h4 className="text-lg font-bold text-foreground leading-tight mb-4 flex-1">
                      {item.name}
                    </h4>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-extrabold text-foreground">
                        {formatNaira(item.price)}
                      </span>
                      <button
                        onClick={() => addItem(item)}
                        className="w-10 h-10 rounded-full bg-foreground text-white flex items-center justify-center hover:bg-primary transition-colors shadow-md active:scale-95"
                        aria-label="Add to cart"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <SearchX size={32} className="text-muted-foreground" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">No items found</h4>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any items matching "{query}". Try searching for something else or exploring different categories.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
