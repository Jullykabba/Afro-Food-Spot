import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/use-cart";

export function Hero() {
  const { openCart } = useCart();

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-foreground">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* landing page hero delicious grilled chicken african food warm colors */}
        <img
          src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=2000"
          alt="Delicious grilled chicken"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground backdrop-blur-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium tracking-wide text-white">Top Rated in Minna</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6"
          >
            Afro Foods <br/>
            <span className="text-primary">Restaurant</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed"
          >
            Delicious Meals & Chicken You'll Love. Experience the best authentic African cuisine, available for dine-in, takeaway, and delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#menu"
              className="px-8 py-4 rounded-xl font-bold bg-primary text-white shadow-[0_0_40px_-10px_rgba(249,115,22,0.8)] hover:shadow-[0_0_60px_-15px_rgba(249,115,22,1)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Order Now
              <ShoppingBag size={20} />
            </a>
            <a
              href="#about"
              className="px-8 py-4 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all flex items-center justify-center gap-2 group"
            >
              Explore Menu
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
