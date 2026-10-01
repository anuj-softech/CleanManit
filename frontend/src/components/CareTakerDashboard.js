import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Api from "../api/Api";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function CareTakerDashboard() {

    const [requests, setRequests] = useState([]);
    const [statusFilter, setStatusFilter] = useState("Active");
    const [loading, setLoading] = useState(false);
    const [hostel, setHostel] = useState(null);
    const [priority, setPriority] = useState("Medium");

    const { id } = useParams();

    const caretakerId = id;


    // ================= GET REQUESTS =================

    const getRequests = useCallback(async () => {

        try {

            setLoading(true);

            const res = await axios.get(
                `${Api.get_Caretaker_Reqs}/${caretakerId}`
            );

            setRequests(res.data?.data || []);

        }
        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Failed to load requests"
            );

        }

        finally {

            setLoading(false);

        }

    }, [caretakerId]);




    // ================= GET HOSTEL =================


    const getHostel = useCallback(async () => {

        try {

            const res = await axios.get(
                `${Api.get_Caretaker_Hostel}/${caretakerId}`
            );

            setHostel(res.data.data);

        }
        catch (err) {

            console.log(err);

        }

    }, [caretakerId]);




    // ================= FILTER =================


    const activeRequests = requests.filter(
        (req) =>
            req.status?.trim().toLowerCase() !== "completed"
    );

    const completedRequests = requests.filter(
        (req) =>
            req.status?.trim().toLowerCase() === "completed"
    );



    useEffect(() => {

        if (caretakerId) {

            getRequests();
            getHostel();

        }

    }, [
        caretakerId,
        getRequests,
        getHostel
    ]);




    // ================= CREATE REQUEST =================


    const handleSubmit = async () => {

        try {

            const res = await axios.post(
                Api.create_Caretaker_Request,
                {
                    caretakerId,
                    priority
                }
            );


            toast.success(res.data.message);
            setPriority("Medium");
            getRequests();




        }
        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Request Failed"
            );

        }

    };





    return (

        <div className="min-h-screen bg-[#4CBB17]/20">

            <div className="bg-[#4CBB17]/40 px-4 py-4 lg:px-8 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <Link to="/" className="cursor-pointer hover:opacity-90 transition block" title="Go to Home">
                    <h1 className="flex items-center gap-3 text-3xl lg:text-5xl font-extrabold text-green-900">
                        <img
                            src="/garbageVehicle.jpeg"
                            alt="CleanTrack Logo"
                            className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
                        />
                        CleanTrack
                    </h1>

                    <p className="text-gray-800 mt-2">
                        Smart Waste Management Control Center
                    </p>
                </Link>

                <div className="flex items-center">
                    <LogoutButton />
                </div>

            </div>





            <div className="bg-green-700 text-white py-4 shadow">

                <h1 className="text-center text-xl sm:text-2xl lg:text-3xl font-bold">

                    Caretaker Dashboard

                </h1>

            </div>





            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-8">



                {/* CREATE REQUEST */}

                <div>

                    <div className="bg-white rounded-2xl shadow p-6">


                        <h2 className="text-2xl font-bold text-green-900 mb-5">

                            Create Pickup Request

                        </h2>



                        <label className="font-semibold">

                            Assigned Hostel

                        </label>


                        <input

                            value={hostel?.locationName || ""}

                            readOnly

                            className="w-full border rounded-xl p-3 mt-2 bg-gray-100"

                        />




                        <label className="font-semibold block mt-5">

                            Priority

                        </label>



                        <div className="grid grid-cols-3 gap-2 mt-3">


                            {
                                ["Low", "Medium", "High"].map((p) => (


                                    <button
                                        type="button"
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={
                                            priority === p
                                                ?
                                                "bg-green-800 text-white py-2 rounded-full"
                                                :
                                                "border py-2 rounded-full"
                                        }
                                    >
                                        {p}
                                    </button>


                                ))

                            }


                        </div>




                        <button

                            onClick={handleSubmit}

                            className="mt-5 w-full bg-green-800 text-white py-3 rounded-xl font-bold"

                        >

                            Create Request

                        </button>



                    </div>

                </div>






                {/* REQUEST LIST */}


                <div className="lg:col-span-2">


                    <div className="bg-white rounded-2xl shadow p-6">


                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">



                            <div>

                                <h2 className="text-3xl font-bold text-green-900">

                                    Pickup Requests

                                </h2>


                                <p className="text-gray-500">

                                    Assigned Hostel Cleaning Requests

                                </p>


                            </div>




                            <select

                                value={statusFilter}

                                onChange={(e) => setStatusFilter(e.target.value)}

                                className="border rounded-xl px-4 py-2"

                            >


                                <option value="Active">
                                    All Active
                                </option>


                                <option value="Completed">
                                    Completed
                                </option>


                            </select>



                        </div>







                        {
                            loading ?

                                <div className="text-center py-10 text-blue-600 font-semibold">

                                    Loading Requests...

                                </div>


                                :


                                statusFilter === "Active"


                                    ?

                                    activeRequests.length === 0

                                        ?

                                        <Empty />

                                        :


                                        <>

                                            <h2 className="text-2xl font-bold text-green-700 mb-4">

                                                Active Requests ({activeRequests.length})

                                            </h2>


                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                                                {
                                                    activeRequests.map((req) => (

                                                        <RequestCard
                                                            key={req._id}
                                                            req={req}
                                                        />

                                                    ))
                                                }


                                            </div>

                                        </>


                                    :


                                    completedRequests.length === 0

                                        ?

                                        <Empty />

                                        :


                                        <>

                                            <h2 className="text-2xl font-bold text-blue-700 mb-4">

                                                Completed Requests ({completedRequests.length})

                                            </h2>


                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                                                {
                                                    completedRequests.map((req) => (

                                                        <RequestCard
                                                            key={req._id}
                                                            req={req}
                                                        />

                                                    ))
                                                }


                                            </div>


                                        </>


                        }


                    </div>


                </div>


            </div>



        </div>

    );

}





// ================= EMPTY =================


function Empty() {

    return (

        <div className="text-center py-16">

            <div className="text-6xl">
                🧹
            </div>

            <h2 className="text-2xl font-bold text-gray-500 mt-3">

                No Requests Found

            </h2>

        </div>

    )

}





// ================= CARD =================


function RequestCard({ req }) {

    const status = req.status?.trim().toLowerCase();

    return (

        <div
            className={`rounded-2xl p-5 border-2 transition hover:shadow-lg
           ${req.isOverdue && status !== "completed" ?
                    "border-red-400 bg-red-50" :
                    "border-gray-200 bg-white"

                }

`}
        >


            <div className="flex justify-between items-start gap-4">


                <h3 className="text-xl font-semibold text-green-800">

                    📍 {req.location?.locationName}

                </h3>



                <div className="flex flex-col gap-2 items-end">



                    {/* COMPLETED ONLY */}

                    {
                        status === "completed" &&

                        <span
                            className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold"
                        >

                            Completed

                        </span>

                    }




                    {/* SCHEDULED + OVERDUE */}

                    {
                        status !== "completed" &&
                        req.scheduledDate &&

                        <span
                            className="bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                        >

                            Scheduled

                        </span>

                    }




                    {
                        status !== "completed" &&
                        req.isOverdue &&

                        <span
                            className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse"
                        >

                            OVERDUE

                        </span>

                    }




                    {/* PENDING */}

                    {
                        status !== "completed" &&
                        !req.scheduledDate &&
                        !req.isOverdue &&

                        <span
                            className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold"
                        >

                            Pending

                        </span>

                    }



                </div>



            </div>





            <p className="mt-5">

                Priority :

                <b>{req.priority}</b>

            </p>





            <p className="text-sm text-gray-500 mt-2">

                Created :

                {new Date(req.createdAt).toLocaleString("en-IN")}

            </p>





            {/* Scheduled Date */}

            {
                req.scheduledDate &&

                <p className="text-sm text-sky-700 mt-2 font-medium">

                    Scheduled :

                    {new Date(req.scheduledDate).toLocaleDateString("en-IN")}

                    {" | "}

                    {req.scheduledTime}

                </p>

            }






            {/* Arrived */}

            {
                req.arrivedAt &&

                <p className="text-sm text-orange-700 mt-2 font-medium">

                    Arrived :

                    {new Date(req.arrivedAt).toLocaleString("en-IN")}

                </p>

            }





            {/* Completed */}

            {
                req.completedAt &&

                <p className="text-sm text-green-700 mt-2 font-medium">

                    Completed :

                    {new Date(req.completedAt).toLocaleString("en-IN")}

                </p>

            }



        </div>


    )

}