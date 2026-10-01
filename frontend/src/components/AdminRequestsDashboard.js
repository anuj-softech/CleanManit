import React, { useEffect, useState } from "react";
import axios from "axios";
import Api from "../api/Api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

function AdminRequestsDashboard() {
  const [requests, setRequests] = useState([]);
  const [scheduleMap, setScheduleMap] = useState({});
  const [editingSchedule, setEditingSchedule] = useState({});
  const [showRequests, setShowRequests] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [caretakerRequests, setCaretakerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supervisors, setSupervisors] = useState([]);


  const today = new Date().toISOString().split("T")[0];

  const getMinTime = (selectedDate) => {
    if (!selectedDate) return "08:00";

    // Agar selected date aaj hai
    if (selectedDate === today) {
      const now = new Date();

      let hours = now.getHours();
      let minutes = now.getMinutes();

      // Next minute se allow karo
      minutes += 1;
      if (minutes >= 60) {
        hours += 1;
        minutes = 0;
      }

      const currentTime = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;

      // Office timing se pehle ho to 08:00
      return currentTime < "08:00" ? "08:00" : currentTime;
    }

    // Future date
    return "08:00";
  };








  // ================= REQUESTS =================
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(Api.get_All_Emg_Req);

      console.log("RAW RESPONSE:", res.data);

      const data =
        res.data?.data ||
        res.data?.requests ||
        res.data ||
        [];

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("FETCH ERROR:", err);
      setRequests([]);
    }
    finally {

      setLoading(false);

    }
  };




  const fetchAllCaretakerRequests = async () => {

    try {



      const res = await axios.get(
        Api.get_All_Caretaker_Reqs
      );
      console.log("CARETAKER RESPONSE =>", res.data);

      const data =
        res.data?.data ||
        res.data?.requests ||
        res.data ||
        [];

      setCaretakerRequests(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.log(
        "CARETAKER FETCH ERROR",
        error
      );

      setCaretakerRequests([]);

    }


  };






  const allRequests = [
    ...requests,
    ...caretakerRequests
  ];


  console.log(
    "ALL REQUESTS =>",
    allRequests
  );
  // ================= FINAL SORT =================
  const filteredRequests = allRequests.filter((req) => {

    if (statusFilter === "All") {
      return req.status !== "Completed";
    }


    if (statusFilter === "Overdue") {
      return (
        req.isOverdue &&
        req.status !== "Completed"
      );
    }


    if (statusFilter === "Scheduled") {
      return (
        req.status === "Scheduled" &&
        !req.isOverdue
      );
    }


    return req.status === statusFilter;

  });


  useEffect(() => {
    fetchRequests();
    fetchAllCaretakerRequests();
  }, []);



  const handleSchedule = async (id) => {
    try {

      const data = scheduleMap[id];

      const selectedDate = data.date;
      const selectedTime = data.time;

      const now = new Date();

      const selectedDateTime = new Date(
        `${selectedDate}T${selectedTime}`
      );

      if (selectedDateTime <= now) {
        toast.warning("Please select the present time or a future time");
        return;
      }

      if (selectedTime < "08:00" || selectedTime > "18:00") {
        toast.warning("Time must be between 8:00 AM and 6:00 PM");
        return;
      }

      await axios.put(`${Api.update_Emg_Order}/${id}`,
        {
          scheduledDate: data.date,
          scheduledTime: data.time,
          status: "Scheduled",
        });

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id
            ? {
              ...req,
              scheduledDate: data.date,
              scheduledTime: data.time,
              status: "Scheduled",
              isOverdue: false,
            }
            : req
        )
      );

      setEditingSchedule((prev) => ({
        ...prev,
        [id]: false,
      }));

      setScheduleMap((prev) => ({
        ...prev,
        [id]: {},
      }));

      toast.success("Schedule updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Schedule failed");
    }
  };




  const overdueRequests = filteredRequests
    .filter(
      (req) =>
        req.isOverdue &&
        req.status !== "Completed"
    )
    .sort((a, b) => {
      const priorityRank = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      const priorityDiff =
        (priorityRank[a.priority] || 999) -
        (priorityRank[b.priority] || 999);

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return (
        new Date(a.createdAt) -
        new Date(b.createdAt)
      );
    });

  const sortByScheduleTime = (a, b) => {
    const dateA = a.scheduledDate
      ? new Date(
        `${a.scheduledDate}T${a.scheduledTime || "00:00"}`
      )
      : new Date(a.createdAt);

    const dateB = b.scheduledDate
      ? new Date(
        `${b.scheduledDate}T${b.scheduledTime || "00:00"}`
      )
      : new Date(b.createdAt);

    return dateA - dateB;
  };
  const highRequests = filteredRequests
    .filter(
      (req) =>
        req.priority === "High" &&
        (!req.isOverdue || req.status === "Completed")
    )
    .sort(sortByScheduleTime);

  const mediumRequests = filteredRequests
    .filter(
      (req) =>
        req.priority === "Medium" &&
        (!req.isOverdue || req.status === "Completed")
    )
    .sort(sortByScheduleTime);

  const lowRequests = filteredRequests
    .filter(
      (req) =>
        req.priority === "Low" &&
        (!req.isOverdue || req.status === "Completed")
    )
    .sort(sortByScheduleTime);
  const displayedRequests = [...filteredRequests].sort((a, b) => {

    if (a.isOverdue && !b.isOverdue)
      return -1;

    if (!a.isOverdue && b.isOverdue)
      return 1;

    const priorityRank = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    return (
      (priorityRank[a.priority] || 999) -
      (priorityRank[b.priority] || 999)
    );
  });


  const renderRequestCard = (req) => (
    <div
      key={req._id}
      className="bg-white rounded-2xl border border-[#d6ddd2] p-6 hover:shadow-lg transition m-8"
    >
      {/* TOP */}
      <div className="flex justify-between items-start">
        <div>
          {/* <p className="text-xs uppercase tracking-wider text-gray-500">
          Request #{req._id.slice(-5)}
        </p> */}

          <div className="flex items-center min-w-0">
            <p
              className="
      font-bold text-green-700
      truncate
      w-full
    "
              title={req.location?.locationName}
            >
              📍 {req.location?.locationName}
            </p>

          </div>

        </div>

        <span
          className={
            req.status === "Completed"
              ? "bg-green-500 text-white px-4 py-1 rounded-full"
              : req.status === "Scheduled"
                ? "bg-sky-500 text-white px-1 py-1 rounded-full"
                : req.status === "Pending"
                  ? "bg-yellow-500 text-black px-4 py-1 rounded-full"
                  : req.status === "Arrived"
                    ? "bg-orange-500 text-white px-4 py-1 rounded-full"
                    : "bg-gray-500 text-white px-4 py-1 rounded-full"
          }
        >
          {req.status}
        </span>

        {req.isOverdue &&
          req.status !== "Completed" && (
            <div className="mt-1">
              <span className="bg-red-600 text-white px-1 py-0 rounded-full text-xs font-bold ml-2">
                OVERDUE
              </span>
            </div>
          )}
      </div>

      {/* INFO */}
      <div className="mt-5 space-y-2">
        <p>
          <span className="font-semibold">
            Requested By:
          </span>{" "}
          {req.requestedBy?.role === "caretaker"
            ? "Caretaker"
            : req.requestedBy?.role === "supervisor"
              ? "Supervisor"
              : ""}
        </p>
        <p>
          <span className="font-semibold">Priority:</span>{" "}
          {req.priority}
        </p>

        <p className="text-sm text-gray-500 mt-4">
          Created:
          {new Date(req.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>

      {/* Timeline */}


      <div className="mt-4 space-y-2 border-t pt-3">
        {req.scheduledDate && (
          <p className="text-sm text-sky-700 font-medium">
            Scheduled:
            {" "}
            {new Date(req.scheduledDate).toLocaleDateString("en-IN")}
            {" | "}
            {req.scheduledTime}
          </p>
        )}

        {req.arrivedAt && (
          <p className="text-sm text-yellow-700 font-medium">
            Arrived:{" "}
            {new Date(req.arrivedAt).toLocaleString("en-IN")}
          </p>
        )}

        {req.completedAt && (
          <p className="text-sm text-green-700 font-medium">
            Completed:{" "}
            {new Date(req.completedAt).toLocaleString("en-IN")}
          </p>
        )}
      </div>
      {req.status === "Pending" &&
        req.status !== "Completed" &&
        !editingSchedule[req._id] && (
          <button
            onClick={() =>
              setEditingSchedule((prev) => ({
                ...prev,
                [req._id]: true,
              }))
            }
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-xl font-semibold"
          >
            Schedule Pickup
          </button>
        )}

      {req.status !== "Completed" &&
        (req.status === "Scheduled" ||
          req.isOverdue) &&
        !editingSchedule[req._id] && (

          <button
            onClick={() =>
              setEditingSchedule((prev) => ({
                ...prev,
                [req._id]: true
              }))
            }
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded-xl font-semibold mt-2"
          >
            {
              req.isOverdue
                ?
                "Reschedule Task"
                :
                "Update Schedule"
            }

          </button>

        )}

      {req.status !== "Completed" &&
        editingSchedule[req._id] && (
          <div className="space-y-3 mt-3">
            <label >Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-lg p-2"
              value={scheduleMap[req._id]?.date || ""}
              onChange={(e) =>
                setScheduleMap((prev) => ({
                  ...prev,
                  [req._id]: {
                    ...prev[req._id],
                    date: e.target.value,
                  },
                }))
              }
            />
            <label >Time</label>
            <input
              type="time"
              min={getMinTime(scheduleMap[req._id]?.date)}
              max="18:00"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={scheduleMap[req._id]?.time || ""}
              onChange={(e) =>
                setScheduleMap((prev) => ({
                  ...prev,
                  [req._id]: {
                    ...prev[req._id],
                    time: e.target.value,
                  },
                }))
              }
            />

            <button
              onClick={() => handleSchedule(req._id)}
              className="w-full bg-green-900 hover:bg-green-800 text-white py-2 rounded-xl font-semibold"
            >
              {req.status === "Scheduled"
                ? "Save Update"
                : "Schedule"}
            </button>

            <button
              onClick={() =>
                setEditingSchedule((prev) => ({
                  ...prev,
                  [req._id]: false,
                }))
              }
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
    </div>
  );

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#4CBB17]/20">
      {/* HEADER */}
      <div className="bg-[#4CBB17]/40 px-4 md:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="text-center md:text-left cursor-pointer hover:opacity-90 transition block" title="Go to Home">
            <h1 className="flex items-center justify-center md:justify-start gap-2 md:gap-3 text-2xl sm:text-3xl md:text-5xl font-extrabold text-green-900">
              <img
                src="/garbageVehicle.jpeg"
                alt="logo"
                className="w-10 h-10 md:w-16 md:h-16 object-contain"
              />
              CleanTrack
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-gray-800 mt-1">
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


      {/* REQUESTS */}

      {showRequests && (
        <div className="px-3 sm:px-6 lg:px-8 pb-8 p-4">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-green-900">
                Active Requests
              </h2>

              <p className="text-gray-500 text-sm">
                Pickup Scheduling & Monitoring
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-52 border border-gray-300 rounded-lg px-4 py-2 bg-white"
              >
                <option value="All">All Active</option>
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>

              <div className="bg-white border border-[#d6ddd2] rounded-xl px-4 py-3 text-center">
                <span className="font-semibold">Total Requests:</span>{" "}
                {filteredRequests.length}
              </div>

            </div>
          </div>

          {
            loading ?

              (
                <div className="
bg-white
rounded-2xl
border
border-[#d6ddd2]
p-8
text-center
font-bold
text-green-700
">

                  Loading Requests...

                </div>
              )


              :


              displayedRequests.length === 0 ?

                (
                  <div className="
bg-white
rounded-2xl
border
border-[#d6ddd2]
p-8
text-center
font-bold
text-red-600
">

                    No Requests Found

                  </div>
                )


                :

                (
                  <div>

                    {/* OVERDUE */}
                    {(statusFilter === "All" || statusFilter === "Overdue") &&
                      overdueRequests.length > 0 && (
                        <>
                          <hr className="my-8" />

                          <div className="flex justify-center mb-6">
                            <div className="w-full max-w-sm text-center py-3 rounded-xl bg-red-50 border border-red-300 text-red-700 font-bold text-base sm:text-lg">
                              Overdue Requests
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                            {overdueRequests.map(renderRequestCard)}
                          </div>

                          <hr className="my-8" />
                        </>
                      )}

                    {/* HIGH */}
                    {statusFilter !== "Overdue" && highRequests.length > 0 && (
                      <>
                        <div className="flex justify-center mb-6">
                          <div className="w-full max-w-sm text-center py-3 rounded-xl bg-red-50 border border-red-300 text-red-700 font-bold text-base sm:text-lg">
                            🔴 High Priority Requests
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                          {highRequests.map(renderRequestCard)}
                        </div>

                        <hr className="my-8" />
                      </>
                    )}

                    {/* MEDIUM */}
                    {statusFilter !== "Overdue" && mediumRequests.length > 0 && (
                      <>
                        <div className="flex justify-center mt-8 mb-6">
                          <div className="w-full max-w-sm text-center py-3 rounded-xl bg-orange-50 border border-orange-300 text-orange-700 font-bold text-base sm:text-lg">
                            🟠 Medium Priority Requests
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                          {mediumRequests.map(renderRequestCard)}
                        </div>

                        <hr className="my-8" />
                      </>
                    )}

                    {/* LOW */}
                    {statusFilter !== "Overdue" && lowRequests.length > 0 && (
                      <>
                        <div className="flex justify-center mt-8 mb-6">
                          <div className="w-full max-w-sm text-center py-3 rounded-xl bg-yellow-50 border border-yellow-300 text-yellow-700 font-bold text-base sm:text-lg">
                            🟡 Low Priority Requests
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                          {lowRequests.map(renderRequestCard)}
                        </div>

                        <hr className="my-8" />
                      </>
                    )}

                  </div>
                )}
        </div>
      )}
    </div>
  );
}

export default AdminRequestsDashboard;