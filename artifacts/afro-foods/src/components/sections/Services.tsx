import { motion } from "framer-motion";
import { Utensils, ShoppingBag, Truck } from "lucide-react";

const SERVICES = [
  {
    icon: Utensils,
    title: "Dine-in",
    description: "Enjoy our warm, welcoming atmosphere and premium service right at our restaurant.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: ShoppingBag,
    title: "Takeaway",
    description: "In a rush? Order ahead and pick up your delicious food perfectly packed and ready to go.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: Truck,
    title: "Delivery",
    description: "Get fresh, hot food delivered directly to your doorstep anywhere in Minna quickly.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Our Services</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            How We Serve You
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background rounded-3xl p-8 text-center border border-border hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 ${service.bg} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  <Icon size={32} className={service.color} />
                </div>
                <h4 className="text-2xl font-bold text-foreground mb-3">{service.title}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
