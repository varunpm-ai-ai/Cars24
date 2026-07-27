import React from "react";
import Link from "next/link";
import { Car, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-1">
              <span className="bg-blue-600 text-white font-black py-1 px-2.5 rounded-lg text-lg tracking-wider">
                CARS
              </span>
              <span className="text-orange-500 font-black text-xl ml-0.5">24</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              India's premier marketplace for buying & selling quality used cars with real-time regional & seasonal dynamic market pricing.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Multi-Tenant & AI Dynamic Pricing Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Buy & Sell Cars
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/buy-car" className="hover:text-white transition-colors">
                  Buy Used Cars
                </Link>
              </li>
              <li>
                <Link href="/sell-car" className="hover:text-white transition-colors">
                  Sell Your Car
                </Link>
              </li>
              <li>
                <Link href="/buy-car" className="hover:text-white transition-colors">
                  Dynamic Recommended Price Engine
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  User Dashboard & My Listings
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Services & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/finance" className="hover:text-white transition-colors">
                  Car Loans & Financing
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Car Inspections & Services
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-white transition-colors">
                  Become Our Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Contact & Regions
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Delhi NCR • Mumbai • Manali • Bengaluru • Goa</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>1800-24-2424 (24x7 Toll Free)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@cars24.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Cars24 Services Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;