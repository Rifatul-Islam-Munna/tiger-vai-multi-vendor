"use client";

import { useState } from "react";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("account");

  const menuItems = [
    { id: "account", label: "Account Information", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "My Addresses", icon: MapPin },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "help", label: "Help & Support", icon: HelpCircle },
  ];

  const addresses = [
    {
      id: 1,
      type: "Home Address",
      label: "Default",
      address:
        "House 123, Road 4, Block B, Bashundhara R/A, Dhaka-1229, Bangladesh",
    },
    {
      id: 2,
      type: "Office Address",
      address: "ABC Tower, Level 5, Gulshan-1, Dhaka-1212, Bangladesh",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* SIDEBAR */}
          <div className="md:col-span-1">
            <Card className="border-0 overflow-hidden">
              <CardContent className="p-0">
                {/* User Profile */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#e23636] rounded-full flex items-center justify-center text-white text-xl font-bold">
                      MR
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Masud Rana
                      </h3>
                      <p className="text-xs text-gray-600">masud@email.com</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                          activeTab === item.id
                            ? "bg-red-50 text-[#e23636] border-r-4 border-[#e23636]"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>

                {/* Logout */}
                <div className="border-t border-gray-200 p-4">
                  <button className="w-full flex items-center gap-3 text-sm font-medium text-[#e23636] hover:underline">
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MAIN CONTENT */}
          <div className="md:col-span-3">
            {activeTab === "account" && (
              <Card className="border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Account Information
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Manage your account details and personal settings.
                      </p>
                    </div>
                    <Button className="bg-[#e23636] hover:bg-red-700 text-white">
                      Edit Profile
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Account Details */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-[#e23636]">
                            Full Name
                          </label>
                          <p className="text-gray-900 font-medium mt-2">
                            Masud Rana
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#e23636]">
                            Email Address
                          </label>
                          <p className="text-gray-900 font-medium mt-2">
                            m••••@email.com
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#e23636]">
                            Phone Number
                          </label>
                          <p className="text-gray-900 font-medium mt-2">
                            +880 17•••••••9
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <label className="text-sm font-medium text-[#e23636]">
                            Password
                          </label>
                          <p className="text-gray-900 font-medium mt-2">
                            ••••••••
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="text-[#e23636] border-[#e23636] hover:bg-red-50 bg-transparent"
                        >
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        My Addresses
                      </h3>
                      <Button className="bg-[#e23636] hover:bg-red-700 text-white">
                        Add New Address
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <Card
                          key={addr.id}
                          className="border-2 border-gray-200"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {addr.type}
                                </h4>
                                {addr.label && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block mt-1">
                                    {addr.label}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                              {addr.address}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="text-[#e23636] border-[#e23636] flex-1 text-sm h-8 bg-transparent"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="border-gray-300 flex-1 text-sm h-8 bg-transparent"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
