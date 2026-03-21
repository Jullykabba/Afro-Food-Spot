import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, Phone, ArrowLeft, Building2, MapPin, HandCoins, CreditCard, ChevronRight, Copy, Check } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { formatNaira } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type CheckoutStep = "CART" | "DETAILS" | "PAYMENT";
type ServiceType = "Dine-In" | "Takeaway" | "Delivery";
type PaymentMethod = "Cash on Delivery" | "POS on Delivery" | "Bank Transfer" | "Online" | "Wallet" | null;

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const [step, setStep] = useState<CheckoutStep>("CART");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("Delivery");
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [copied, setCopied] = useState(false);

  // Reset form when drawer closes
  const handleClose = () => {
    closeCart();
    setTimeout(() => {
      setStep("CART");
    }, 300);
  };

  const isDetailsValid =
    name.trim() !== "" &&
    phone.trim() !== "" &&
    (serviceType !== "Delivery" || address.trim() !== "");

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("9126348476");
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Account number copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const showComingSoon = () => {
    toast({
      title: "Coming Soon 🚀",
      description: "Online payment coming soon! Please use bank transfer or pay on delivery.",
    });
  };

  const handlePlaceOrder = () => {
    if (!paymentMethod || paymentMethod === "Online" || paymentMethod === "Wallet") {
      toast({
        variant: "destructive",
        title: "Action Required",
        description: "Please select a valid payment method",
      });
      return;
    }

    const total = formatNaira(totalPrice());
    
    let message = `🍽️ *New Order - Afro Foods Restaurant*\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Service: ${serviceType}\n`;
    message += `Address: ${address}\n\n`;
    
    message += `🛒 *Order Items:*\n`;
    items.forEach(item => {
      message += `- ${item.name} x${item.quantity} = ${formatNaira(item.price * item.quantity)}\n`;
    });
    
    message += `\n💰 *Payment Method:* ${paymentMethod}\n`;
    message += `💵 *Total: ${total}*\n\n`;
    message += `Please confirm my order! Thank you 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2349126348476?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Cleanup after order
    toast({
      title: "Order Submitted! 🎉",
      description: "Continuing on WhatsApp...",
    });
    clearCart();
    handleClose();
    setName("");
    setPhone("");
    setAddress("");
    setPaymentMethod(null);
  };

  const slideVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { x: "-100%", opacity: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
  };
  
  const slideVariantsReverse = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { x: "100%", opacity: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-background shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-white z-20 shrink-0">
              <div className="flex items-center gap-3">
                {step !== "CART" && (
                  <button
                    onClick={() => setStep(step === "PAYMENT" ? "DETAILS" : "CART")}
                    className="p-1.5 hover:bg-muted rounded-full transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {step === "CART" && "Your Cart"}
                  {step === "DETAILS" && "Order Details"}
                  {step === "PAYMENT" && "Payment"}
                  {step === "CART" && (
                    <span className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full">
                      {items.length} items
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                
                {/* STEP 1: CART */}
                {step === "CART" && (
                  <motion.div
                    key="cart"
                    variants={slideVariantsReverse}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0 flex flex-col h-full bg-background"
                  >
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-4xl">
                            🛒
                          </div>
                          <p className="font-medium text-lg">Your cart is empty</p>
                          <button 
                            onClick={handleClose}
                            className="text-primary font-medium hover:underline"
                          >
                            Browse Menu
                          </button>
                        </div>
                      ) : (
                        items.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 p-3 bg-white rounded-2xl border border-border/50 shadow-sm"
                          >
                            <div className="w-20 h-20 bg-muted/30 rounded-xl flex items-center justify-center text-4xl shrink-0">
                              {item.emoji}
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div className="flex justify-between items-start gap-2">
                                <h3 className="font-bold text-[15px] leading-tight line-clamp-2">
                                  {item.name}
                                </h3>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors shrink-0"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                <p className="font-bold text-primary text-lg">
                                  {formatNaira(item.price * item.quantity)}
                                </p>
                                
                                <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-2 py-1">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 hover:bg-white rounded-md text-foreground transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="text-sm font-bold w-4 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 hover:bg-white rounded-md text-foreground transition-colors"
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

                    {items.length > 0 && (
                      <div className="p-5 bg-white border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] shrink-0">
                        <div className="flex items-center justify-between text-lg font-bold mb-4">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="text-2xl">{formatNaira(totalPrice())}</span>
                        </div>
                        
                        <button
                          onClick={() => setStep("DETAILS")}
                          className="w-full py-4 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          Proceed to Checkout
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 2: DETAILS */}
                {step === "DETAILS" && (
                  <motion.div
                    key="details"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0 flex flex-col h-full bg-background"
                  >
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
                          <input 
                            type="text" 
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-1.5">Phone Number</label>
                          <input 
                            type="tel" 
                            placeholder="08012345678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-1.5">Service Type</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(["Dine-In", "Takeaway", "Delivery"] as ServiceType[]).map((type) => (
                              <button
                                key={type}
                                onClick={() => setServiceType(type)}
                                className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                                  serviceType === type 
                                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                                    : "bg-white text-muted-foreground border-border hover:border-primary/50"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-1.5">
                            {serviceType === "Delivery" ? "Delivery Address" : "Additional Instructions (Optional)"}
                          </label>
                          <textarea 
                            rows={3}
                            placeholder={serviceType === "Delivery" ? "Enter your full delivery address..." : "Any special requests?"}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="p-5 bg-white border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] shrink-0 space-y-3">
                      <button
                        onClick={() => setStep("PAYMENT")}
                        disabled={!isDetailsValid}
                        className="w-full py-4 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
                      >
                        Continue to Payment
                      </button>
                      <button
                        onClick={() => setStep("CART")}
                        className="w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Back to Cart
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: PAYMENT */}
                {step === "PAYMENT" && (
                  <motion.div
                    key="payment"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0 flex flex-col h-full bg-background"
                  >
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                      
                      {/* Section A: Pay on Delivery */}
                      <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                        <div className="flex items-center gap-2 mb-4 font-bold text-foreground">
                          <HandCoins className="text-primary" size={20} />
                          <h3>Pay on Delivery</h3>
                        </div>
                        <div className="space-y-2">
                          {["Cash on Delivery", "POS on Delivery"].map((method) => (
                            <label key={method} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === method ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                              <input 
                                type="radio" 
                                name="payment" 
                                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                                checked={paymentMethod === method}
                                onChange={() => setPaymentMethod(method as PaymentMethod)}
                              />
                              <span className="ml-3 font-medium text-sm">{method}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Section B: Bank Transfer */}
                      <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                        <div className="flex items-center gap-2 mb-4 font-bold text-foreground">
                          <Building2 className="text-primary" size={20} />
                          <h3>Bank Transfer</h3>
                        </div>
                        
                        <label className={`block mb-4 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === "Bank Transfer" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              name="payment" 
                              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                              checked={paymentMethod === "Bank Transfer"}
                              onChange={() => setPaymentMethod("Bank Transfer")}
                            />
                            <span className="ml-3 font-medium text-sm">Transfer to Account</span>
                          </div>
                        </label>

                        {paymentMethod === "Bank Transfer" && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-muted/40 rounded-xl p-4 space-y-3 mt-2"
                          >
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Bank:</span>
                              <span className="font-bold">Opay</span>
                            </div>
                            <div className="flex justify-between text-sm items-center">
                              <span className="text-muted-foreground">Account Number:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg tracking-wider">9126348476</span>
                                <button 
                                  onClick={handleCopyAccount}
                                  className="p-1.5 bg-white rounded-md shadow-sm border border-border hover:bg-gray-50 text-primary transition-colors"
                                >
                                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Account Name:</span>
                              <span className="font-bold text-right">Afro Foods Restaurant</span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Section C: Online Payment */}
                      <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                        <div className="flex items-center gap-2 mb-4 font-bold text-foreground">
                          <CreditCard className="text-primary" size={20} />
                          <h3>Online Payment</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={showComingSoon}
                            className="p-3 bg-[#09A5DB]/10 text-[#09A5DB] hover:bg-[#09A5DB]/20 border border-[#09A5DB]/20 rounded-xl font-bold text-sm transition-colors"
                          >
                            Paystack
                          </button>
                          <button 
                            onClick={showComingSoon}
                            className="p-3 bg-[#F5A623]/10 text-[#F5A623] hover:bg-[#F5A623]/20 border border-[#F5A623]/20 rounded-xl font-bold text-sm transition-colors"
                          >
                            Flutterwave
                          </button>
                        </div>
                      </div>

                      {/* Section D: Mobile Wallets */}
                      <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                        <div className="flex items-center gap-2 mb-4 font-bold text-foreground">
                          <Phone className="text-primary" size={20} />
                          <h3>Mobile Wallets</h3>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={showComingSoon} className="flex-1 py-3 bg-[#1FC777]/10 text-[#1FC777] border border-[#1FC777]/20 rounded-xl font-bold text-sm flex justify-center items-center gap-1.5 transition-colors">
                            <div className="w-4 h-4 bg-[#1FC777] rounded-full"></div> Opay
                          </button>
                          <button onClick={showComingSoon} className="flex-1 py-3 bg-[#E32636]/10 text-[#E32636] border border-[#E32636]/20 rounded-xl font-bold text-sm flex justify-center items-center gap-1.5 transition-colors">
                            <div className="w-4 h-4 bg-[#E32636] rounded-full"></div> PalmPay
                          </button>
                          <button onClick={showComingSoon} className="flex-1 py-3 bg-[#502479]/10 text-[#502479] border border-[#502479]/20 rounded-xl font-bold text-sm flex justify-center items-center gap-1.5 transition-colors">
                            <div className="w-4 h-4 bg-[#502479] rounded-full"></div> Kuda
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="p-5 bg-white border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] shrink-0">
                      <div className="flex items-center justify-between text-lg font-bold mb-4">
                        <span className="text-muted-foreground">Total</span>
                        <span className="text-2xl text-primary">{formatNaira(totalPrice())}</span>
                      </div>
                      <button
                        onClick={handlePlaceOrder}
                        className="w-full py-4 rounded-xl font-bold bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                      >
                        <Phone size={20} className="fill-white" />
                        {paymentMethod === "Bank Transfer" ? "I Have Paid (WhatsApp)" : "Place Order on WhatsApp"}
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
