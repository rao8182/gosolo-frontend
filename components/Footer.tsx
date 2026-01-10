import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-12 sm:pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12 sm:mb-16">
          <div className="col-span-2">
            <Link className="flex items-center gap-2 mb-4 sm:mb-6" href="/">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tighter text-white uppercase italic">
                GO SOLO
              </span>
            </Link>
            <p className="text-gray-500 text-sm mb-4 sm:mb-6 max-w-xs">
              High-performance functional gummies for the next generation of
              achievers.
            </p>
            <div className="flex gap-4">
              <a className="text-gray-400 hover:text-white transition-colors" href="#">
                <span className="material-icons-round">facebook</span>
              </a>
              <a className="text-gray-400 hover:text-white transition-colors" href="#">
                <span className="material-icons-round">smart_display</span>
              </a>
              <a className="text-gray-400 hover:text-white transition-colors" href="#">
                <span className="material-icons-round">alternate_email</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 sm:mb-6 text-sm sm:text-base">Shop</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm text-gray-500">
              <li><Link className="hover:text-white transition-colors" href="/shop">Gummies</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/shop">Slim Shake</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/shop">Fat Burner</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/shop">All Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 sm:mb-6 text-sm sm:text-base">Company</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm text-gray-500">
              <li><Link className="hover:text-white transition-colors" href="/about">About Us</Link></li>
              <li><a className="hover:text-white transition-colors" href="#">Ambassadors</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Science</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Contact</a></li>
            </ul>
          </div>
          <div className="hidden lg:block">
            <h4 className="font-bold text-white mb-6 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a className="hover:text-white transition-colors" href="#">Privacy</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Terms</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Shipping</a></li>
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
  );
}
