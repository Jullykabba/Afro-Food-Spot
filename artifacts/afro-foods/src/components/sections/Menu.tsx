import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, X, Grip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MENU_ITEMS, CATEGORIES, type Category } from "@/data/menu";
import { useCart } from "@/store/use-cart";
import { useSearch } from "@/store/use-search";
import { formatNaira, cn } from "@/lib/utils";

const categoryMap: Record<Category, { label: string }> = {
  "All":               { label: "All" },
  "Chicken Meals 🍗":  { label: "🍗 Chicken" },
  "Rice Dishes 🍛":    { label: "🍛 Rice" },
  "Local Meals 🍲":    { label: "🍲 Local" },
  "Snacks 🍩":         { label: "🍩 Snacks" },
  "Ice Cream 🍦":      { label: "🍦 Ice Cream" },
  "Drinks 🥤":         { label: "🥤 Drinks" },
};

const gradients: Record<string, string> = {
  "Chicken Meals 🍗": "from-orange-50 to-amber-100",
  "Rice Dishes 🍛":   "from-yellow-50 to-orange-100",
  "Local Meals 🍲":   "from-green-50 to-emerald-100",
  "Snacks 🍩":        "from-pink-50 to-rose-100",
  "Ice Cream 🍦":     "from-purple-50 to-pink-100",
  "Drinks 🥤":        "from-blue-50 to-cyan-100",
};

const POPULAR_IDS = new Set(["c1", "r1", "l1", "s1"]);

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const { addItem, removeItem, items, updateQuantity, openCart, totalPrice } = useCart();
  const { query, setQuery } = useSearch();
  const { toast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchCat  = activeCategory === "All" || item.category === activeCategory;
    const matchName = item.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchName;
  });

  const getQty = useCallback((id: string) =>
    items.find((i) => i.id === id)?.quantity ?? 0,
  [items]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal  = totalPrice();

  const handleAdd = (item: typeof MENU_ITEMS[0]) => {
    addItem(item);
    toast({ title: `${item.emoji} Added!`, description: item.name });
  };

  const clearAll = () => { setQuery(""); setActiveCategory("All"); };
  const hasFilter = query !== "" || activeCategory !== "All";

  return (
    <section id="menu" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Our Menu</p>
          <h3 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Discover Our Delicious <br className="hidden sm:block" /> Offerings
          </h3>
          <p className="text-muted-foreground text-base">
            From our signature grilled chicken to authentic local dishes — find your next favourite meal.
          </p>
        </div>

        {/* ── Inline Search ─────────────────────────────────────── */}
        <div className="relative max-w-xl mx-auto mb-5">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search chicken, rice, jollof…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-border rounded-2xl text-sm font-medium shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* ── Category Tabs ──────────────────────────────────────── */}
        <div className="flex overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 mb-5 gap-2 snap-x no-scrollbar">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "whitespace-nowrap px-4 py-2.5 rounded-full font-semibold text-sm shrink-0 snap-start border transition-all duration-150 flex items-center gap-1.5",
                  active
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/30"
                    : "bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
                )}
              >
                {cat === "All" && <Grip size={14} />}
                {categoryMap[cat].label}
              </button>
            );
          })}
        </div>

        {/* ── Filter Banner ──────────────────────────────────────── */}
        <AnimatePresence>
          {hasFilter && (
            <motion.div
              key="filter-banner"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
                <span className="text-sm font-medium text-foreground">
                  <span className="font-bold text-primary">{filteredItems.length}</span>
                  {" "}item{filteredItems.length !== 1 ? "s" : ""} found
                  {query && <> for <span className="text-primary font-bold">"{query}"</span></>}
                  {activeCategory !== "All" && <> in <span className="text-primary font-bold">{categoryMap[activeCategory].label}</span></>}
                </span>
                <button onClick={clearAll} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                  <X size={11} /> Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Food Grid ─────────────────────────────────────────── */}
        {filteredItems.length > 0 ? (
          /*
           * KEY trick: re-key the grid on every category change.
           * Old items unmount instantly (no sluggish layout recalc),
           * new items animate in fresh — fast & clean.
           */
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.04 } },
            }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredItems.map((item) => {
              const qty = getQty(item.id);
              const grad = gradients[item.category] ?? "from-gray-50 to-gray-100";

              return (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show:   { opacity: 1, y: 0, transition: { duration: 0.22 } },
                  }}
                  className="bg-white rounded-2xl p-3 flex flex-col border border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-shadow duration-200"
                >
                  {/* Emoji tile */}
                  <div className={cn(
                    "relative w-full h-32 rounded-xl flex items-center justify-center text-5xl mb-3 bg-gradient-to-br select-none",
                    grad
                  )}>
                    {POPULAR_IDS.has(item.id) && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide z-10">
                        Popular
                      </span>
                    )}
                    {item.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <p className="text-[13px] font-bold text-foreground leading-snug mb-1 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-sm font-extrabold text-primary mb-3">
                      {formatNaira(item.price)}
                    </p>

                    {/* Cart control — pure CSS transitions, no framer nested */}
                    <div className="mt-auto">
                      {qty > 0 ? (
                        <div className="flex items-center justify-between h-10 border-2 border-primary rounded-xl px-1.5 bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, qty - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="font-bold text-sm text-foreground w-5 text-center">{qty}</span>
                          <button
                            onClick={() => updateQuantity(item.id, qty + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdd(item)}
                          className="w-full h-10 rounded-xl bg-primary text-white font-bold text-[13px] flex items-center justify-center gap-1.5 hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-sm shadow-primary/20"
                        >
                          <Plus size={14} /> Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h4 className="text-xl font-bold text-foreground mb-2">No items found</h4>
            <p className="text-muted-foreground text-sm max-w-xs mb-5">
              {query ? `Nothing matched "${query}". Try a different word.` : "No items in this category yet."}
            </p>
            <button
              onClick={clearAll}
              className="px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              Show All Items
            </button>
          </div>
        )}

        {/* ── Floating View-Cart pill ────────────────────────────── */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              key="cart-pill"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40"
            >
              <button
                onClick={openCart}
                className="flex items-center gap-3 bg-primary text-white px-5 py-3 rounded-2xl shadow-2xl shadow-primary/40 font-bold text-sm hover:bg-primary/90 active:scale-95 transition-all duration-150"
              >
                <span className="bg-white/25 rounded-lg w-7 h-7 flex items-center justify-center text-xs font-extrabold">
                  {totalItems}
                </span>
                View Cart
                <span className="font-extrabold">{formatNaira(cartTotal)}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
