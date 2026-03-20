import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Amina K.",
    initials: "AK",
    color: "bg-purple-500",
    date: "2 weeks ago",
    text: "Very nice food and good ambiance. The chicken was perfectly grilled.",
    rating: 5,
  },
  {
    name: "Chidi M.",
    initials: "CM",
    color: "bg-blue-500",
    date: "1 month ago",
    text: "Amazing place. Delicious food and kind workers. Will definitely order again!",
    rating: 5,
  },
  {
    name: "Fatima B.",
    initials: "FB",
    color: "bg-green-500",
    date: "3 weeks ago",
    text: "Was excellent. They sell ice creams, meat and food. Their delivery is very fast.",
    rating: 5,
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="py-24 bg-foreground text-white relative overflow-hidden">
      {/* Abstract Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Testimonials</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              What Our Customers Say
            </h3>
            <p className="text-gray-400">
              Don't just take our word for it. Here is what people are saying about their experience at Afro Foods.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center shrink-0">
            <h4 className="text-5xl font-black text-white mb-2">4.2<span className="text-2xl text-gray-400">/5</span></h4>
            <div className="flex items-center justify-center gap-1 text-accent mb-2">
              {[1, 2, 3, 4].map(i => <Star key={i} className="fill-accent" size={20} />)}
              <Star className="fill-accent opacity-30" size={20} />
            </div>
            <p className="text-gray-400 text-sm">Based on 10 reviews</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-primary/50 transition-colors"
            >
              <Quote className="text-primary mb-6 opacity-50" size={40} />
              <p className="text-lg text-gray-200 mb-8 italic leading-relaxed min-h-[80px]">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <div className={`w-12 h-12 rounded-full ${review.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                  {review.initials}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white leading-none mb-1">{review.name}</h4>
                  <p className="text-gray-400 text-sm">{review.date}</p>
                </div>
                <div className="flex text-accent shrink-0">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-accent" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
