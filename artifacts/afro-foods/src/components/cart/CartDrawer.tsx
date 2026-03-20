import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, Phone } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { formatNaira } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;

    const total = formatNaira(totalPrice());
    
    let message = `🍽️ *New Order from Afro Foods Website*\n\nItems:\n`;
    items.forEach(item => {
      message += `- ${item.name} x${item.quantity} = ${formatNaira(item.price * item.quantity)}\n`;
    });
    
    message += `\n*Total: ${total}*\n\nPlease confirm my order!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2349126348476?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-white z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Your Cart
                <span className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full">
                  {items.length} items
                </span>
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-4xl">
                    🛒
                  </div>
                  <p className="font-medium">Your cart is empty</p>
                  <button 
                    onClick={closeCart}
                    className="text-primary hover:underline"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-background rounded-2xl border border-border/50"
                  >
                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl shrink-0">
                      {item.emoji}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-bold text-primary">
                          {formatNaira(item.price * item.quantity)}
                        </p>
                        
                        <div className="flex items-center gap-3 bg-white rounded-lg px-2 py-1 shadow-sm border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border bg-white space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary text-2xl">{formatNaira(totalPrice())}</span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-bold bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={20} className="fill-white" />
                  Checkout via WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
