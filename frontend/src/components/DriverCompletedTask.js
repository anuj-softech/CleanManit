import { useEffect, useState } from "react";
import axios from "axios";
import Api from "../api/Api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function DriverCompletedTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      const res = await axios.get(Api.completed_Task);
      console.log(res.data)
      if (res.data.success) {
        setTasks(res.data.data);
      } else {
        toast.error("Failed to load completed tasks");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch completed tasks");
    }
  };

  return (
    <>
      <div className="bg-[#4CBB17]/40 px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition" title="Go to Home">
          <img
            src="/garbageVehicle.jpeg"
            alt="CleanTrack Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain"
          />

          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-900">
              CleanTrack
            </h1>

            <p className="text-sm sm:text-base text-gray-900 mt-1">
              Smart Waste Management Control Center
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/driver-dashboard"
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-xl transition shadow text-sm sm:text-base"
          >
            Driver Dashboard
          </Link>
          <LogoutButton />
        </div>
      </div>
      <div className="min-h-screen bg-[#4CBB17]/20 p-8 ">
        <h1 className="text-4xl font-bold text-green-900 mb-8 text-center">
          Completed Tasks
        </h1>

        {tasks.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            No Completed Tasks Found
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white border rounded-2xl p-5 hover:shadow-lg transition"
              >
                <p className="text-xs text-gray-500 flex justify-between">
                  {/* <span>
              REQUEST #{task._id.slice(-4)}
              </span> */}


                </p>

                <h3 className="text-xl font-semibold text-green-800 flex justify-between mt-1 ">
                  <span>
                    📍 {task.location.locationName}
                  </span>
                  <span className="bg-green-500 text-white px-3 py-0 rounded-full ml-2">
                    Completed
                  </span>
                </h3>

                <div className=" items-center mt-4">
                  <span className="font-medium">
                    Priority: {task.priority}
                  </span>


                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Created:{" "}
                  {task.createdAt &&
                    new Date(task.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                </p>

                {task.scheduledDate && (
                  <p className="text-sm text-sky-700 mt-2 font-medium">
                    Scheduled:{" "}
                    {new Date(task.scheduledDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                    {" | "}
                    {task.scheduledTime}
                  </p>
                )}

                {task.arrivedAt && (
                  <p className="text-sm text-orange-700 mt-2 font-medium">
                    Arrived:{" "}
                    {new Date(task.arrivedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                )}

                {task.completedAt && (
                  <p className="text-sm text-green-700 mt-2 font-medium">
                    Completed:{" "}
                    {new Date(task.completedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>

  );
}