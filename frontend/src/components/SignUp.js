import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Api from "../api/Api";
import { toast } from "react-toastify";
import LogoutButton from "./LogoutButton";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "",
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(Api.create_user, formData);

      toast.success(
        res.data?.message || "Account Created Successfully"
      );

      //  reset form fields
      setFormData({
        name: "",
        mobile: "",
        email: "",
        role: ""
        // jo bhi fields hain yahan add karo
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to create account"
      );

      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#4CBB17]/20">

      {/* Header */}
      <div className="bg-[#4CBB17]/40 px-4 py-4 sm:px-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="cursor-pointer hover:opacity-90 transition block" title="Go to Home">
          <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-extrabold text-green-900">
            <img
              src="/garbageVehicle.jpeg"
              alt="CleanTrack Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            />
            CleanTrack
          </h1>

          <p className="text-gray-800 mt-1 text-sm sm:text-base">
            Smart Waste Management Control Center
          </p>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="bg-green-800 hover:bg-green-900 text-white font-semibold px-4 py-2 rounded-xl transition shadow text-sm sm:text-base"
          >
            Admin Dashboard
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Signup Card */}
      <div className="flex items-center justify-center py-10 px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl">

          <h2 className="text-3xl font-bold text-center text-green-800">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Register a new user
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Username
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter Username"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mobile Number
              </label>

              <input
                type="tel"
                name="mobile"
                placeholder="Enter Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">
                  Select Role
                </option>

                <option value="supervisor">
                  Supervisor
                </option>

                <option value="driver">
                  Driver
                </option>

                <option value="caretaker">
                  CareTaker
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;



