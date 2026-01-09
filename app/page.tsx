import Image from "next/image";
import GummyPackage from "../public/go-solo-package.png";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 overflow-hidden bg-dark px-4">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
              Exclusive Brand
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white">
              LEVEL UP YOUR <br />
              <span className="text-secondary">DAILY</span> <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-500">
                PERFORMANCE
              </span>
            </h1>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="h-1 w-12 bg-white/20"></div>
              <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-white">
                EASILY, SAFELY, <br />
                AND IN STYLE.
              </h2>
            </div>
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
              India's First Functional Gummy Brand — made for gamers, students,
              athletes &amp; night owls.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="p-0.5 rounded-full bg-linear-to-r from-orange-500 to-blue-600 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow cursor-pointer group">
                <Link href="/shop">
                  <button className="bg-[#111] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full flex items-center gap-3 font-medium transition-all group-hover:bg-opacity-90 text-sm sm:text-base">
                    Try Boost Gummies
                    <span className="material-icons-round text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">
                      north_east
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative order-1 lg:order-2 flex justify-center items-center py-8 lg:py-0">
            {/* Floating gummy pieces - hidden on mobile */}
            <div
              className="absolute top-4 right-4 sm:top-10 sm:right-10 z-20 animate-bounce hidden sm:block"
              style={{ animationDuration: "3s" }}
            >
              <div className="bg-[#1a1a1a] p-2 rounded-full border border-secondary/30 shadow-lg w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                <img
                  alt="Gummy piece"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYdP3wcSPtKoHNBUv0wTT-06CqrA3clqNADoQHIYI5j99kNjNhOkcxHpvtf_vcbpMtcYWxVRg-T0eUXHtq4yD7K45m-Th3zXPf-IypIahAWdMqm7HPDgvZ9ci-NkZZ8kN2l1cuLkYVkCI5Dot4BIQulGoRuoIhcAhli9g_ZJddkYLXPpmjcZj0ikko5Vf_kVf-4GYOKX0pKAQpFzbIl8G6x0hfz_I-aSS2hoGKC2xuEjYxyFpyMcQ_p7SjB4AhG-om_Ysup6VPlFM"
                />
              </div>
            </div>
            <div
              className="absolute bottom-10 left-4 sm:bottom-20 sm:left-10 z-20 animate-bounce hidden sm:block"
              style={{ animationDuration: "4s" }}
            >
              <div className="bg-[#1a1a1a] p-2 rounded-full border border-primary/30 shadow-lg w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center">
                <img
                  alt="Gummy piece"
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoJE0vqsLZvPSXouYLCrR1miqZNRVhWFFLBfeRZrdyhTk8TlgIF30m-teLS0XWIX2DIqlmsf8MhnxlOmfIQd4VjuVd0rtgRmD1VQ_YC4z2gO2kmrmv4voJKaR9Q5XPBJg79MHT2bc13NdaxPGbWzUqJ7YmDEMCEThxJnZwDsjv9nSHjxQLeuk523YPhckU2iqnfm9Lmfm2Ry0UwCY1LVYbkF07OWj5EFS8kzbYJ2tW8nN4Lef3EANDwrR3fMGfG6VW7ZrvlymW8us"
                />
              </div>
            </div>
            
            {/* Main product image */}
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
              <div className="relative w-48 h-72 sm:w-64 sm:h-96 md:w-80 md:h-[480px] lg:w-96 lg:h-[550px] mx-auto">
                <Image
                  alt="Gummy Jar Package"
                  className="object-contain"
                  src={GummyPackage}
                  fill
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-8 sm:py-10 border-y border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white flex items-center gap-2">
              <span className="material-icons-round">bolt</span>
              ESPORTS.GG
            </span>
            <span className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white flex items-center gap-2">
              <span className="material-icons-round">fitness_center</span>
              IGNITE
            </span>
            <span className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white flex items-center gap-2 hidden sm:flex">
              <span className="material-icons-round">school</span>
              UNI-LEAGUE
            </span>
            <span className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white flex items-center gap-2 hidden md:flex">
              <span className="material-icons-round">stadia_controller</span>
              GAMERHUB
            </span>
          </div>
        </div>
      </section>

      {/* Why Go Solo */}
      <section className="py-16 sm:py-24 bg-dark relative" id="about">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4 text-white">
              WHY <span className="text-primary">GO-SOLO?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              Engineered for peak performance without the jitters. Pure, clean,
              functional energy.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-card-bg border border-card-border hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                <span className="material-icons-round text-2xl sm:text-3xl">speed</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl mb-3 text-white">
                Instant Activation
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Absorbs 5x faster than pills or drinks. Feel the rush within 10
                minutes of consumption.
              </p>
            </div>
            <div className="p-6 sm:p-8 rounded-3xl bg-card-bg border border-card-border hover:border-secondary/50 transition-colors group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
                <span className="material-icons-round text-2xl sm:text-3xl">psychology</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl mb-3 text-white">
                Laser Focus
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Nootropics blend designed to clear brain fog and enhance
                cognitive function.
              </p>
            </div>
            <div className="p-6 sm:p-8 rounded-3xl bg-card-bg border border-card-border hover:border-green-500/50 transition-colors group sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors text-green-500">
                <span className="material-icons-round text-2xl sm:text-3xl">battery_charging_full</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl mb-3 text-white">
                Zero Crash
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Sustained release energy means no sudden drop. Keep performing
                at your peak.
              </p>
            </div>
          </div>
        </div>
      </section>



      <section className="py-16 sm:py-20 border-y border-white/5 bg-dark">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-8 sm:mb-12 text-white">
            FUELLING THE <span className="text-primary">OBSESSED</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex flex-col items-center gap-3 sm:gap-4 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <span className="material-icons-round text-2xl sm:text-3xl text-gray-300 group-hover:text-white">
                  sports_esports
                </span>
              </div>
              <span className="font-display font-bold tracking-wider text-white text-sm sm:text-base">
                GAMERS
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 sm:gap-4 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                <span className="material-icons-round text-2xl sm:text-3xl text-gray-300 group-hover:text-white">
                  menu_book
                </span>
              </div>
              <span className="font-display font-bold tracking-wider text-white text-sm sm:text-base">
                STUDENTS
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 sm:gap-4 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                <span className="material-icons-round text-2xl sm:text-3xl text-gray-300 group-hover:text-white">
                  fitness_center
                </span>
              </div>
              <span className="font-display font-bold tracking-wider text-white text-sm sm:text-base">
                ATHLETES
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 sm:gap-4 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
                <span className="material-icons-round text-2xl sm:text-3xl text-gray-300 group-hover:text-white">
                  code
                </span>
              </div>
              <span className="font-display font-bold tracking-wider text-white text-sm sm:text-base">
                CREATORS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 sm:py-24 bg-black" id="social-proof">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
            <span className="material-icons-round text-primary">star</span>
            <span className="font-bold text-white text-sm sm:text-base">4.9/5 Average Rating</span>
            <span className="text-gray-500 text-xs sm:text-sm">(2,500+ Reviews)</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-card-bg p-6 sm:p-8 rounded-2xl shadow-sm border border-card-border hover:border-primary/30 transition-colors">
              <div className="flex gap-1 text-primary mb-4">
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
              </div>
              <p className="text-gray-300 mb-6 font-medium text-sm sm:text-base">
                "Finally something that works without making me jittery. My rank
                in Valorant actually went up after I started using these."
              </p>
              <div className="flex items-center gap-3">
                <img
                  alt="User avatar"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5xQopZSrZks633njom4PeF2-TgQUBjstnM9sRlXw516mAZjl3jLTIy6zpH1g8z9aYMzfFZXOjAZZhbJD9XPDNEMkEyjEiglYEH6ez15G8-D7wqZ_mJtAjDmIKLrGSq9sYeFit6VO5ov5zOdPqbx7mUGV71nYjJFmLtGIqHv2u5L6Qk9n-xFN4yX8Uf_fAVXH09aDh6cpNJwjClGzgB1Df3q3BLWxKLrop9j6ynGNoX_Q2DVKW9_AzdhFGPfsqcMmNVqXckxo39Tw"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">Alex "Sniper" K.</h4>
                  <p className="text-xs text-gray-500">Pro Gamer</p>
                </div>
              </div>
            </div>
            <div className="bg-card-bg p-6 sm:p-8 rounded-2xl shadow-sm border border-card-border hover:border-primary/30 transition-colors">
              <div className="flex gap-1 text-primary mb-4">
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
              </div>
              <p className="text-gray-300 mb-6 font-medium text-sm sm:text-base">
                "Med school is brutal. The Focus gummies are a lifesaver for
                late night study sessions. Taste amazing too."
              </p>
              <div className="flex items-center gap-3">
                <img
                  alt="User avatar"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRrmlq0Phai9KS8e-5CG3ctAXJ9rp2NOBZE7W-bOSrfg3zBrpa9ggC9q8h50Viuu8-ogtlmJhIDNgQtxwKPauk-Q9vLOWDZV2QIeBtGTpnoLrY1tpCDPfI3mjJh9g7MzBC5ezs168Oju35sH3UL5I0V7-YJJsRuy59XhuDtkGZj9KVvzor-ZlLkadQfQZimeeb0ZnPpbmLBIOOupDLn46xg0EwxsRq0Sx2d4E-s7Wl00_3DLgGB7pgavs8ejdjXgefb_Kf2C5UkwE"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">Sarah M.</h4>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>
            </div>
            <div className="bg-card-bg p-6 sm:p-8 rounded-2xl shadow-sm border border-card-border hover:border-primary/30 transition-colors sm:col-span-2 lg:col-span-1">
              <div className="flex gap-1 text-primary mb-4">
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star_half</span>
              </div>
              <p className="text-gray-300 mb-6 font-medium text-sm sm:text-base">
                "I hit the gym at 6AM and these give me the push I need without
                the coffee crash at 10AM. Solid product."
              </p>
              <div className="flex items-center gap-3">
                <img
                  alt="User avatar"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLHnFjdgH6sJMFXyUmIQyekVQ0HFl_LgCTkXyQjq5gKXfuh4Wjr9tsTozOO6lz_BJ4TP8u60YU88NKVOIzqskWZW_B29IfA_GqInXVEnpxhP-QT6cuD_mwQd35CmjeUDWrVmQLdtij9gzadFHmfZGL43ZwwxeaAOM5OjB4136iMFcAEeF07YRXQ50CREp1BT3lpd9lsQDr3Uh4ln7FuEwOQV6FB3P9ZSmrDNGaa6D5jYfRh0PoijqNbtyzyjQvlGPknux5zC_YUW0"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">Mike T.</h4>
                  <p className="text-xs text-gray-500">Fitness Coach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-32 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary via-gray-900 to-black"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl text-white mb-6 sm:mb-8 tracking-tighter">
            GO SOLO. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">
              GO STRONG.
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
            Don't let fatigue hold you back. Join thousands who have leveled up
            their daily routine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-primary hover:bg-orange-600 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              Shop Now
            </Link>
            <button className="bg-transparent border border-gray-600 text-white hover:bg-white/10 font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-full transition-all">
              View Science
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark border-t border-white/10 pt-12 sm:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12 sm:mb-16">
            <div className="col-span-2">
              <Link className="flex items-center gap-2 mb-4 sm:mb-6" href="/">
                <span className="material-icons-round text-primary text-2xl sm:text-3xl">pets</span>
                <span className="font-display font-bold text-lg sm:text-xl tracking-tighter text-white">
                  GO SOLO
                </span>
              </Link>
              <p className="text-gray-500 text-sm mb-4 sm:mb-6 max-w-xs">
                High-performance functional gummies for the next generation of
                achievers.
              </p>
              <div className="flex gap-4">
                <a className="text-gray-400 hover:text-primary transition-colors" href="#">
                  <span className="material-icons-round">facebook</span>
                </a>
                <a className="text-gray-400 hover:text-primary transition-colors" href="#">
                  <span className="material-icons-round">smart_display</span>
                </a>
                <a className="text-gray-400 hover:text-primary transition-colors" href="#">
                  <span className="material-icons-round">alternate_email</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 sm:mb-6 text-sm sm:text-base">Shop</h4>
              <ul className="space-y-3 sm:space-y-4 text-sm text-gray-500">
                <li><Link className="hover:text-primary transition-colors" href="/shop">Energy</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/shop">Focus</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/shop">Recovery</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/shop">Bundles</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 sm:mb-6 text-sm sm:text-base">Company</h4>
              <ul className="space-y-3 sm:space-y-4 text-sm text-gray-500">
                <li><Link className="hover:text-primary transition-colors" href="/about">About Us</Link></li>
                <li><a className="hover:text-primary transition-colors" href="#">Ambassadors</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Science</a></li>
                <li><Link className="hover:text-primary transition-colors" href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="hidden lg:block">
              <h4 className="font-bold text-white mb-6 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a className="hover:text-primary transition-colors" href="#">Privacy</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Terms</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Shipping</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              © 2024 GO SOLO. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              Made with
              <span className="material-icons-round text-red-500 text-xs">favorite</span>
              for high performance.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
