import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authAPI, orderAPI, paymentAPI } from "../../api";
import { clearCart } from "../../store/cartSlice";
import Loader from "../../components/common/Loader";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import toast from "react-hot-toast";

const getImage = (images) => {
  if (!images) return "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg";
  if (Array.isArray(images)) return images[0] || "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg";
  if (typeof images === "string") return images.split(",")[0].trim() || "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg";
  return "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg";
};

const emptyAddress = {
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [submitting, setSubmitting] = useState(false);

  const getItemProduct = (item) => item.product || {};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authAPI.getMe();
        const savedAddresses = res.data.data?.addresses || [];
        setAddresses(savedAddresses);
        setSelectedAddress((savedAddresses.find((address) => address.isDefault) || savedAddresses[0] || null)?.id || null);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.product?.price || item.price || 0) * item.quantity, 0),
    [items]
  );
  const deliveryCharge = subtotal >= 999 ? 0 : 99;
  const total = subtotal + deliveryCharge;

  const resetAddressForm = () => setAddressForm(emptyAddress);

  const handleSaveAddress = () => {
    const requiredFields = [
      addressForm.fullName,
      addressForm.phone,
      addressForm.line1,
      addressForm.city,
      addressForm.state,
      addressForm.pincode,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      toast.error("Please fill all required address fields");
      return;
    }

    const newAddress = {
      ...addressForm,
      id: `local-${Date.now()}`,
      isDefault: addresses.length === 0,
    };

    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress.id);
    setShowAddressForm(false);
    resetAddressForm();
    toast.success("Address saved");
  };

  const selectedAddressObject = addresses.find((address) => address.id === selectedAddress) || null;

  const handlePayment = async () => {
    try {
      if (!selectedAddressObject) {
        toast.error("Select an address first");
        return;
      }

      if (typeof window === "undefined" || !window.Razorpay) {
        toast.error("Razorpay checkout script is not available");
        return;
      }

      setSubmitting(true);

      const { data } = await paymentAPI.createOrder(total);
      const { orderId, amount, currency, keyId } = data.data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "SHOEMART",
        description: "Premium Footwear",
        order_id: orderId,
        method: { upi: true },
        handler: async (response) => {
          try {
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const orderRes = await orderAPI.create({
              addressId: selectedAddressObject.id?.startsWith("local-") ? undefined : selectedAddressObject.id,
              address: selectedAddressObject?.id?.startsWith("local-") ? selectedAddressObject : undefined,
              paymentMethod: "RAZORPAY",
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              items: items.map((item) => ({
                productId: item.product?.id || item.productId,
                quantity: item.quantity,
                size: item.size,
                price: item.product?.price || item.price || 0,
              })),
              subtotal,
              deliveryCharge,
              total,
            });

            dispatch(clearCart());
            toast.success("Order placed successfully! 🎉");
            navigate(`/orders/${orderRes.data.data.id}`);
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed. Contact support.");
            setSubmitting(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: selectedAddressObject?.phone,
        },
        theme: { color: "#C9A84C" },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            toast.error("Payment cancelled");
          },
        },
      });

      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to initiate payment");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader full />;
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-obsidian text-ivory flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-4xl text-gold mb-4">Your cart is empty</h1>
        <p className="text-ivory/60 mb-8">Add products to continue to checkout.</p>
        <Link to="/products" className="btn-gold px-6 py-3">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-ivory py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl">Checkout</h1>
            <p className="text-ivory/60 mt-2">Step {step} of 3</p>
          </div>
          <Link to="/cart" className="text-gold hover:text-ivory transition-colors inline-flex items-center gap-2">
            <ChevronLeft size={16} /> Back to Cart
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-8 text-sm">
          {[
            { id: 1, label: "Address" },
            { id: 2, label: "Review" },
            { id: 3, label: "Payment" },
          ].map((item, index) => (
            <div key={item.id} className="flex items-center flex-1 gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= item.id ? "bg-gold text-obsidian" : "bg-white/10 text-ivory/40"
                }`}
              >
                {item.id}
              </div>
              <span className={`${step >= item.id ? "text-gold" : "text-ivory/40"}`}>{item.label}</span>
              {index < 2 && <div className={`flex-1 h-px ${step > item.id ? "bg-gold" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="space-y-6 bg-charcoal border border-white/10 p-8">
                <h2 className="font-display text-2xl text-gold">Delivery Address</h2>

                {addresses.length > 0 && (
                  <div className="grid gap-4">
                    {addresses.map((address) => (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => setSelectedAddress(address.id)}
                        className={`text-left border p-4 transition-colors ${
                          selectedAddress === address.id
                            ? "border-gold bg-gold/5"
                            : "border-white/10 hover:border-gold/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <div>
                            <span className="inline-flex items-center px-2 py-1 text-[11px] uppercase tracking-wider bg-white/10 text-ivory/60 rounded-full mr-2">
                              {address.label || "Home"}
                            </span>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 text-[11px] uppercase tracking-wider bg-gold/15 text-gold rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAddress(address.id);
                            }}
                            className={`text-sm font-semibold transition-colors ${
                              selectedAddress === address.id ? "text-gold" : "text-ivory/50 hover:text-gold"
                            }`}
                          >
                            {selectedAddress === address.id ? "✓ Selected" : "Select"}
                          </button>
                        </div>
                        <p className="font-semibold text-ivory">{address.fullName}</p>
                        <p className="text-ivory/70">{address.line1}</p>
                        {address.line2 && <p className="text-ivory/70">{address.line2}</p>}
                        <p className="text-ivory/70">
                          {address.city}, {address.state} {address.pincode}
                        </p>
                        <p className="text-ivory/60 text-sm mt-1">Phone: {address.phone}</p>
                      </button>
                    ))}
                  </div>
                )}

                {showAddressForm ? (
                  <div className="border border-gold/30 p-6 space-y-4 bg-obsidian/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={addressForm.line1}
                      onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                      className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                    />

                    <input
                      type="text"
                      placeholder="Address Line 2 (optional)"
                      value={addressForm.line2}
                      onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                      className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                      />
                    </div>

                    <select
                      value={addressForm.label}
                      onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                      className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory focus:outline-none focus:border-gold"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                    </select>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        className="btn-gold px-5 py-3 inline-flex items-center gap-2"
                      >
                        <Plus size={16} /> Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          resetAddressForm();
                        }}
                        className="px-5 py-3 border border-white/20 text-ivory hover:border-gold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="text-gold hover:text-ivory transition-colors inline-flex items-center gap-2"
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!selectedAddressObject}
                    className="btn-gold inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {selectedAddressObject ? "Continue to Review →" : "Select an Address to Continue"}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-charcoal border border-white/10 p-8">
                  <h2 className="font-display text-2xl text-gold mb-6">Review Order</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-white/10">
                        <img
                          src={getImage(getItemProduct(item).images)}
                          alt={getItemProduct(item).name || "Cart item"}
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.target.src = "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg";
                          }}
                          className="w-16 h-16 object-cover bg-obsidian"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-ivory">{getItemProduct(item).name || "Selected product"}</h3>
                          <p className="text-ivory/60 text-sm">Size: {item.size || "One size"}</p>
                          <p className="text-ivory/60 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gold font-semibold">₹{(item.product?.price || item.price || 0).toLocaleString("en-IN")}</p>
                          <p className="text-ivory/60 text-sm">
                            ₹{((item.product?.price || item.price || 0) * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-white/20 text-ivory hover:border-gold transition-colors inline-flex items-center gap-2"
                  >
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-gold inline-flex items-center gap-2"
                  >
                    Proceed to Payment <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 bg-charcoal border border-white/10 p-8">
                <h2 className="font-display text-2xl text-gold">Payment</h2>

                <div className="space-y-4 border border-white/10 p-4 bg-obsidian/30">
                  <div className="flex justify-between text-ivory/70">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-ivory/70">
                    <span>Delivery</span>
                    <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-3 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-gold">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={submitting}
                  className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                  )}
                  {submitting ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-ivory/60 hover:text-gold transition-colors"
                >
                  Back to Review
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-charcoal border border-gold/30 p-8 sticky top-24 space-y-6">
              <h3 className="font-display text-2xl text-gold">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-ivory/70">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-ivory/70">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-gold">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {selectedAddress && (
                <div className="border-t border-white/10 pt-4 space-y-1">
                  <h4 className="font-semibold text-ivory">Deliver To</h4>
                  <p className="text-sm text-ivory/70">{selectedAddress.fullName}</p>
                  <p className="text-sm text-ivory/70">{selectedAddress.line1}</p>
                  {selectedAddress.line2 && <p className="text-sm text-ivory/70">{selectedAddress.line2}</p>}
                  <p className="text-sm text-ivory/70">
                    {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
                  </p>
                  <p className="text-sm text-ivory/70">{selectedAddress.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
