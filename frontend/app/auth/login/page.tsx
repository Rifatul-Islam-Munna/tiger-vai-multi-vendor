"use client"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <div className="w-12 h-12 bg-[#e23636] rounded-lg flex items-center justify-center">
          <span className="text-xl">🏪</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">Company Logo</p>
      </div>

      <Card className="w-full max-w-md border-2 border-gray-200">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-center text-sm mb-8">Log in to your account</p>

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Email or Phone Number</label>
              <Input
                type="text"
                placeholder="Enter your Email or Phone Number"
                className="border-2 border-gray-200 h-11"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="border-2 border-gray-200 h-11 pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Button variant="link" className="text-[#e23636] p-0 h-auto font-medium">
                Forgot Password?
              </Button>
            </div>

            {/* Login Button */}
            <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white h-12 font-semibold">Login</Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-600">OR</span>
              </div>
            </div>

            {/* Social Login */}
            <Button variant="outline" className="w-full border-2 border-gray-300 h-11 bg-transparent">
              <span className="mr-2">🔍</span>
              Login with Google
            </Button>

            <Button variant="outline" className="w-full border-2 border-gray-300 h-11 bg-transparent">
              <span className="mr-2">f</span>
              Login with Facebook
            </Button>

            {/* Sign Up */}
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <Button variant="link" className="text-[#e23636] p-0 h-auto font-semibold">
                Sign Up
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-gray-600 text-sm space-x-4">
        <Button variant="link" className="text-gray-600 p-0 h-auto">
          Terms of Service
        </Button>
        <Button variant="link" className="text-gray-600 p-0 h-auto">
          Privacy Policy
        </Button>
      </div>
    </div>
  )
}
