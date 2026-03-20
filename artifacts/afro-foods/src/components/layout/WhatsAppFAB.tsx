import { Phone } from "lucide-react";

export function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/2349126348476"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-[#25D366]/40 hover:scale-110 hover:shadow-xl transition-all group animate-bounce-slow"
      aria-label="Chat on WhatsApp"
    >
      <Phone size={28} className="fill-white" />
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with us
      </span>
    </a>
  );
}
