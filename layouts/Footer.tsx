import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SiteConfig } from "../types";

interface FooterProps {
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  const location = useLocation();

  return (
    <footer className="bg-stone-950 text-stone-400 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-white text-3xl font-black mb-8 tracking-tighter">
            MAHALAKK{" "}
            <span
              className="text-amber-600"
              style={{ color: config.accentColor }}
            >
              CONSULTANT
            </span>
          </h3>

          <p className="text-sm leading-loose mb-10 font-medium">
            Premium architectural solutions bridging engineering precision with
            ancient energetic harmony.
          </p>

          <div className="flex gap-5">
            <a
              href="#"
              className="w-12 h-12 rounded-2xl border border-stone-800 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all"
            >
              <i className="fa-brands fa-instagram text-lg"></i>
            </a>

            <a
              href="#"
              className="w-12 h-12 rounded-2xl border border-stone-800 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all"
            >
              <i className="fa-brands fa-youtube text-lg"></i>
            </a>

            <a
              href="#"
              className="w-12 h-12 rounded-2xl border border-stone-800 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all"
            >
              <i className="fa-brands fa-linkedin-in text-lg"></i>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-black mb-10 text-[10px] uppercase tracking-[0.4em]">
            The Studio
          </h4>

          <ul className="space-y-6 text-xs font-bold uppercase tracking-widest">
            <li>
              <Link
                to="/about"
                className="hover:text-amber-500 transition-colors"
              >
                Our Vision
              </Link>
            </li>

            <li>
              <Link
                to="/portfolio"
                className="hover:text-amber-500 transition-colors"
              >
                Project Portfolio
              </Link>
            </li>

            <li>
              <Link
                to="/shop"
                className="hover:text-amber-500 transition-colors"
              >
                Vastu Shop
              </Link>
            </li>

            <li>
              <Link
                to="/blog"
                className="hover:text-amber-500 transition-colors"
              >
                Research & Journals
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black mb-10 text-[10px] uppercase tracking-[0.4em]">
            Head Office
          </h4>

          <div
            className="space-y-6 text-sm leading-loose mb-10 font-medium"
            dangerouslySetInnerHTML={{ __html: config.address }}
          />

          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-amber-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all shadow-2xl shadow-amber-900/40"
            style={{ backgroundColor: config.accentColor }}
          >
            Studio Inquiry &raquo;
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-32 pt-12 border-t border-stone-900">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-stone-600 font-black uppercase tracking-[0.3em]">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p>
              &copy; {new Date().getFullYear()} Mahalak Consultants. All rights
              reserved.
            </p>

            <p>Website Design by MAHALAK TECHNOLOGIES</p>
          </div>

          <div className="flex gap-12">
            <Link to="/login" className="hover:text-amber-500">
              Client Hub
            </Link>

            <Link
              to="/admin"
              className="opacity-40 hover:opacity-100 flex items-center gap-2"
            >
              <i className="fa-solid fa-lock"></i>
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;