import React, { useState, useMemo, useContext, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useSearchParams, useLocation  } from "react-router-dom";


/**
 * Wedding Website – React SPA with Tabs & RSVP Flow
 * - Tabs: Home, Wedding Details, Venue, Attire, FAQs, Your RSVP
 * - "Confirm RSVP" button on Home routes to the RSVP attendance confirmation flow
 * - Tailwind for styling, fully mobile responsive
 */

// -----------------------------
// RSVP Store (Context)
// -----------------------------
const RSVPContext = createContext(null);
function useRSVP() { return useContext(RSVPContext); }
function RSVPProvider({ children }) {
  const [rsvp, setRsvp] = useState(() => {
    try { const raw = localStorage.getItem("rsvp_demo"); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  });
  useEffect(() => { try { if (rsvp) localStorage.setItem("rsvp_demo", JSON.stringify(rsvp)); } catch {} }, [rsvp]);
  const value = useMemo(() => ({ rsvp, setRsvp }), [rsvp]);
  return <RSVPContext.Provider value={value}>{children}</RSVPContext.Provider>;
}

// -----------------------------
// UI Primitives
// -----------------------------
function Container({ children, className = "" }) {
  return <div className={`max-w-5xl mx-auto px-6 ${className}`}>{children}</div>;
}

// Transparent card + burgundy border; auto-apply font to headers inside
function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-transparent border border-[#800020] rounded-2xl p-6
        ${className}
        [&_h2]:font-greatvibes [&_h3]:font-greatvibes
      `}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children, required = false }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children} {required && <span className="text-red-500">*</span>}</label>;
}
function Input({ value, onChange, placeholder, type = "text", required = false }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
    />
  );
}
function Select({ value, onChange, children, required = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
    >
      {children}
    </select>
  );
}
function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((opt) => (
        <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer">
          <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={(e) => onChange(e.target.value)} className="h-4 w-4" />
          <span className="text-sm text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

// -----------------------------
// Layout
// -----------------------------
function Nav() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const query = location.search; // e.g. "?qqxx=abc123" 

  
  return (

    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      {/* Header bar */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to={`/${query}`} className="font-greatvibes text-4xl sm:text-5xl md:text-6xl mt-1 text-base md:text-lg">
          Diane &amp; Calvin
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 text-sm md:flex">
          <Link className="hover:underline" to={`/${query}`}>Home</Link>
          <Link className="hover:underline" to={`/details${query}`}>Wedding Details</Link>
          <Link className="hover:underline" to={`/attire${query}`}>Attire</Link>
          <Link className="hover:underline" to={`/entourage${query}`}>Entourage</Link>
          <Link className="hover:underline" to={`/faqs${query}`}>FAQs</Link>
          <Link className="hover:underline" to={`/your-rsvp${query}`}>Your RSVP</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 md:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            // X icon
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6L18 18" />
              <path d="M18 6L6 18" />
            </svg>
          ) : (
            // Hamburger icon (perfectly centered, rounded ends)
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed left-0 right-0 top-14 z-50 border-t bg-white transition-[opacity,transform] duration-200 md:hidden ${
          open ? "translate-y-0 opacity-100" : "-translate-y-2 pointer-events-none opacity-0"
        }`}
      >
        <div className="mx-auto grid max-w-7xl gap-1.5 px-4 py-3 text-sm">
          <Link className="py-2" to={`/${query}`} onClick={() => setOpen(false)}>Home</Link>
          <Link className="py-2" to={`/details${query}`} onClick={() => setOpen(false)}>Wedding Details</Link>
          <Link className="py-2" to={`/attire${query}`} onClick={() => setOpen(false)}>Attire Guide</Link>
          <Link className="py-2" to={`/entourage${query}`} onClick={() => setOpen(false)}>Entourage</Link>
          <Link className="py-2" to={`/faqs${query}`} onClick={() => setOpen(false)}>FAQs</Link>
          <Link className="py-2" to={`/your-rsvp${query}`} onClick={() => setOpen(false)}>Your RSVP</Link>
        </div>
      </div>
    </nav>
  );
}
function Footer() {
  return (
    <footer className="mt-16 py-10 text-center text-sm text-gray-500">
      <Container>
        <p>⛪ Barasoain Church • 🎉 Felicisima Paz Grand Pavilion & Private Resort (Atlag, Malolos, Bulacan)</p>
      </Container>
    </footer>
  );
}
function Shell({ children, hero }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white text-gray-900">
      <Nav />
      {hero}
      <Container id="main-content" className="py-10">{children}</Container>
      <Footer />
    </div>
  );
}

// -----------------------------
// Pages
// -----------------------------
function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handleRedirect = () => {
    const qqxx1 = searchParams.get("rsvp") || "welcomeguest";
    navigate(`/rsvp?rsvp=${qqxx1}`);
  };

  // --- Local modal state for the ATTIRE section replica (kept separate from AttirePage) ---
  const [homeAttireModalOpen, setHomeAttireModalOpen] = useState(false);
  const [homeAttireModalTitle, setHomeAttireModalTitle] = useState("");
  const [homeAttireModalKey, setHomeAttireModalKey] = useState(null); // "ninangs" | "ninongs" | "guests"

  const openHomeAttireModal = (key, title) => {
    setHomeAttireModalKey(key);
    setHomeAttireModalTitle(title);
    setHomeAttireModalOpen(true);
  };
  const closeHomeAttireModal = () => setHomeAttireModalOpen(false);

  const HomeAttireModalContent = () => {
    if (homeAttireModalKey === "ninangs") {
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Modern Filipiniana inspiration — panuelo, butterfly sleeves, soft silhouettes.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <img src="sample_ninang_1.png" alt="Ninang Look 1" className="w-full h-40 object-cover rounded-lg border" />
            <img src="sample_ninang_2.jpg" alt="Ninang Look 2" className="w-full h-40 object-cover rounded-lg border" />
            <img src="sample_ninang_3.png" alt="Ninang Look 3" className="w-full h-40 object-cover rounded-lg border" />
          </div>
        </div>
      );
    }
    if (homeAttireModalKey === "ninongs") {
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Beige/cream barong, classic black trousers, dress shoes (no sneakers).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <img src="sample_ninong_1.jpeg" alt="Ninong Look 1" className="w-full h-40 object-cover rounded-lg border" />
            <img src="sample_ninong_1.webp" alt="Ninong Look 2" className="w-full h-40 object-cover rounded-lg border" />
            <img src="sample_ninong_3.jpg" alt="Ninong Look 3" className="w-full h-40 object-cover rounded-lg border" />
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Semi-formal in the wedding palette. Mix-and-match dresses, jumpsuits, barong/polo with slacks, and elegant footwear.
        </p>
        <div className="mt-4 grid grid-cols-5 gap-3">
          <div className="h-10 rounded-xl" style={{ backgroundColor: "#6D0C2D" }}></div>
          <div className="h-10 rounded-xl" style={{ backgroundColor: "#222222" }}></div>
          <div className="h-10 rounded-xl" style={{ backgroundColor: "#C6A57B" }}></div>
          <div className="h-10 rounded-xl" style={{ backgroundColor: "#CECABB" }}></div>
          <div className="h-10 rounded-xl" style={{ backgroundColor: "#7A7A7A" }}></div>
        </div>
      </div>
    );
  };

  // --- NEW: Wedding Gallery state & data (dummy images) ---
  const [galleryOpen, setGalleryOpen] = useState(false);
  const galleryImages = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const n = String(i + 1).padStart(2, "0");
        return { src: `gallery_${n}.jpg`, alt: `Wedding photo ${n}` };
      }),
    []
  );

  return (
    <Shell
      hero={
        <div className="relative min-h-screen">
          {/* Desktop image */}
          <img
            src="IMG_wedding_banner2.jpg"
            alt="Diane & Calvin Wedding Banner"
            className="hidden sm:block absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Mobile image */}
          <img
            src="IMG_wedding_banner2_mobile.jpg"
            alt="Diane & Calvin Wedding Banner Mobile"
            className="block sm:hidden absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <Container className="text-white text-center relative -mt-12 sm:mt-0">
              <p className="uppercase tracking-widest text-[10px] sm:text-xs opacity-90 text-white">
                You're Invited
              </p> <br/>
              <h1 className="font-greatvibes text-4xl sm:text-5xl md:text-6xl mt-1">
                Diane & Calvin
              </h1>
              <p className="uppercase tracking-widest text-[10px] sm:text-xs opacity-90 text-white">
                Saturday • November 22, 2025
              </p> <br/>
              <button
                onClick={handleRedirect}
                className="mt-8 w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border-2 border-white text-white px-6 py-3 font-medium shadow hover:bg-white hover:text-gray-900 transition"
              >
                Confirm RSVP
              </button>
            </Container>

            {/* Bouncing scroll indicator */}
            <button
              onClick={() =>
                document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth" })
              }
              aria-label="Scroll to content"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 p-3 rounded-full border border-white/60 text-white/90 hover:text-white hover:border-white transition focus:outline-none focus:ring-2 focus:ring-white/70 animate-bounce"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      }
    >

      {/* --- NEW: Gallery marquee CSS (scoped) --- */}
      <style>{`
        @keyframes gallery-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .gallery-track {
          width: max-content;
          animation: gallery-marquee 35s linear infinite;
          will-change: transform;
        }
        .gallery-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* --- NEW: Auto-scrolling (marquee) square gallery --- */}
      <div className="mt-8">
        <h2 className="text-2xl text-[#800020] font-greatvibes">Wedding Gallery</h2>
        <div className="mt-4 overflow-hidden">
          <div className="gallery-track flex gap-4 pb-3">
            {[...galleryImages, ...galleryImages].map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="relative flex-shrink-0 w-36 h-36 sm:w-44 sm:h-44 rounded-xl overflow-hidden border border-[#800020] focus:outline-none focus:ring-2 focus:ring-[#800020]/40"
                aria-label={`Open gallery starting from ${img.alt}`}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Gallery Modal */}
      {galleryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Wedding Gallery"
        >
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#800020] text-white">
              <h3 className="text-lg font-semibold">Wedding Gallery</h3>
              <button
                type="button"
                onClick={() => setGalleryOpen(false)}
                className="rounded-full w-8 h-8 inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-[#800020] transition"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <div key={`modal-${idx}`} className="aspect-square rounded-xl overflow-hidden border">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- REPLICATED CONTENT SECTIONS --- */}
      {/* Wedding Details (replica of DetailsPage) */}
      <div className="mt-12 border-t pt-10">
        <h2 className="text-3xl text-[#800020] mb-6 font-greatvibes">Wedding Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Church Card */}
          <Card>
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <img
                src="IMG_church.jpg"
                alt="Barasoain Church"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-2xl text-[#800020]">Wedding Ceremony</h2>
            <ul className="mt-2 space-y-2 text-[#800020]">
              <li><span className="font-medium">Date:</span> Saturday, November 22, 2025</li>
              <li><span className="font-medium">Time:</span> 2:00 in the afternoon</li>
              <li><span className="font-medium">Venue:</span> Barasoain Church, Malolos, Bulacan</li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://waze.com/ul?ll=14.8441,120.8112"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#800020] text-[#800020] px-4 py-2 font-medium hover:bg-[#800020] hover:text-white transition"
              >
                Open in Waze
              </a>
              <a
                href="https://maps.google.com/?q=Barasoain+Church"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#800020] text-[#800020] px-4 py-2 font-medium hover:bg-[#800020] hover:text-white transition"
              >
                Open in Google Maps
              </a>
            </div>
          </Card>

          {/* Reception Card */}
          <Card>
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <img
                src="IMG_reception.jpg"
                alt="Felicisima Paz Grand Pavilion & Private Resort"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-2xl text-[#800020]">Wedding Reception</h2>
            <ul className="mt-4 space-y-2 text-[#800020]">
              <li><span className="font-medium">Venue:</span> Felicisima Paz Grand Pavilion & Private Resort</li>
              <li><span className="font-medium">Time:</span> TBA</li>
              <li><span className="font-medium">Location:</span> Atlag, Malolos, Bulacan</li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://waze.com/ul?ll=14.8545,120.8198"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#800020] text-[#800020] px-4 py-2 font-medium hover:bg-[#800020] hover:text-white transition"
              >
                Open in Waze
              </a>
              <a
                href="https://maps.google.com/?q=Felicisima+Paz+Grand+Pavilion"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#800020] text-[#800020] px-4 py-2 font-medium hover:bg-[#800020] hover:text-white transition"
              >
                Open in Google Maps
              </a>
            </div>
          </Card>
        </div>
      </div>

      {/* Attire (replica of AttirePage with separate modal state) */}
      <div className="mt-12 border-t pt-10">
        <h2 className="text-3xl text-[#800020] mb-6 font-greatvibes">Attire Guide</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Ninangs */}
          <Card>
            <h2 className="text-2xl text-[#800020]">For Our Ninangs</h2>
            <p className="mt-3 text-gray-700">
              In celebration of our Filipiniana-themed wedding, we kindly request that you grace the occasion
              in a modern filipiniana dress. Please feel free to choose any color that best expresses your personal style.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => openHomeAttireModal("ninangs", "Sample Outfits — Ninangs")}
                className="text-sm underline underline-offset-4 hover:opacity-80"
                style={{ color: "#800020" }}
              >
                See sample outfits
              </button>
            </div>
          </Card>

          {/* Ninongs */}
          <Card>
            <h2 className="text-2xl text-[#800020]">For Our Ninongs</h2>
            <p className="mt-3 text-gray-700">
              We invite you to wear a beige or cream barong, paired with classic black trousers and dress shoes
              <span className="italic"> (kindly refrain from wearing sneakers)</span>.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => openHomeAttireModal("ninongs", "Sample Outfits — Ninongs")}
                className="text-sm underline underline-offset-4 hover:opacity-80"
                style={{ color: "#800020" }}
              >
                See sample outfits
              </button>
            </div>
          </Card>

          {/* Guests */}
          <Card>
            <h2 className="text-2xl text-[#800020]">For Our Guests</h2>
            <p className="mt-3 text-gray-700">
              We would love to see you in semi-formal attire that compliments our wedding color motif.
              Please see below palette for inspiration.
            </p>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => openHomeAttireModal("guests", "Sample Outfits — Guests")}
                className="text-sm underline underline-offset-4 hover:opacity-80"
                style={{ color: "#800020" }}
              >
                See sample outfits
              </button>
            </div>
          </Card>
        </div>

        {/* Modal (burgundy + white theme) */}
        {homeAttireModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={homeAttireModalTitle}
          >
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#800020] text-white">
                <h3 className="text-lg font-semibold">{homeAttireModalTitle}</h3>
                <button
                  type="button"
                  onClick={closeHomeAttireModal}
                  className="rounded-full w-8 h-8 inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-[#800020] transition"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="p-6 bg-white">
                <HomeAttireModalContent />
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 flex justify-end">
                <button
                  type="button"
                  onClick={closeHomeAttireModal}
                  className="inline-flex items-center justify-center rounded-2xl border-2 border-[#800020] text-[#800020] px-4 py-2 text-sm font-medium hover:bg-[#800020] hover:text-white transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  

      {/* FAQs (replica of FaqsPage) */}
      <div className="mt-12 border-t pt-10">
        <h2 className="text-3xl text-[#800020] mb-6 font-greatvibes">FAQs</h2>
        <Card>
          <div className="mt-4 space-y-4 text-gray-700">
            <div>
              <p className="font-medium">Q: Can I bring a plus one?</p>
              <p>A: Your RSVP link will show if you have a plus one included. If not, we kindly ask for your understanding as we have very limited seating. Please refrain from bringing an additional guest unless you have confirmed with us beforehand. Our wedding coordinators will be following our guest list strictly to avoid any confusion during the event. If you’d like to request an additional guest, please message us directly — we’ll do our best to accommodate. 💛</p>
            </div>
            <div>
              <p className="font-medium">Q: Is there parking?</p>
              <p>A: Yes. Please indicate in your RSVP if you’ll be bringing a car so we can prepare parking.</p>
            </div>
            <div>
              <p className="font-medium">Q: What time should I arrive?</p>
              <p>A: Please plan to arrive and be seated at least 15–30 minutes before the ceremony begins at 2:00 PM. This helps us start on time and keeps everything running smoothly.</p>
            </div>
            <div>
              <p className="font-medium">Q: Are kids allowed?</p>
              <p>A: We love children, but due to limited space and to ensure a peaceful ceremony, we kindly request that this be an adults-only celebration unless otherwise indicated on your invitation.</p>
            </div>
            <div>
              <p className="font-medium">Q: What happens if I can’t attend after RSVPing ‘Yes’?</p>
              <p>A: We understand plans can change. If something comes up, please let us know as soon as possible so we can offer your seat to someone else. Your presence truly means the world to us.</p>
            </div>
            <div>
              <p className="font-medium">Q: What kind of gift can we give?</p>
              <p>A: Your presence at our wedding is the most meaningful gift we could ever ask for. 💛
If you would like to bless us with a gift, we would deeply appreciate a monetary contribution to help us start our new life together. We will have a wishing well and QR codes available at the reception for your convenience.</p>
            </div>
            <div>
              <p className="font-medium">Q: Should I eat before the wedding?</p>
              <p>A: Yes, please! Since our wedding ceremony is in the afternoon and our reception will be held at dinner time, we recommend having a light lunch or snack beforehand so you can enjoy the day comfortably. 🍽️</p>
            </div>
          </div>
        </Card>
      </div>
      {/* --- END REPLICATED CONTENT SECTIONS --- */}
    </Shell>
  );
}

function DetailsPage() {
  return (
    <Shell hero={null}>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Church Card */}
        <Card>
          {/* Image */}
          <div className="relative h-48 rounded-xl overflow-hidden mb-4">
            <img
              src="IMG_church.jpg"
              alt="Barasoain Church"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl text-[#800020]">Wedding Ceremony</h2>
          <ul className="mt-2 space-y-2 text-[#800020]">
            <li><span className="font-medium">Date:</span> Saturday, November 22, 2025</li>
            <li><span className="font-medium">Time:</span> 2:00 in the afternoon</li>
            <li><span className="font-medium">Venue:</span> Barasoain Church, Malolos, Bulacan</li>
          </ul>

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://waze.com/ul?ll=14.8441,120.8112"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#800020] text-[#800020] px-4 py-2 font-medium hover:bg-[#800020] hover:text-white transition"
            >
              Open in Waze
            </a>
            <a
              href="https://maps.google.com/?q=Barasoain+Church"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#800020] text-[#800020] px-4 py-2 font-medium hover:bg-[#800020] hover:text-white transition"
            >
              Open in Google Maps
            </a>
          </div>
        </Card>

        {/* Reception Card */}
        <Card>
          {/* Image */}
          <div className="relative h-48 rounded-xl overflow-hidden mb-4">
            <img
              src="IMG_reception.jpg"
              alt="Felicisima Paz Grand Pavilion & Private Resort"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl text-[#800020]">Wedding Reception</h2>
          <ul className="mt-4 space-y-2 text-[#800020]">
            <li><span className="font-medium">Venue:</span> Felicisima Paz Grand Pavilion & Private Resort</li>
            <li><span className="font-medium">Time:</span> TBA</li>
            <li><span className="font-medium">Location:</span> Atlag, Malolos, Bulacan</li>
          </ul>

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://waze.com/ul?ll=14.8545,120.8198"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#800020] text-[#800020] px-4 py-2 font-medium hover:bg-[#800020] hover:text-white transition"
            >
              Open in Waze
            </a>
            <a
              href="https://maps.google.com/?q=Felicisima+Paz+Grand+Pavilion"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#800020] text-[#800020] px-4 py-2 font-medium hover:bg-[#800020] hover:text-white transition"
            >
              Open in Google Maps
            </a>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

// function VenuePage() {
//   return (
//     <Shell hero={null}>
//       <div className="grid md:grid-cols-2 gap-6">
//         <Card>
//           <h3 className="text-xl">Church</h3>
//           <p className="mt-2 text-gray-700">Barasoain Church, Malolos, Bulacan</p>
//           <div className="mt-4 flex gap-3 text-sm">
//             <a className="underline" href="#" target="_blank" rel="noreferrer">Open in Waze</a>
//             <a className="underline" href="#" target="_blank" rel="noreferrer">Open in Google Maps</a>
//           </div>
//         </Card>
//         <Card>
//           <h3 className="text-xl">Reception</h3>
//           <p className="mt-2 text-gray-700">Felicisima Paz Grand Pavilion & Private Resort, Atlag, Malolos, Bulacan</p>
//           <div className="mt-4 flex gap-3 text-sm">
//             <a className="underline" href="#" target="_blank" rel="noreferrer">Open in Waze</a>
//             <a className="underline" href="#" target="_blank" rel="noreferrer">Open in Google Maps</a>
//           </div>
//         </Card>
//       </div>
//     </Shell>
//   );
// }

function AttirePage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalKey, setModalKey] = React.useState(null); // "ninangs" | "ninongs" | "guests"

  const openModal = (key, title) => {
    setModalKey(key);
    setModalTitle(title);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const ModalContent = () => {
    if (modalKey === "ninangs") {
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Modern Filipiniana inspiration — panuelo, butterfly sleeves, soft silhouettes. Replace these images with your selections.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <img src="sample_ninang_1.png" alt="Ninang Look 1" className="w-full h-40 object-cover rounded-lg border" />
            <img src="sample_ninang_2.jpg" alt="Ninang Look 2" className="w-full h-40 object-cover rounded-lg border" />
            <img src="sample_ninang_3.png" alt="Ninang Look 3" className="w-full h-40 object-cover rounded-lg border" />
          </div>
        </div>
      );
    }
    if (modalKey === "ninongs") {
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Beige/cream barong, classic black trousers, dress shoes (no sneakers). Replace images with your preferred looks.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <img src="sample_ninong_1.jpeg" alt="Ninong Look 1" className="w-full h-40 object-cover rounded-lg border" />
            <img src="sample_ninong_1.webp" alt="Ninong Look 2" className="w-full h-40 object-cover rounded-lg border" />
            <img src="sample_ninong_3.jpg" alt="Ninong Look 3" className="w-full h-40 object-cover rounded-lg border" />
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Semi-formal in the wedding palette. Mix-and-match dresses, jumpsuits, barong/polo with slacks, and elegant footwear.
        </p>
        <div className="mt-4 grid grid-cols-5 gap-3">
          <div className="h-10 rounded-xl" style={{ backgroundColor: "#6D0C2D" }}></div>
          <div className="h-10 rounded-xl" style={{ backgroundColor: "#222222" }}></div>
          <div className="h-10 rounded-xl" style={{ backgroundColor: "#C6A57B" }}></div>
          <div className="h-10 rounded-xl" style={{ backgroundColor: "#CECABB" }}></div>
          <div className="h-10 rounded-xl" style={{ backgroundColor: "#7A7A7A" }}></div>
        </div>
      </div>
    );
  };

  return (
    <Shell hero={null}>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Ninangs */}
        <Card>
          <h2 className="text-2xl">For Our Ninangs</h2>
          <p className="mt-3 text-gray-700">
            In celebration of our Filipiniana-themed wedding, we kindly request that you grace the occasion
            in a modern filipiniana dress. Please feel free to choose any color that best expresses your personal style.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => openModal("ninangs", "Sample Outfits — Ninangs")}
              className="text-sm underline underline-offset-4 hover:opacity-80"
              style={{ color: "#800020" }}
            >
              See sample outfits
            </button>
          </div>
        </Card>

        {/* Ninongs */}
        <Card>
          <h2 className="text-2xl">For Our Ninongs</h2>
          <p className="mt-3 text-gray-700">
            We invite you to wear a beige or cream barong, paired with classic black trousers and dress shoes
            <span className="italic"> (kindly refrain from wearing sneakers)</span>.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => openModal("ninongs", "Sample Outfits — Ninongs")}
              className="text-sm underline underline-offset-4 hover:opacity-80"
              style={{ color: "#800020" }}
            >
              See sample outfits
            </button>
          </div>
        </Card>

        {/* Guests */}
        <Card>
          <h2 className="text-2xl">For Our Guests</h2>
          <p className="mt-3 text-gray-700">
            We would love to see you in semi-formal attire that compliments our wedding color motif.
            Please see below palette for inspiration.
          </p>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => openModal("guests", "Sample Outfits — Guests")}
              className="text-sm underline underline-offset-4 hover:opacity-80"
              style={{ color: "#800020" }}
            >
              See sample outfits
            </button>
          </div>
        </Card>
      </div>

      {/* Modal (burgundy + white theme) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={modalTitle}
        >
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#800020] text-white">
              <h3 className="text-lg font-semibold">{modalTitle}</h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full w-8 h-8 inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-[#800020] transition"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 bg-white">
              <ModalContent />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-2xl border-2 border-[#800020] text-[#800020] px-4 py-2 text-sm font-medium hover:bg-[#800020] hover:text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

function FaqsPage() {
  return (
    <Shell hero={null}>
      <Card>
        <h2 className="text-2xl">FAQs</h2>
        <div className="mt-4 space-y-4 text-gray-700">
          <div>
            <p className="font-medium">Q: Can I bring a plus one?</p>
            <p>A: Your invite link will indicate if a plus one is included. If not, we kindly ask for understanding due to limited seating.</p>
          </div>
          <div>
              <p className="font-medium">Q: Is there parking?</p>
              <p>A: Yes. Please indicate in your RSVP if you’ll be bringing a car so we can prepare parking.</p>
            </div>
            <div>
              <p className="font-medium">Q: What time should I arrive?</p>
              <p>A: Please plan to arrive and be seated at least 15–30 minutes before the ceremony begins at 2:00 PM. This helps us start on time and keeps everything running smoothly.</p>
            </div>
            <div>
              <p className="font-medium">Q: Are kids allowed?</p>
              <p>A: We love children, but due to limited space and to ensure a peaceful ceremony, we kindly request that this be an adults-only celebration unless otherwise indicated on your invitation.</p>
            </div>
            <div>
              <p className="font-medium">Q: What happens if I can’t attend after RSVPing ‘Yes’?</p>
              <p>A: We understand plans can change. If something comes up, please let us know as soon as possible so we can offer your seat to someone else. Your presence truly means the world to us.</p>
            </div>
            <div>
              <p className="font-medium">Q: What kind of gift can we give?</p>
              <p>A: Your presence at our wedding is the most meaningful gift we could ever ask for. 💛
If you would like to bless us with a gift, we would deeply appreciate a monetary contribution to help us start our new life together. We will have a wishing well and QR codes available at the reception for your convenience.</p>
            </div>
            <div>
              <p className="font-medium">Q: Should I eat before the wedding?</p>
              <p>A: Yes, please! Since our wedding ceremony is in the afternoon and our reception will be held at dinner time, we recommend having a light lunch or snack beforehand so you can enjoy the day comfortably. 🍽️</p>
            </div>
        </div>
      </Card>
    </Shell>
  );
}

function YourRSVPPage() {
  const { rsvp } = useRSVP();
  return (
    <Shell hero={null}>
      <Card>
        <h2 className="text-2xl">Your RSVP</h2>
        {!rsvp ? (
          <p className="mt-3 text-gray-700">No RSVP found yet. Please go to the Home page and click <span className="font-medium">Confirm RSVP</span> to submit your response.</p>
        ) : (
          <div className="mt-4 text-gray-700">
            <p><span className="font-medium">Name:</span> {rsvp.name}</p>
            <p><span className="font-medium">Attendance:</span> {rsvp.attendance}</p>
            <p><span className="font-medium">Side:</span> {rsvp.side}</p>
            <p><span className="font-medium">Contact:</span> {rsvp.contact}</p>
            {rsvp.plusAllowance === "Allowed" && (
              <p><span className="font-medium">Plus One:</span> {rsvp.plusName ? rsvp.plusName : "(None added)"}</p>
            )}
            <p><span className="font-medium">Bringing Car:</span> {rsvp.bringingCar}</p>
            {/* <p className="mt-2 text-xs text-gray-500">Saved locally for demo. Replace with your API for production.</p> */}
          </div>
        )}
      </Card>
    </Shell>
  );
}

/* -----------------------------
   NEW: Entourage Page
------------------------------*/
function EntouragePage() {
  const location = useLocation();
  const query = location.search;

  // Small pill sub-nav to scroll to sections
  const items = [
    { id: "maids", label: "Maid(s) of Honor" },
    { id: "bestmen", label: "Best Men" },
    { id: "partners", label: "Entourage (Partners)" },
    { id: "candles", label: "Candles" },
    { id: "veil", label: "Veil" },
    { id: "cords", label: "Cords" },
  ];

  return (
    <Shell hero={null}>
      <div className="mb-6 flex flex-wrap gap-2">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className="px-3 py-1.5 rounded-full border border-[#800020] text-[#800020] text-sm hover:bg-[#800020] hover:text-white transition"
          >
            {it.label}
          </a>
        ))}
      </div>

      <div className="space-y-8">
        <section id="maids" className="scroll-mt-24">
          <Card>
            <h2 className="text-3xl text-[#800020]">Maid(s) of Honor</h2>
            <ul className="mt-3 list-disc list-inside text-gray-700">
              <li>Ms. Eula Mae C. Ignacio</li>
              <li>Ms. Trixie D. Hernandez</li>
            </ul>
          </Card>
        </section>

        <section id="bestmen" className="scroll-mt-24">
          <Card>
            <h2 className="text-3xl text-[#800020]">Best Men</h2>
            <ul className="mt-3 list-disc list-inside text-gray-700">
              <li>Mr. Carl Oliver S. Crisostomo</li>
              <li>Mr. Ray-Ville S. Reyes</li>
            </ul>
          </Card>
        </section>

        <section id="partners" className="scroll-mt-24">
          <Card>
            <h2 className="text-3xl text-[#800020]">Entourage</h2>
            <ul className="mt-3 list-disc list-inside text-gray-700">
              <li>Mrs. Ashley Venice Manuel-Hum & Mr. Clarence Hum</li>
              <li>Ms. Angelica Crisostomo & Mr. CJ Crisostomo</li>
              <li>Ms. Kim Brescia Lhyn Clemente & Mr. Jonas James Dasmarinas</li>
              <li>Ms. Kate Jutilo & Mr. John Eizel Padilla</li>
              <li>Ms. Jenieca Santos & Mr. Johann Benedict Orito</li>
              <li>Mrs. Roselyn Magdaraog & Mr. Kelvin Bumagat</li>
              <li>Ms. Camille Loren Laya & Mr. Ray Jemmo Pagtalunan</li>
              <li>Ms. Adeza C. Padilla</li>
            </ul>
          </Card>
        </section>

        <section id="candles" className="scroll-mt-24">
          <Card>
            <h2 className="text-3xl text-[#800020]">Candles</h2>
            <ul className="mt-3 list-disc list-inside text-gray-700">
              <li>Ms. Regine C. Biana & Mr. Julio Efrax Ando</li>
              <li>Mrs. Melanie Crisostomo & Mr. Eric Santos</li>
            </ul>
          </Card>
        </section>

        <section id="veil" className="scroll-mt-24">
          <Card>
            <h2 className="text-3xl text-[#800020]">Veil</h2>
            <ul className="mt-3 list-disc list-inside text-gray-700">
              <li>Ms. Alma Lopez & Mr. Michael Brian Bernardo</li>
              <li>Ms. Czarina S. Crisostomo & Mr. Jim Wel Campillo</li>
            </ul>
          </Card>
        </section>

        <section id="cords" className="scroll-mt-24">
          <Card>
            <h2 className="text-3xl text-[#800020]">Cords</h2>
            <ul className="mt-3 list-disc list-inside text-gray-700">
              <li>Mrs. Krischelle Velasquez-Sanchez & Mr. Joshua Sanchez</li>
              <li>Mrs. Richel Ann Florentino & Mr. Francis Erizz Florentino</li>
            </ul>
          </Card>
        </section>
      </div>

      <div className="mt-10 text-center">
        <Link
          to={`/${query}`}
          className="inline-flex items-center justify-center rounded-2xl border-2 border-[#800020] text-[#800020] px-5 py-2 font-medium hover:bg-[#800020] hover:text-white transition"
        >
          Back to Home
        </Link>
      </div>
    </Shell>
  );
}

// -----------------------------
// RSVP Page
// -----------------------------
function RsvpPage() {
  const navigate = useNavigate();
  const { setRsvp } = useRSVP();

  const [searchParams] = useSearchParams();
  const plusOneParam = searchParams.get("rsvp");

  const [submitted, setSubmitted] = useState(false);
  const [attendance, setAttendance] = useState(""); // Yes | No | Maybe
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [side, setSide] = useState("Bride");
  // const [plusAllowance, setPlusAllowance] = useState("Not Allowed"); // Allowed | Not Allowed
  const [plusAllowance, setPlusAllowance] = useState(plusOneParam === "welcome" ? "Allowed" : "Not Allowed");
  const [plusName, setPlusName] = useState("");
  const [bringingCar, setBringingCar] = useState("No");
  const [errors, setErrors] = useState([]);

  const location = useLocation();
  const query = location.search; // e.g. "?qqxx=abc123" 

  const validate = () => {
    const errs = [];
    if (!name.trim()) errs.push("Main Guest Full Name is required.");
    if (!contact.trim()) errs.push("Contact No. is required.");
    if (!attendance) errs.push("Please select your attendance.");
    if (!side) errs.push("Please choose your side.");
    if (!plusAllowance) errs.push("Please indicate plus-one allowance.");
    return errs;
  };

  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   const v = validate();
  //   setErrors(v);
  //   if (v.length === 0) {
  //     const payload = { name, contact, side, attendance, plusAllowance, plusName, bringingCar };
  //     setRsvp(payload);
  //     setSubmitted(true);
  //   }
  // };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (v.length === 0) {
      const formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("phone", contact);
      formData.append("contact_name", plusName);
      formData.append("q1", attendance);
      formData.append("q2", bringingCar);

      try {
        const response = await fetch("https://api.dcinnovare.com/submit_form", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData
        });

        const result = await response.json();
        console.log("Submitted:", result);
        setRsvp({ name, contact, side, attendance, plusAllowance, plusName, bringingCar });
        setSubmitted(true);
      } catch (error) {
        console.error("Submission failed:", error);
        setErrors(["Failed to submit RSVP. Please try again later."]);
      }
    }
  };


  const Result = () => {
    const commonBtn = (
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        {(attendance === "Yes" || attendance === "Maybe") && (
          <button
            onClick={() => navigate("/" + query)}
            className="inline-flex items-center justify-center rounded-2xl bg-gray-900 text-white px-5 py-3 font-medium shadow hover:bg-gray-800"
          >
            Go to Wedding Website
          </button>
        )}
        <button
          onClick={() => navigate("/your-rsvp" + query)}
          className="inline-flex items-center justify-center rounded-2xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
        >
          View Your RSVP
        </button>
      </div>
    );

    if (attendance === "Yes") {
      return (
        <Card className="text-center">
          <h3 className="text-2xl">Thank you, {name}! 🎉💛</h3>
          <p className="mt-3 text-gray-700">We can’t wait to celebrate with you! Your seat is reserved, and we’re already counting the days until November 22, 2025.</p>
          <p className="mt-2 text-gray-700">You can now explore our wedding website for more details, love stories, and updates.</p>
          {plusName?.trim() && (<p className="mt-2 text-gray-700">Plus one noted: <span className="font-medium">{plusName}</span>.</p>)}
          <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 max-w-xl mx-auto">📌 <span className="font-medium">Important:</span> If your plans change and you won’t be able to attend, please let us know as soon as possible so we can offer your seat to someone else.</p>
          {bringingCar === "Yes" && (<p className="mt-3 text-gray-700">We’ve noted that you’ll be bringing a car. 🚗</p>)}
          {commonBtn}
        </Card>
      );
    }

    if (attendance === "Maybe") {
      return (
        <Card className="text-center">
          <h3 className="text-2xl">Thank you, {name}! 💌</h3>
          <p className="mt-3 text-gray-700">We understand you’re not sure yet, and that’s okay! We’ll send you a reminder to confirm your attendance three months before the wedding so we can save your spot if you decide to join us.</p>
          <p className="mt-2 text-gray-700">You can still explore our wedding website for updates while you decide.</p>
          <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 max-w-xl mx-auto">📌 <span className="font-medium">Important:</span> If you confirm later and then find you can’t attend, please inform us right away so we can give the slot to another guest.</p>
          {commonBtn}
        </Card>
      );
    }

    return (
      <Card className="text-center">
        <h3 className="text-2xl">Thank you, {name}! 💛</h3>
        <p className="mt-3 text-gray-700">We understand you can’t join us, and we’ll miss you on our special day. Your love and well wishes mean the world, and we hope to celebrate with you another time.</p>
        <div className="mt-6">
          <button onClick={() => navigate("/")} className="inline-flex items-center justify-center rounded-2xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50">Back to Home</button>
        </div>
      </Card>
    );
  };

  return (
    <Shell hero={null}>
      {!submitted ? (
        <Card>
          <h2 className="text-3xl text-[#800020]">Attendance Confirmation</h2><br/>
          <form onSubmit={onSubmit} className="space-y-5 text-[#800020]">
            <div>
              <FieldLabel required>Main Guest Full Name</FieldLabel>
              <Input value={name} onChange={setName} placeholder="e.g., Juan C. Dela Cruz" required />
            </div>

            <div>
              <FieldLabel required>Contact No.</FieldLabel>
              <Input value={contact} onChange={setContact} placeholder="e.g., 09XXXXXXXXX" required />
              <p className="text-xs text-gray-500 mt-1">We'll use this to send reminders and updates.</p>
            </div>

            <div>
              <FieldLabel required>Side</FieldLabel>
              <RadioGroup
                name="side"
                value={side}
                onChange={setSide}
                options={[
                  { label: "Bride", value: "Bride" },
                  { label: "Groom", value: "Groom" },
                ]}
              />
            </div>

            <div>
              <FieldLabel required>Attendance (Yes/No/Maybe)</FieldLabel>
              <Select value={attendance} onChange={setAttendance} required>
                <option value="" disabled>Select your response</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Maybe">Maybe</option>
              </Select>
            </div>

            {/* <div>
              <FieldLabel required>Plus-one allowance</FieldLabel>
              <Select value={plusAllowance} onChange={setPlusAllowance} required>
                <option value="Allowed">Allowed</option>
                <option value="Not Allowed">Not Allowed</option>
              </Select>
            </div> */}

              {false && (
                <div>
                  <FieldLabel required>Plus-one allowance</FieldLabel>
                  <Select
                    value={plusAllowance}
                    onChange={() => {}}
                    required
                    disabled
                  >
                    <option value="Allowed">Allowed</option>
                    <option value="Not Allowed">Not Allowed</option>
                  </Select>
                </div>
              )}


            {plusAllowance === "Allowed" && attendance !== "No" && (
              <div>
                <FieldLabel>Complete Name of Additional Guest</FieldLabel>
                <Input value={plusName} onChange={setPlusName} placeholder="e.g., Calvin Crisostomo" />
                <p className="text-xs text-gray-500 mt-1">Optional. Add if you plan to bring a plus one.</p>
              </div>
            )}

            {plusAllowance === "Not Allowed" && (
              <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl p-3">
                Due to our limited guest capacity, we won’t be able to add an additional seat for a plus one. We truly hope you can still join us and make our day even more special with your presence.
              </div>
            )}

            <div>
              <FieldLabel>Will you be bringing your car?</FieldLabel>
              <RadioGroup
                name="car"
                value={bringingCar}
                onChange={setBringingCar}
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                ]}
              />
            </div>

            {errors.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <ul className="list-disc list-inside">
                  {errors.map((err, idx) => (<li key={idx}>{err}</li>))}
                </ul>
              </div>
            )}

      <button
        type="submit"
        className="min-h-[44px] w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#800020] text-[#800020] px-5 py-3 font-medium shadow hover:bg-[#800020] hover:text-white active:scale-[.99]"
      >
        Submit RSVP
      </button>
            <p className="text-xs text-gray-500 mt-1">By submitting, you agree that we may contact you for reminders and updates.</p>
          </form>
        </Card>
      ) : (
        <Result />
      )}

      <div className="mt-10 text-center text-sm text-gray-600">
        <p>⛪ Ceremony: Barasoain Church, Malolos, Bulacan</p>
        <p>🎉 Reception: Felicisima Paz Grand Pavilion & Private Resort, Atlag, Malolos, Bulacan</p>
      </div>
    </Shell>
  );
}

// -----------------------------
// App Root
// -----------------------------
export default function App() {
  return (
    <RSVPProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/details" element={<DetailsPage />} />
          {/* <Route path="/venue" element={<VenuePage />} /> */}
          <Route path="/attire" element={<AttirePage />} />
          <Route path="/entourage" element={<EntouragePage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/your-rsvp" element={<YourRSVPPage />} />
          <Route path="/rsvp" element={<RsvpPage />} />
        </Routes>
      </BrowserRouter>
    </RSVPProvider>
  );
}
