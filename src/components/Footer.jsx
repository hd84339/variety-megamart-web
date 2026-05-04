import React from "react";
import { Camera, Play, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#111] text-white pt-16 pb-8 font-sans border-t-[8px] border-[#E60023]">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl">
                <img src={logo} alt="Variety MegaMart" className="h-10 object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tighter italic">
                MEGA<span className="text-[#E60023]">MART</span>
              </span>
            </div>
            <p className="text-gray-400 font-medium leading-relaxed text-sm">
              Your premium destination for high-quality office stationery, mixed media art supplies, and exclusive imported goods.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <a 
                href="https://www.instagram.com/variety_stationers_vasai_west?igsh=MThrenIzaXI0M2V0Zg==" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E60023] hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-pointer"
              >
                <Camera size={18} />
              </a>
              <a 
                href="https://m.youtube.com/@variety_stationery" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FF0000] hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-pointer"
              >
                <Play size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Shop Catalog", path: "/" },
                { name: "My Account", path: "/profile" },
                { name: "Track Order", path: "/orders" }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-gray-400 hover:text-[#E60023] transition-colors font-medium text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-[#E60023] transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Top Categories</h3>
            <ul className="space-y-3">
              {[
                { name: "Office Stationery", id: 1 },
                { name: "Mixed Media Art", id: 2 },
                { name: "Teakwood Furniture", id: 3 },
                { name: "Premium Gifts", id: 4 }
              ].map((cat, i) => (
                <li key={i}>
                  <Link to={`/category/${cat.id}`} className="text-gray-400 hover:text-[#E60023] transition-colors font-medium text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-[#E60023] transition-colors" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={18} className="text-[#E60023] shrink-0 mt-0.5" />
                <span className="leading-relaxed">Variety Stationers<br />Vasai West, Mumbai<br />Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={18} className="text-[#E60023] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={18} className="text-[#E60023] shrink-0" />
                <span>contact@varietymegamart.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="text-gray-500 text-xs font-medium">
            © {new Date().getFullYear()} Variety MegaMart. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-medium text-gray-500">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/return-policy" className="hover:text-white transition-colors">Return Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
