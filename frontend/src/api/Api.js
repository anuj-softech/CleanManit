import axios from "axios";
import { toast } from "react-toastify";

// Enable automatic cookie transmission for all axios requests
axios.defaults.withCredentials = true;

const hostname = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
const base_url = process.env.REACT_APP_API_BASE_URL || `http://${hostname}:5000/api/`;

let isHandlingUnauthorized = false;

// Global Response Interceptor: Catches any 401 or 403 response
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLogoutCall = error.config?.url?.includes("auth/logout");
    const isAuthCheck = error.config?.url?.includes("auth/me");

    if ((status === 401 || status === 403) && !isLogoutCall && !isAuthCheck) {
      if (!isHandlingUnauthorized) {
        isHandlingUnauthorized = true;

        // Clear stored credentials
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        localStorage.removeItem("token");

        // Notify user
        toast.error("Unauthorized. Please login again.");

        // Clear server cookie
        axios.post(`${base_url}auth/logout`).catch(() => {});

        // Redirect to homescreen
        setTimeout(() => {
          isHandlingUnauthorized = false;
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        }, 1200);
      }
    }

    return Promise.reject(error);
  }
);

const Api = {
  create_user: base_url + "user/create-user",
  send_otp: base_url + "auth/send-otp",
  verify_otp: base_url + "auth/verify-email-otp",
  logout: base_url + "auth/logout",
  get_me: base_url + "auth/me",
  get_All_User: base_url + "user/all-users",
  create_Emg_Req: base_url + "emergency/create",
  get_All_Emg_Req: base_url + "emergency/getAllEmgReq",
  update_Emg_Order: base_url + "emergency/schedule-req",
  get_All_Locations: base_url + "location/all",
  get_My_Emg_Req: base_url + "emergency/my-requests",
  get_Todays_Task: base_url + "driver/today-task",
  arrived_At_Task: base_url + "driver/arrived",
  completed_Task: base_url + "driver/completed",
  create_Location: base_url + "location/create",
  assign_Zone: base_url + "supervisor/assign-zone",
  get_Supervisor_Locations: base_url + "supervisor/getsupervisor-location",
  get_Locations_By_Zone: base_url + "location/get-location-by-zone",
  delete_User: base_url + "user/delete-user",
  update_Locations: base_url + "location/update",
  delete_Locations: base_url + "location/delete",
  get_Single_Location: base_url + "location/single",
  caretaker_Assign_Hostel: base_url + "caretaker/caretaker-assign-hostel",
  get_Caretaker_Reqs: base_url + "caretaker/caretaker-req",
  get_All_Caretakers: base_url + "caretaker/all-caretakers",
  update_Caretaker_Hostel: base_url + "caretaker/caretaker-update-hostel",
  get_Caretaker_Hostel: base_url + "caretaker/caretaker-hostel",
  create_Caretaker_Request: base_url + "caretaker/create-caretaker-request",
  get_Zone_Caretaker_Reqs: base_url + "emergency/zone-caretaker-requests"
};

export default Api;