"use client";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, ShoppingBag, Twitter } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";

const Footer = () => {
  const pathName = usePathname();

  return (
    <footer
      id="FOOTER"
      className={cn("bg-palette-text text-gray-300 pt-16 pb-8", {
        hidden: pathName.includes("/admin") || pathName.includes("/user"),
      })}
    >
      <div className=" container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={"/logo-black.avif"}
                width={200}
                height={100}
                alt="logo"
              />
            </div>
            <p className="text-sm mb-4">
              Bangladesh's most trusted multi-vendor e-commerce platform. Shop
              with confidence from thousands of verified sellers.
            </p>
            <div className="flex gap-3">
              <button className="w-9 h-9 bg-gray-700 hover:bg-palette-btn rounded-full flex items-center justify-center transition">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 bg-gray-700 hover:bg-palette-btn rounded-full flex items-center justify-center transition">
                <Instagram className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 bg-gray-700 hover:bg-palette-btn rounded-full flex items-center justify-center transition">
                <Twitter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  How to Buy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  Track Your Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-white font-semibold mb-4">About Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  About MarketHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  Vendor Login
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Payment & Delivery */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Payment & Delivery
            </h3>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  Payment Methods
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  Cash on Delivery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-palette-btn transition">
                  Delivery Info
                </a>
              </li>
            </ul>
            <div className="text-sm pt-4 border-t border-gray-700">
              <p className="text-white font-semibold mb-1">Customer Service</p>
              <p className="text-palette-btn text-lg font-bold">
                +880 1234-567890
              </p>
              <p className="text-xs text-gray-400">Available 24/7</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>
            © 2025 MarketHub. All Rights Reserved. | Built for Bangladesh with
            ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
