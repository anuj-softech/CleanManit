import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Api from "../api/Api";
import { toast } from "react-toastify";
import LogoutButton from "./LogoutButton";

function LocationCreatedashboard() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    locationName: "",
    zone: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const loadLocation = async () => {
      if (!id) return;

      try {
        const res = await axios.get(`${Api.get_Single_Location}/${encodeURIComponent(id)}`);
        setFormData(res.data?.location);
      } catch (error) {
        toast.error("Failed to load location");
      }
    };

    loadLocation();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //   const handleCreateLocation = async (e) => {
  //     e.preventDefault();

  //     try {
  //       await axios.post(
  //         Api.create_Location,
  //          {
  //         ...formData,
  //         latitude: Number(formData.latitude),
  //         longitude: Number(formData.longitude),
  //       }
  //       );

  //       alert("Location Created Successfully");

  //       setFormData({
  //         locationName: "",
  //         zone: "",
  //         latitude: "",
  //         longitude: "",
  //       });

  //     } catch (error) {
  //   console.log(
  //     "BACKEND ERROR =>",
  //     error.response?.data
  //   );
  // }
  //   };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (id) {
        // UPDATE
        res = await axios.put(
          `${Api.update_Locations}/${id}`,
          {
            ...formData,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
          }
        );

        toast.success(res.data.message || "Location updated successfully");
        navigate("/see-all-locations");
      } else {
        // CREATE
        res = await axios.post(
          Api.create_Location,
          {
            ...formData,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
          }
        );

        toast.success(res.data.message || "Location created successfully");

        setFormData({
          locationName: "",
          zone: "",
          latitude: "",
          longitude: "",
        });
      }
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        (id ? "Failed to update location" : "Failed to create location")
      );
    };
  }
  return (
    <div className="min-h-screen bg-[#4CBB17]/20">

      {/* Header */}
      <div className="bg-[#4CBB17]/40 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="cursor-pointer hover:opacity-90 transition block" title="Go to Home">
            <h1 className="flex items-center gap-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-900">
              <img
                src="/garbageVehicle.jpeg"
                alt="CleanTrack"
                className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
              />
              CleanTrack
            </h1>

            <p className="text-gray-800 mt-2 text-sm sm:text-base">
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
      </div>

      {/* Page Title */}
      {/* Heading */}
      <div className="text-center mt-8 px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900">
          {id ? "Update Location" : "Create New Location"}
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mt-2">
          {id
            ? "Update Waste Collection Location"
            : "Add New Waste Collection Location"}
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6">

        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg p-5 sm:p-6 lg:p-8 border border-green-100">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Location Name */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                Location Name
              </label>

              <input
                type="text"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                placeholder="Enter Location Name"
                className="w-full border border-gray-300 rounded-xl p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Zone */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                Select Zone
              </label>

              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm sm:text-base"
                required
              >
                <option value="">Select Zone</option>
                <option value="Hostel Zone 1">Hostel Zone 1</option>
                <option value="Hostel Zone 2">Hostel Zone 2</option>
                <option value="Academic Zone">Academic Zone</option>
                <option value="Colony Zone">Colony Zone</option>
              </select>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm sm:text-base"
                  required
                />
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-900 hover:bg-green-800 text-white py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition"
            >
              {id ? "Update Location" : "Create Location"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default LocationCreatedashboard;