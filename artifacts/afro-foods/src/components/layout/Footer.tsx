import { UtensilsCrossed, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <a href="#home" className="flex items-center gap-2 inline-flex">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                <UtensilsCrossed size={20} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Afro <span className="text-primary">Foods</span>
              </span>
            </a>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              Serving the best chicken and authentic African cuisine in Minna. Taste the love in every bite.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Menu', 'Services', 'Reviews'].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="font-medium text-white">Address:</span>
                <span className="text-gray-400">Sir Kashim Ibrahim Road, Minna, Niger State</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-medium text-white">Phone:</span>
                <span className="text-gray-400">0912 634 8476</span>
              </li>
              <li className="flex items-start gap-3 pt-2">
                <span className="bg-gray-800 text-white px-3 py-1.5 rounded-md inline-block">
                  🕒 Open Daily: 8:00 AM - 10:00 PM
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Afro Foods Restaurant. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
