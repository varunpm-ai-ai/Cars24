import React from "react";
import Link from "next/link";

const Fotter = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-3">
              <span className="bg-blue-600 text-white font-bold py-1 px-2 rounded-md text-lg">
                CARS
              </span>
              <span className="text-orange-500 font-bold text-lg">24</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Buy, sell, and service pre-owned cars with instant real-time push notifications, verified quality checks, and seamless financing.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Buy Used Cars</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/buy-car" className="hover:text-white transition-colors">Popular Hatchbacks</Link></li>
              <li><Link href="/buy-car" className="hover:text-white transition-colors">Premium Sedans</Link></li>
              <li><Link href="/buy-car" className="hover:text-white transition-colors">SUVs & MUVs</Link></li>
              <li><Link href="/buy-car" className="hover:text-white transition-colors">Wishlist & Price Alerts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Services & Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/sell-car" className="hover:text-white transition-colors">Sell Your Car</Link></li>
              <li><Link href="/appointments" className="hover:text-white transition-colors">My Appointments</Link></li>
              <li><Link href="/bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link href="/profile/notifications" className="hover:text-white transition-colors">Push Notification Preferences</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Customer Support</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/rc-transfer" className="hover:text-white transition-colors">RC Transfer Status</Link></li>
              <li><Link href="/partner" className="hover:text-white transition-colors">Become Our Partner</Link></li>
              <li><span className="text-gray-400">24/7 Helpline: 1800-24-2424</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Cars24 Services Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
            <Link href="/profile/notifications" className="hover:text-orange-400">Notification Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Fotter;