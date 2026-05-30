export default function About() {
  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-charcoal to-obsidian py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl text-gold mb-4 tracking-[0.3em]">About SHOEMART</h1>
          <p className="text-ivory/60 text-lg max-w-2xl mx-auto">
            Redefining luxury footwear shopping with authentic brands and unbeatable prices.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl text-gold mb-6">Our Story</h2>
            <p className="text-ivory/70 leading-relaxed mb-4">
              ShoeMart was founded on the belief that luxury footwear should be accessible to everyone. We started as a small boutique and grew into a premier destination for shoe enthusiasts worldwide.
            </p>
            <p className="text-ivory/70 leading-relaxed mb-4">
              With over a decade of experience, we've curated the finest collections from the world's most prestigious brands including Nike, Adidas, Puma, Reebok, Skechers, and Woodland.
            </p>
            <p className="text-ivory/70 leading-relaxed">
              Every product in our collection is carefully selected to ensure authenticity, quality, and style. We're committed to delivering excellence in every aspect of your shopping experience.
            </p>
          </div>
          <div className="bg-charcoal h-96 rounded-lg overflow-hidden">
            <img
              src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
              alt="About"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-charcoal border-y border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-3xl text-gold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="text-4xl">🏆</div>
              <h3 className="font-display text-xl text-gold">Quality</h3>
              <p className="text-ivory/70">We only offer authentic products from trusted brands and verified suppliers.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl">💎</div>
              <h3 className="font-display text-xl text-gold">Luxury</h3>
              <p className="text-ivory/70">Every product is selected for its superior craftsmanship and design excellence.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl">⚡</div>
              <h3 className="font-display text-xl text-gold">Experience</h3>
              <p className="text-ivory/70">We provide exceptional customer service and a seamless shopping journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl text-gold mb-12 text-center">Our Brand Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {["Nike", "Adidas", "Puma", "Reebok", "Skechers", "Woodland"].map((brand) => (
            <div key={brand} className="p-6 border border-white/10 hover:border-gold transition-colors">
              <p className="font-semibold text-ivory hover:text-gold transition-colors">{brand}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-charcoal border-t border-white/10 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl text-gold mb-6">Get in Touch</h2>
          <p className="text-ivory/60 mb-8">We'd love to hear from you. Reach out with any questions or feedback.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gold font-semibold mb-2">Email</p>
              <a href="mailto:support@shoemart.com" className="text-ivory/70 hover:text-gold transition-colors">
                support@shoemart.com
              </a>
            </div>
            <div>
              <p className="text-gold font-semibold mb-2">Phone</p>
              <a href="tel:+1234567890" className="text-ivory/70 hover:text-gold transition-colors">
                +1 (234) 567-890
              </a>
            </div>
            <div>
              <p className="text-gold font-semibold mb-2">Location</p>
              <p className="text-ivory/70">New York, USA</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
