import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Api from "../api/Api";
import { toast } from "react-toastify";
import LogoutButton from "./LogoutButton";

function Admin() {
  const [users, setUsers] = useState([])
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);




  // ================= USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(Api.get_All_User);

      setUsers(res.data || []);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${Api.delete_User}/${id}`);

      toast.success("User deleted successfully");

      // UI update without reload
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to delete user"
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  return (
    <div className="min-h-screen bg-[#4CBB17]/20">

      <div >

        {/* HEADER */}
        <div className="mb-8 bg-[#4CBB17]/40 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="cursor-pointer hover:opacity-90 transition block" title="Go to Home">
              <h1 className="flex items-center gap-2 md:gap-3 text-3xl md:text-5xl font-extrabold text-green-900">
                <img
                  src="/garbageVehicle.jpeg"
                  alt="CleanTrack"
                  className="w-10 h-10 md:w-16 md:h-16 object-contain"
                />
                CleanTrack
              </h1>

              <p className="text-gray-900 text-xs md:text-base mt-1">
                Smart Waste Management Control Center
              </p>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-3xl font-bold"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-lg font-semibold">

              <Link
                to="/create-account"
                className="text-green-900 hover:scale-105 transition"
              >
                Create User
              </Link>

              <Link
                to="/see-all-req-admin"
                className="text-green-900 hover:scale-105 transition"
              >
                View Requests
              </Link>

              <Link
                to="/create-location"
                className="text-green-900 hover:scale-105 transition"
              >
                Create Locations
              </Link>

              <Link
                to="/see-all-locations"
                className="text-green-900 hover:scale-105 transition"
              >
                ALL Locations
              </Link>

              <Link
                to="/assign-location"
                className="text-green-900 hover:scale-105 transition"
              >
                Assign Zone
              </Link>

              <Link
                to="/days-report"
                className="text-green-900 hover:scale-105 transition"
              >
                Days Report
              </Link>

              <LogoutButton />

            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-4 text-green-900 font-semibold">

              <Link
                to="/create-account"
                onClick={() => setMenuOpen(false)}
              >
                Create User
              </Link>

              <Link
                to="/see-all-req-admin"
                onClick={() => setMenuOpen(false)}
              >
                View Requests
              </Link>

              <Link
                to="/create-location"
                onClick={() => setMenuOpen(false)}
              >
                Create Locations
              </Link>

              <Link
                to="/see-all-locations"
                onClick={() => setMenuOpen(false)}
              >
                ALL Locations
              </Link>

              <Link
                to="/assign-location"
                onClick={() => setMenuOpen(false)}
              >
                Assign Zone
              </Link>

              <Link
                to="/days-report"
                onClick={() => setMenuOpen(false)}
              >
                Days Report
              </Link>

              <div className="pt-2 border-t border-green-800/20">
                <LogoutButton />
              </div>

            </div>
          )}
        </div>

        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-black-900">
            Admin Dashboard
          </h1>
        </div>

        {/* USERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#d6ddd2] p-6 mb-8 m-8">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold text-green-900">
              User Management
            </h2>

            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              {users.length} Users
            </span>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="bg-green-900 text-white">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Mobile</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-10 text-lg font-semibold text-green-700 animate-pulse"
                    >
                      Loading Users...
                    </td>
                  </tr>

                ) : users.length === 0 ? (

                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-10 text-red-600 font-semibold"
                    >
                      No Users Found
                    </td>
                  </tr>

                ) : (

                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b hover:bg-green-50 transition"
                    >
                      <td className="p-4 font-medium">
                        {user.name}
                      </td>

                      <td className="p-4">
                        {user.mobile}
                      </td>

                      <td className="p-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Admin







