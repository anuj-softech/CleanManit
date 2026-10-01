import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Api from "../api/Api";
import { toast } from "react-toastify";
import LogoutButton from "./LogoutButton";

export default function DriverRoute() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);

  const [isNearLocation, setIsNearLocation] = useState(false);
  const [distance, setDistance] = useState(null);


  const getTask = useCallback(async () => {
    try {
      const res = await axios.get(Api.get_Todays_Task);

      const found = res.data.requests.find(
        (item) => item._id === id
      );

      setTask(found);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    getTask();
  }, [getTask]);

  const markArrived = async () => {

    if (!isNearLocation) {
      return toast.warning(
        "You must be near destination"
      );
    }

    try {

      const res = await axios.put(
        `${Api.arrived_At_Task}/${id}`
      );


      console.log("ARRIVED RESPONSE", res.data);


      setTask(prev => ({
        ...prev,
        status: "Arrived",
        arrivedAt: new Date()
      }));


      toast.success("Driver Arrived");


    } catch (error) {

      console.log(error);

    }
  };
  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    const R = 6371e3;

    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;

    const Δφ =
      ((lat2 - lat1) * Math.PI) / 180;

    const Δλ =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) *
      Math.sin(Δφ / 2) +
      Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    const watchId =
      navigator.geolocation.watchPosition(
        (position) => {
          setDriverLocation({
            latitude:
              position.coords.latitude,
            longitude:
              position.coords.longitude,
          });
        },
        (error) => {
          console.log(error);

          toast.error(
            "Location access required. Please allow GPS permission."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, []);



  useEffect(() => {
    if (
      !driverLocation ||
      !task?.location?.latitude ||
      !task?.location?.longitude
    )
      return;

    const distance = calculateDistance(
      driverLocation.latitude,
      driverLocation.longitude,
      Number(task.location.latitude),
      Number(task.location.longitude)
    );

    console.log(
      "Distance:",
      distance,
      "meters"
    );

    setDistance(distance);
    setIsNearLocation(distance <= 100);
  }, [driverLocation, task]);

  const markCompleted = async () => {
    if (!isNearLocation) {
      return toast.warning(
        "You must be near the destination location."
      );
    }

    try {
      const res = await axios.put(
        `${Api.completed_Task}/${id}`,
        {
          latitude: driverLocation?.latitude,
          longitude: driverLocation?.longitude,
        }
      );

      setTask(res.data.data);

      setTimeout(() => {
        navigate("/driver-dashboard");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  if (!task) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-bold">
        Loading...
      </div>
    );
  }






  return (
    <div className="min-h-screen bg-[#4CBB17]/20">

      {/* Header */}
      <div className="bg-[#4CBB17]/40 px-4 py-3 sm:px-8 shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="cursor-pointer hover:opacity-90 transition block" title="Go to Home">
          <h1 className="flex items-center gap-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-900">
            <img
              src="/garbageVehicle.jpeg"
              alt="CleanTrack"
              className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
            />
            CleanTrack
          </h1>

          <p className="text-gray-900 text-xs sm:text-sm md:text-base mt-1">
            Smart Waste Management Control Center
          </p>
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

      {/* Live Tracking Banner */}
      <div className="bg-green-700 text-white py-4 shadow-lg">
        <h1 className="text-center text-3xl font-bold">
          Live Route Tracking
        </h1>
      </div>




      {/* Route Details */}
      <div className="max-w-5xl mx-auto px-4 mt-6">

        <div className="bg-white rounded-2xl shadow-lg p-5 mb-5">

          <h2 className="text-2xl font-bold text-green-900 mb-4">
            Route Details
          </h2>

          <div className="space-y-3">

            <p className="text-lg font-semibold">
              Start Location:
              <span className="text-green-800 ml-2">
                MANIT Bhopal
              </span>
            </p>

            <p className="text-lg font-semibold">
              Destination:
              <span className="text-green-800 ml-2">
                {task.location?.locationName}
              </span>
            </p>
            {driverLocation && (
              <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                <p className="text-sm">
                  Driver Latitude: {driverLocation.latitude}
                </p>

                <p className="text-sm">
                  Driver Longitude: {driverLocation.longitude}
                </p>

                {distance !== null && (
                  <p className="text-sm font-semibold text-blue-700">
                    Distance from destination:
                    {Math.round(distance)} meters
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <iframe
            title="Google Route"
            width="100%"
            height="280"
            className="border-0"
            loading="lazy"
            src={`https://maps.google.com/maps?saddr=23.2167,77.4061&daddr=${task.location?.latitude},${task.location?.longitude}&output=embed`}
          />

        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 mt-6">

        <div className="bg-white rounded-2xl shadow-lg p-6">






          {/* Arrived */}
          {task.arrivedAt && (
            <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl mb-4">

              <p className="font-bold text-yellow-700">
                Arrived
              </p>

              <p className="mt-1">
                {new Date(task.arrivedAt).toLocaleString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              </p>

            </div>
          )}

          {/* Completed */}
          {task.completedAt && (
            <div className="bg-green-50 border border-green-300 p-4 rounded-xl mb-4">

              <p className="font-bold text-green-700">
                Completed
              </p>

              <p className="mt-1">
                {new Date(task.completedAt).toLocaleString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              </p>

            </div>
          )}
          {!isNearLocation && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4 text-center">
              Move closer to the destination (within 100 meters) to update status
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center mt-6">

            {task.status === "Scheduled" && (
              <button
                onClick={markArrived}
                disabled={!isNearLocation}
                className={`px-10 py-3 rounded-xl text-lg font-bold shadow-lg
  ${isNearLocation
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-gray-400 cursor-not-allowed text-white"
                  }`}
              >
                Mark Arrived
              </button>
            )}

            {task.status === "Arrived" && task.arrivedAt && (

              <button
                onClick={markCompleted}
                disabled={!isNearLocation}
                className={`px-10 py-3 rounded-xl text-lg font-bold shadow-lg
 ${isNearLocation
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-400 cursor-not-allowed text-white"
                  }`}
              >
                Mark Completed
              </button>

            )}

          </div>



        </div>
      </div>

    </div>
  );
}