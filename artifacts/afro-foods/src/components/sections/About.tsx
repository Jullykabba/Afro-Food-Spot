import { motion } from "framer-motion";
import { MapPin, Phone, Star, Clock } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm">About Us</h2>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
              The Best Chicken Spot in <span className="text-primary">Minna</span>
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Afro Foods Restaurant is a popular food spot in Minna, Niger State, known for delicious meals, quality chicken and local dishes, friendly staff and great ambiance. We serve authentic African cuisine with love and passion.
            </p>
            
            <div className="pt-6 grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent mb-4">
                  <Star size={24} className="fill-accent" />
                </div>
                <h4 className="font-bold text-2xl text-foreground">4.2/5</h4>
                <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-4">
                  <Clock size={24} />
                </div>
                <h4 className="font-bold text-xl text-foreground mt-2">14 Hrs</h4>
                <p className="text-sm text-muted-foreground mt-1">Open Daily (8am-10pm)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Image Card */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-auto lg:h-[600px]">
              {/* interior restaurant ambiance warm lighting */}
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000" 
                alt="Restaurant Ambiance" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Overlay Info Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary shrink-0 mt-1" size={20} />
                    <p className="text-sm font-medium text-foreground">
                      Sir Kashim Ibrahim Road, Minna, 920101, Niger State, Nigeria
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-primary shrink-0" size={20} />
                    <p className="text-sm font-medium text-foreground">0912 634 8476</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative blob */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
