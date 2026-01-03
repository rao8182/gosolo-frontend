import Image from "next/image";
import GummyPackage from "../public/go-solo-package.png";

export default function Home() {
  return (
    <main className="">
      {/* HERO */}

      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-dark">
        {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div> */}
        {/* <div className="absolute top-0 right-0 w-125 h-125 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div> */}
        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
              Exclusive Brand
            </span>
            <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-[1.1] tracking-tight text-white">
              LEVEL UP YOUR <br />
              <span className="text-secondary">DAILY</span> <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-500">
                PERFORMANCE
              </span>
            </h1>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="h-1 w-12 bg-white/20"></div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
                EASILY, SAFELY, <br />
                AND IN STYLE.
              </h2>
            </div>
            <p className="text-gray-400 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
              India's First Functional Gummy Brand — made for gamers, students,
              athletes &amp; night owls.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="p-0.5 rounded-full bg-linear-to-r from-orange-500 to-blue-600 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow cursor-pointer group">
                <a href="/shop">
                  <button className="bg-[#111] text-white px-8 py-3.5 rounded-full flex items-center gap-3 font-medium transition-all group-hover:bg-opacity-90">

                    Try Boost Gummies
                    <span className="material-icons-round text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">
                      north_east
                    </span>
                  </button>
                </a>
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 flex justify-center items-center">
            <div
              className="absolute top-10 right-10 z-20 animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="bg-[#1a1a1a] p-2 rounded-full border border-secondary/30 shadow-lg w-16 h-16 flex items-center justify-center">
                <img
                  alt="Gummy piece"
                  className="w-10 h-10 object-contain rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYdP3wcSPtKoHNBUv0wTT-06CqrA3clqNADoQHIYI5j99kNjNhOkcxHpvtf_vcbpMtcYWxVRg-T0eUXHtq4yD7K45m-Th3zXPf-IypIahAWdMqm7HPDgvZ9ci-NkZZ8kN2l1cuLkYVkCI5Dot4BIQulGoRuoIhcAhli9g_ZJddkYLXPpmjcZj0ikko5Vf_kVf-4GYOKX0pKAQpFzbIl8G6x0hfz_I-aSS2hoGKC2xuEjYxyFpyMcQ_p7SjB4AhG-om_Ysup6VPlFM"
                />
              </div>
            </div>
            <div
              className="absolute bottom-20 left-10 z-20 animate-bounce"
              style={{ animationDuration: "4s" }}
            >
              <div className="bg-[#1a1a1a] p-2 rounded-full border border-primary/30 shadow-lg w-14 h-14 flex items-center justify-center">
                <img
                  alt="Gummy piece"
                  className="w-8 h-8 object-contain rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoJE0vqsLZvPSXouYLCrR1miqZNRVhWFFLBfeRZrdyhTk8TlgIF30m-teLS0XWIX2DIqlmsf8MhnxlOmfIQd4VjuVd0rtgRmD1VQ_YC4z2gO2kmrmv4voJKaR9Q5XPBJg79MHT2bc13NdaxPGbWzUqJ7YmDEMCEThxJnZwDsjv9nSHjxQLeuk523YPhckU2iqnfm9Lmfm2Ry0UwCY1LVYbkF07OWj5EFS8kzbYJ2tW8nN4Lef3EANDwrR3fMGfG6VW7ZrvlymW8us"
                />
              </div>
            </div>
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
              <div className="relative w-75 h-112.5 md:w-100 md:h-137.5 mx-auto">
                <Image
                  alt="Gummy Jar Package"
                  className="w-75 h-112.5 scale-110 md:w-100 md:h-137.5 object-contain"
                  src={GummyPackage}
                />
                {/* 
                <div className="absolute inset-0 bg-[#eaddcf] rounded-[4rem] rounded-b-4xl shadow-2xl flex flex-col items-center pt-16 overflow-hidden border-b-8 border-r-8 border-gray-700">
                  <div className="text-center mb-4">
                    <span className="material-icons-round text-4xl text-yellow-600 mb-2">
                      workspace_premium
                    </span>
                    <h3 className="font-display font-bold text-3xl text-[#8b7355] tracking-widest">
                      GO SOLO
                    </h3>
                    <p className="text-[#8b7355] uppercase text-xs tracking-[0.3em] mt-1 font-bold">
                      Energy Gummies
                    </p>
                  </div>
                  <div className="text-center text-[#5d5142] text-sm space-y-1 mb-12">
                    <p>Ignite Your Limits.</p>
                    <p className="font-semibold">Ultra Focus</p>
                    <p className="font-semibold">Clean Energy</p>
                    <p className="font-semibold">Zero Crash</p>
                  </div>
                  <div className="w-32 h-32 bg-linear-to-b from-amber-700 to-amber-900 rounded-full opacity-90 blur-sm mb-4"></div>
                  <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-red-600 via-orange-500 to-transparent flex items-end justify-center pb-4 gap-1 px-8 flex-wrap">
                    <div className="w-6 h-6 rounded-full bg-yellow-400 shadow-inner"></div>
                    <div className="w-6 h-6 rounded-full bg-red-500 shadow-inner"></div>
                    <div className="w-6 h-6 rounded-full bg-orange-500 shadow-inner"></div>
                    <div className="w-6 h-6 rounded-full bg-yellow-400 shadow-inner"></div>
                    <div className="w-6 h-6 rounded-full bg-orange-500 shadow-inner"></div>
                  </div>
                </div>
                */}
              </div>

            </div>
          </div>
        </div>
      </section>
      <section className="py-10 border-y border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-display font-bold text-xl md:text-2xl text-white flex items-center gap-2">
              <span className="material-icons-round">bolt</span>
              ESPORTS.GG
            </span>

            <span className="font-display font-bold text-xl md:text-2xl text-white flex items-center gap-2">
              <span className="material-icons-round">fitness_center</span>
              IGNITE
            </span>

            <span className="font-display font-bold text-xl md:text-2xl text-white flex items-center gap-2">
              <span className="material-icons-round">school</span>
              UNI-LEAGUE
            </span>

            <span className="font-display font-bold text-xl md:text-2xl text-white flex items-center gap-2">
              <span className="material-icons-round">stadia_controller</span>
              GAMERHUB
            </span>
          </div>
        </div>
      </section>
      <section className="py-24 bg-dark relative" id="about">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-white">
              WHY <span className="text-primary">GO-SOLO?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Engineered for peak performance without the jitters. Pure, clean,
              functional energy.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-card-bg border border-card-border hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                <span className="material-icons-round text-3xl">speed</span>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-white">
                Instant Activation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Absorbs 5x faster than pills or drinks. Feel the rush within 10
                minutes of consumption.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-card-bg border border-card-border hover:border-secondary/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
                <span className="material-icons-round text-3xl">
                  psychology
                </span>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-white">
                Laser Focus
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Nootropics blend designed to clear brain fog and enhance
                cognitive function.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-card-bg border border-card-border hover:border-green-500/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors text-green-500">
                <span className="material-icons-round text-3xl">
                  battery_charging_full
                </span>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-white">
                Zero Crash
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Sustained release energy means no sudden drop. Keep performing
                at your peak.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-black" id="products">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">
                Our Arsenal
              </span>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
                CHOOSE YOUR
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-600">
                  WEAPON
                </span>
              </h2>
            </div>
            <a
              className="text-gray-300 hover:text-primary font-medium flex items-center gap-1 group"
              href="/shop"
            >
              View all products
              <span className="material-icons-round group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative rounded-3xl overflow-hidden bg-card-bg border border-card-border hover:border-primary/50 transition-all h-125 flex flex-col">
              <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-8 relative z-10">
                <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Best Seller
                </span>
                <h3 className="font-display font-bold text-3xl mt-4 text-white">
                  ENERGY
                </h3>
                <p className="text-gray-400 mt-2">Sour Apple Flavor</p>
              </div>
              <div className="flex-1 flex items-center justify-center relative z-10">
                <div className="w-48 h-48 rounded-full bg-linear-to-tr from-orange-400 to-yellow-300 blur-2xl opacity-40 absolute group-hover:scale-125 transition-transform duration-700"></div>
                <img
                  alt="Energy Salad Bowl placeholder"
                  className="w-40 h-40 object-cover rounded-full shadow-2xl group-hover:-translate-y-4 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPpqoY6E7Ec0D8X1QSdbUm8KQ6V1dUWFwai3nxyfnUjlaxKUmkkS_EDCiBDqU7NB2r6JYkeFeQNOZaPm-6dYXN7hahGSkiP87mG6Oj6padRLYfC0DpEl5dA3KhHiavHqaJndO-wh3-JTrbCzTtI_NsLgHNQPg9aMZOmhK6C8g7Lo9MpUZ-LnWLHf0D9Segtov0Aq7jYsoriWqd_gFPoaPPhHb6h5Mov3kD5dWGGou7GHPL2Ul2RxKXwfOLQKo3ZtFjdDYMhPkptM4"
                />
              </div>
              <div className="p-6 relative z-10 border-t border-card-border flex justify-between items-center bg-[#111]">
                <span className="font-display font-bold text-xl text-white">
                  $29.99
                </span>
                <button className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="material-icons-round text-lg">add</span>
                </button>
              </div>
            </div>
            <div className="group relative rounded-3xl overflow-hidden bg-card-bg border border-card-border hover:border-secondary/50 transition-all h-125 flex flex-col">
              <div className="absolute inset-0 bg-linear-to-b from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-8 relative z-10">
                <span className="bg-secondary/20 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase">
                  New Arrival
                </span>
                <h3 className="font-display font-bold text-3xl mt-4 text-white">
                  FOCUS
                </h3>
                <p className="text-gray-400 mt-2">Blue Raspberry</p>
              </div>
              <div className="flex-1 flex items-center justify-center relative z-10">
                <div className="w-48 h-48 rounded-full bg-linear-to-tr from-blue-600 to-cyan-400 blur-2xl opacity-40 absolute group-hover:scale-125 transition-transform duration-700"></div>
                <img
                  alt="Focus Healthy Bowl Placeholder"
                  className="w-40 h-40 object-cover rounded-full shadow-2xl group-hover:-translate-y-4 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeQEFMPfHcTChN2l_wifg0MchZl6fQpOqwY-G3JG9ndcsGi8x3zYbhqcEpoeoFXv8ADxW31K2Ab2cpKaI_JX6TNCYHNMxbvLbI7uYyeso994aPnkZa7ZHpjd57guHamMz8YsLcMrPKriHwZN2Z5_mKr5exyOcuDUHqyw808pH4he_lehehjt70F_LYWs_YrpYfk2esisxB0r5jazRAXx0D3HxLFwZB0HE7t8sdIcna40tKKmsOorfKxrSp05UbZg7D0xcHm2iHev4"
                />
              </div>
              <div className="p-6 relative z-10 border-t border-card-border flex justify-between items-center bg-[#111]">
                <span className="font-display font-bold text-xl text-white">
                  $32.99
                </span>
                <button className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                  <span className="material-icons-round text-lg">add</span>
                </button>
              </div>
            </div>
            <div className="group relative rounded-3xl overflow-hidden bg-card-bg border border-card-border hover:border-purple-500/50 transition-all h-125 flex flex-col">
              <div className="absolute inset-0 bg-linear-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-8 relative z-10">
                <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Night Mode
                </span>
                <h3 className="font-display font-bold text-3xl mt-4 text-white">
                  RECOVERY
                </h3>
                <p className="text-gray-400 mt-2">Berry Blast</p>
              </div>
              <div className="flex-1 flex items-center justify-center relative z-10">
                <div className="w-48 h-48 rounded-full bg-linear-to-tr from-purple-600 to-pink-400 blur-2xl opacity-40 absolute group-hover:scale-125 transition-transform duration-700"></div>
                <img
                  alt="Recovery Food Placeholder"
                  className="w-40 h-40 object-cover rounded-full shadow-2xl group-hover:-translate-y-4 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAAVZIAWR1G0vmx_ozdRO4aWnnsLGxfejOb0yeN1LAbbVpJCVnl0TtrGQWLZuVc_g_gBqxl-NWuUZoROl3T2RuP5YaBqZIM7DeXdzd1ytFImQ8BwHaJ9g8MmLm1Mpd7RWGjYL_4OsAGrPIqzXc6xM4GP9pbtK9KSKwKhrsW4WQvTNfgznqD_AHik-vV4llWpEmFF-6kwvesrA49oXa9xXh7fz4fVWyPj25uDQyjAUXFhrL9zugHhHgQ47WePVVHn1ehrdmzSPc_f8"
                />
              </div>
              <div className="p-6 relative z-10 border-t border-card-border flex justify-between items-center bg-[#111]">
                <span className="font-display font-bold text-xl text-white">
                  $29.99
                </span>
                <button className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors">
                  <span className="material-icons-round text-lg">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 border-y border-white/5 bg-dark">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl mb-12 text-white">
            FUELLING THE <span className="text-primary">OBSESSED</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <span className="material-icons-round text-3xl text-gray-300 group-hover:text-white">
                  sports_esports
                </span>
              </div>
              <span className="font-display font-bold tracking-wider text-white">
                GAMERS
              </span>
            </div>
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                <span className="material-icons-round text-3xl text-gray-300 group-hover:text-white">
                  menu_book
                </span>
              </div>
              <span className="font-display font-bold tracking-wider text-white">
                STUDENTS
              </span>
            </div>
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                <span className="material-icons-round text-3xl text-gray-300 group-hover:text-white">
                  fitness_center
                </span>
              </div>
              <span className="font-display font-bold tracking-wider text-white">
                ATHLETES
              </span>
            </div>
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
                <span className="material-icons-round text-3xl text-gray-300 group-hover:text-white">
                  code
                </span>
              </div>
              <span className="font-display font-bold tracking-wider text-white">
                CREATORS
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-black" id="social-proof">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <span className="material-icons-round text-primary">star</span>
            <span className="font-bold text-white">4.9/5 Average Rating</span>
            <span className="text-gray-500 text-sm">(2,500+ Reviews)</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card-bg p-8 rounded-2xl shadow-sm border border-card-border hover:border-primary/30 transition-colors">
              <div className="flex gap-1 text-primary mb-4">
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
              </div>
              <p className="text-gray-300 mb-6 font-medium">
                "Finally something that works without making me jittery. My rank
                in Valorant actually went up after I started using these."
              </p>
              <div className="flex items-center gap-3">
                <img
                  alt="User avatar"
                  className="w-10 h-10 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5xQopZSrZks633njom4PeF2-TgQUBjstnM9sRlXw516mAZjl3jLTIy6zpH1g8z9aYMzfFZXOjAZZhbJD9XPDNEMkEyjEiglYEH6ez15G8-D7wqZ_mJtAjDmIKLrGSq9sYeFit6VO5ov5zOdPqbx7mUGV71nYjJFmLtGIqHv2u5L6Qk9n-xFN4yX8Uf_fAVXH09aDh6cpNJwjClGzgB1Df3q3BLWxKLrop9j6ynGNoX_Q2DVKW9_AzdhFGPfsqcMmNVqXckxo39Tw"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    Alex "Sniper" K.
                  </h4>
                  <p className="text-xs text-gray-500">Pro Gamer</p>
                </div>
              </div>
            </div>
            <div className="bg-card-bg p-8 rounded-2xl shadow-sm border border-card-border hover:border-primary/30 transition-colors">
              <div className="flex gap-1 text-primary mb-4">
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
              </div>
              <p className="text-gray-300 mb-6 font-medium">
                "Med school is brutal. The Focus gummies are a lifesaver for
                late night study sessions. Taste amazing too."
              </p>
              <div className="flex items-center gap-3">
                <img
                  alt="User avatar"
                  className="w-10 h-10 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRrmlq0Phai9KS8e-5CG3ctAXJ9rp2NOBZE7W-bOSrfg3zBrpa9ggC9q8h50Viuu8-ogtlmJhIDNgQtxwKPauk-Q9vLOWDZV2QIeBtGTpnoLrY1tpCDPfI3mjJh9g7MzBC5ezs168Oju35sH3UL5I0V7-YJJsRuy59XhuDtkGZj9KVvzor-ZlLkadQfQZimeeb0ZnPpbmLBIOOupDLn46xg0EwxsRq0Sx2d4E-s7Wl00_3DLgGB7pgavs8ejdjXgefb_Kf2C5UkwE"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">Sarah M.</h4>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>
            </div>
            <div className="bg-card-bg p-8 rounded-2xl shadow-sm border border-card-border hover:border-primary/30 transition-colors hidden lg:block">
              <div className="flex gap-1 text-primary mb-4">
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star</span>
                <span className="material-icons-round text-sm">star_half</span>
              </div>
              <p className="text-gray-300 mb-6 font-medium">
                "I hit the gym at 6AM and these give me the push I need without
                the coffee crash at 10AM. Solid product."
              </p>
              <div className="flex items-center gap-3">
                <img
                  alt="User avatar"
                  className="w-10 h-10 rounded-full object-cover"
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
      <section className="py-32 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary via-gray-900 to-black"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display font-bold text-5xl md:text-7xl text-white mb-8 tracking-tighter">
            GO SOLO. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">
              GO STRONG.
            </span>
          </h2>
          <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
            Don't let fatigue hold you back. Join thousands who have leveled up
            their daily routine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              Shop Now
            </button>
            <button className="bg-transparent border border-gray-600 text-white hover:bg-white/10 font-bold py-4 px-10 rounded-full transition-all">
              View Science
            </button>
          </div>
        </div>
      </section>
      <footer className="bg-dark border-t border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <a className="flex items-center gap-2 mb-6" href="#">
                <span className="material-icons-round text-primary text-3xl">
                  pets
                </span>
                <span className="font-display font-bold text-xl tracking-tighter text-white">
                  GO SOLO
                </span>
              </a>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">
                High-performance functional gummies for the next generation of
                achievers.
              </p>
              <div className="flex gap-4">
                <a
                  className="text-gray-400 hover:text-primary transition-colors"
                  href="#"
                >
                  <span className="material-icons-round">facebook</span>
                </a>
                <a
                  className="text-gray-400 hover:text-primary transition-colors"
                  href="#"
                >
                  <span className="material-icons-round">smart_display</span>
                </a>
                <a
                  className="text-gray-400 hover:text-primary transition-colors"
                  href="#"
                >
                  <span className="material-icons-round">alternate_email</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Shop</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Energy
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Focus
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Recovery
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Bundles
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    About Us
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Ambassadors
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Science
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Privacy
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Terms
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Shipping
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              © 2023 GO SOLO. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              Made with
              <span className="material-icons-round text-red-500 text-xs">
                favorite
              </span>
              for high performance.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
