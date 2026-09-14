import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="bg-blue-600 text-white font-bold py-1 px-2 rounded-md text-lg">
                CARS
              </span>
              <span className="text-orange-500 font-bold text-lg">24</span>
            </div>
            <p className="text-sm text-slate-400">
              India's leading platform to buy, sell, and estimate vehicle upkeep expenses with AI transparency.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Quality & Inspection</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Explore Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
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
                <Link href="/maintenance-estimator" className="hover:text-white transition-colors">
                  Maintenance Cost Estimator
                </Link>
              </li>
              <li>
                <Link href="/finance" className="hover:text-white transition-colors">
                  Car Finance & EMI
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Smart Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/maintenance-estimator" className="hover:text-white transition-colors">
                  Predictive Upkeep Calculator
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-white transition-colors">
                  Inspection Appointments
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:text-white transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>1800-258-5656 (Toll Free)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@cars24.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CARS24 Financial & Maintenance Services. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Built with precision for smart car buyers</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
