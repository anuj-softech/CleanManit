import React, { useState } from "react";
import axios from "axios";
import Api from "../api/Api";
import { toast } from "react-toastify";

export default function LogoutButton({ className = "" }) {
  const [showModal, setShowModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await axios.post(Api.logout);
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      // Clear client state
      localStorage.removeItem("role");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      toast.success("Logged out successfully");

      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={
          className ||
          "flex items-center gap-2 bg-red-600/90 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl shadow transition duration-200 hover:scale-105 active:scale-95 text-sm md:text-base cursor-pointer"
        }
        title="Log out of account"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>
        <span>Logout</span>
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => !loggingOut && setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full p-6 sm:p-7 relative border border-gray-100 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Icon Badge */}
            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </div>

            {/* Modal Heading & Text */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-sm sm:text-base text-center mt-2 mb-6">
              Are you sure you want to end your current session? You will need your email OTP to log in again.
            </p>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold transition duration-150 text-sm sm:text-base cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogout}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition duration-150 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                {loggingOut ? (
                  <span>Logging out...</span>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
                      />
                    </svg>
                    <span>Yes, Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
