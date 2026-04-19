import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderConfirmation() {
  return (
    <div className="bg-background text-on-background font-body antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <header className="w-full flex justify-center py-8 bg-background z-50">
        <Link className="font-headline text-3xl font-black tracking-[-0.04em] text-primary" to="/">noissue</Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-container text-on-secondary-container mb-6">
              <span className="material-symbols-outlined text-4xl" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-[-0.02em] text-primary mb-4">Order Confirmed.</h1>
            <p className="font-body text-lg text-on-surface-variant max-w-xl mx-auto">Your eco-friendly packaging is being prepped for the journey. Thank you for moving toward a circular economy.</p>
            <div className="mt-6 flex flex-col items-center">
              <span className="font-label text-sm text-outline uppercase tracking-widest">Order Reference</span>
              <span className="font-label text-lg font-semibold text-primary mt-1">#NI-8492-ECO</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-8 bg-surface-container-low rounded-none md:rounded-xl p-6 md:p-10 relative overflow-hidden">
              <h2 className="font-headline text-2xl font-bold text-primary mb-8 tracking-tight">The Archive</h2>
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-6 ghost-border-bottom pb-8">
                  <div className="w-full sm:w-32 h-32 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 relative">
                    <img alt="Custom Compostable Mailers" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD91hCMJoY8At5JS28_bMmF0bPuZ0ei07ImSC8Vl9Gd5STLjDMYl6WTxS9PW9QilY5CUcPL-wkB7Fw7Ae1EFt5-2IdZYcGU0B05L1Grn5qoiyQfpvL2Rl5fQ9suoC5uuHemG4sUcm2LHQZhvfDitjXJZEdR5Hx8kIpdHaTLdyVSUbNy44E_PvZtAvCwqhldUcWbQXDLeAWUpRu7WV-XopKy9eDupMP3pJ_zFRAVKtbJjs8B61MIAiX_1FyY29N_TNJVL_gAavW00ik" />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline text-lg font-bold text-on-surface">Custom Compostable Mailers</h3>
                      <span className="font-label text-md font-semibold text-primary">$145.00</span>
                    </div>
                    <p className="font-body text-sm text-on-surface-variant mb-3">Matte Black / 10x13" / Qty: 250</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-[10px] uppercase tracking-widest">
                        Compostable
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface text-on-surface-variant font-label text-[10px] uppercase tracking-widest border border-outline-variant/30">
                        Soy Ink
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 ghost-border-bottom pb-8">
                  <div className="w-full sm:w-32 h-32 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 relative">
                    <img alt="Recycled Tissue Paper" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC84J0uGVmUt69-EQn1iMh0LLkxA6KxVqGyBAZvNwzX0p4I8AkQb1jNadRvB33Gk6vLrfQhMAErlRGElCwkXHDKAJuN1XHP301HsnvFFWa1a_RHIE7cZXisqdr_KpOhiW6oAcvj45AXuaQZHjbymLySIIvT5zdFS2S_8gvF5zb6TbLN4IFhTIEuFvqbhUW-Ei0OKxfeZYpE17_iYfhCoR_tuaz9FWlBapFjPsOk_vznXkJtr-dKvKn378rtQlvzELH9D6rY77UQhgM" />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline text-lg font-bold text-on-surface">Recycled Tissue Paper</h3>
                      <span className="font-label text-md font-semibold text-primary">$85.00</span>
                    </div>
                    <p className="font-body text-sm text-on-surface-variant mb-3">Off-White / 15x20" / Qty: 500</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-[10px] uppercase tracking-widest">
                        FSC Certified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-32 h-32 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 relative">
                    <img alt="Eco-friendly Stickers" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIx8MKwSTAjtWlHHDLiy3PlEI7rJ5ovByq7LPNza_pL04QNa5SsneGxePasunBy3c0S8L3yRR091V2upJUF-5QWETkP3DKvhMFDZjD-BS25tCpSDnp8bTcuLccqg5vkOrYpAIf1ERNLIszH8oJUVPTX3qEmqGGPBHYPD4eTqRTB1LHyK8nHMKQa0K_TtREJRHfF6gjNNP63zfoffEiiVuvAji03i2DC4ti4VC0YdrUTLMTf42Xei2SxVvArw8CBML0hg6UZokEdO4" />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline text-lg font-bold text-on-surface">Eco-friendly Stickers</h3>
                      <span className="font-label text-md font-semibold text-primary">$45.00</span>
                    </div>
                    <p className="font-body text-sm text-on-surface-variant mb-3">Circle 2" / Roll / Qty: 1000</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-[10px] uppercase tracking-widest">
                        Acid-Free
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-8">
              <div className="bg-surface-container-lowest rounded-xl p-8 ambient-shadow relative z-10">
                <h3 className="font-headline text-xl font-bold text-primary mb-6">Summary</h3>
                <div className="space-y-4 font-body text-sm mb-6 ghost-border-bottom pb-6">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>$275.00</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Carbon Neutral Shipping</span>
                    <span>$12.50</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Taxes</span>
                    <span>$22.00</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-headline font-bold text-on-surface">Total</span>
                  <span className="font-label text-xl font-bold text-primary">$309.50</span>
                </div>
                <button className="block w-full text-center py-4 rounded-xl btn-primary-gradient text-on-primary font-headline font-bold tracking-wide transition-opacity hover:opacity-90">
                  Track Shipment
                </button>
              </div>

              <div className="bg-surface-container-low rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <span className="material-symbols-outlined">local_shipping</span>
                  <h4 className="font-headline font-bold">Shipping To</h4>
                </div>
                <address className="font-body text-sm text-on-surface-variant not-italic leading-relaxed">
                  Studio Minimal<br />
                  123 Artisan Way, Suite B<br />
                  Portland, OR 97209<br />
                  United States
                </address>
                <div className="mt-4 pt-4 ghost-border-bottom border-t-0">
                  <span className="font-label text-xs uppercase tracking-widest text-outline block mb-1">Est. Delivery</span>
                  <span className="font-body text-sm font-semibold text-on-surface">Oct 24 - Oct 28</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary text-on-primary rounded-xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at top right, #1a3b34, transparent 70%)" }}></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="font-label text-sm uppercase tracking-widest text-primary-fixed block mb-4">The Impact</span>
                <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Planting Trees. Packaging Better.</h2>
                <p className="font-body text-on-primary-fixed-variant text-lg max-w-md">By choosing our compostable and recycled materials, you've contributed to a lower footprint. We're planting a tree with the Eco-Alliance for this order.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-end items-start md:items-center">
                <div className="bg-primary-container rounded-lg p-6 flex-1 max-w-[200px]">
                  <span className="material-symbols-outlined text-4xl text-primary-fixed mb-3">nature</span>
                  <span className="block font-headline font-bold text-xl mb-1">+1 Tree</span>
                  <span className="font-label text-xs uppercase tracking-widest text-on-primary-container">Planted</span>
                </div>
                <div className="bg-primary-container rounded-lg p-6 flex-1 max-w-[200px]">
                  <span className="material-symbols-outlined text-4xl text-primary-fixed mb-3">recycling</span>
                  <span className="block font-headline font-bold text-xl mb-1">100%</span>
                  <span className="font-label text-xs uppercase tracking-widest text-on-primary-container">Circular</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link className="inline-flex items-center gap-2 font-headline font-semibold text-primary hover:text-surface-tint transition-colors group" to="/">
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Return to Store
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
