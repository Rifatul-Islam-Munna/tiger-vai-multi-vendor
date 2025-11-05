// app/account/page.tsx
"use client";

import { useState } from "react";
import { Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface UserData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
}

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "Masud Rana",
    email: "masud@email.com",
    phone: "+880 1712345679",
    address: "House 123, Road 4, Block B, Bashundhara R/A, Dhaka-1229",
    dateOfBirth: "1995-01-15",
    gender: "Male",
  });

  const [editData, setEditData] = useState<UserData>(userData);

  const handleEditChange = (field: keyof UserData, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
    console.log("Updated user data:", editData);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 w-full container mx-auto px-5 md:px-0 ">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mt-11">
        <div>
          <h2 className="text-3xl font-bold text-palette-text">
            Account Information
          </h2>
          <p className="text-palette-text/60 text-sm mt-2">
            Manage your account details and personal settings.
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-palette-btn hover:bg-palette-btn/90 text-white gap-2 whitespace-nowrap"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Account Details Card */}
      <Card className="border border-palette-accent-2/30 shadow-none">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* First Row - Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-palette-btn mb-3 block">
                  Full Name
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                    className="border-2 border-palette-accent-3/30 h-11 rounded-lg"
                  />
                ) : (
                  <p className="text-palette-text font-medium text-base">
                    {userData.name}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-palette-btn mb-3 block">
                  Email Address
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                    className="border-2 border-palette-accent-3/30 h-11 rounded-lg"
                  />
                ) : (
                  <p className="text-palette-text font-medium text-base">
                    {userData.email}
                  </p>
                )}
              </div>
            </div>

            {/* Second Row - Phone & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-palette-btn mb-3 block">
                  Phone Number
                </label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleEditChange("phone", e.target.value)}
                    className="border-2 border-palette-accent-3/30 h-11 rounded-lg"
                  />
                ) : (
                  <p className="text-palette-text font-medium text-base">
                    {userData.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-palette-btn mb-3 block">
                  Address
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.address || ""}
                    onChange={(e) =>
                      handleEditChange("address", e.target.value)
                    }
                    className="border-2 border-palette-accent-3/30 h-11 rounded-lg"
                  />
                ) : (
                  <p className="text-palette-text font-medium text-base">
                    {userData.address || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Third Row - Date of Birth & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-palette-btn mb-3 block">
                  Date of Birth
                </label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editData.dateOfBirth}
                    onChange={(e) =>
                      handleEditChange("dateOfBirth", e.target.value)
                    }
                    className="border-2 border-palette-accent-3/30 h-11 rounded-lg"
                  />
                ) : (
                  <p className="text-palette-text font-medium text-base">
                    {userData.dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-palette-btn mb-3 block">
                  Gender
                </label>
                {isEditing ? (
                  <select
                    value={editData.gender}
                    onChange={(e) => handleEditChange("gender", e.target.value)}
                    className="w-full border-2 border-palette-accent-3/30 rounded-lg h-11 px-4 text-palette-text font-medium"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                ) : (
                  <p className="text-palette-text font-medium text-base">
                    {userData.gender}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 mt-8 pt-8 border-t-2 border-palette-accent-2/30">
              <Button
                onClick={handleSave}
                className="flex-1 bg-palette-btn hover:bg-palette-btn/90 text-white gap-2 h-11 font-semibold rounded-lg transition"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 border-2 border-palette-accent-3/30 text-palette-text hover:bg-palette-bg h-11 font-semibold rounded-lg transition"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
