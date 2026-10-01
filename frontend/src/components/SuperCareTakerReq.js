import React, { useEffect, useState } from "react";
import axios from "axios";
import Api from "../api/Api";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function CaretakerRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const supervisorId = localStorage.getItem("id");


  useEffect(() => {
    getRequests();
  }, []);


  const getRequests = async () => {

    try {

      setLoading(true);


      const res = await axios.get(
        `${Api.get_Zone_Caretaker_Reqs}/${supervisorId}`
      );


      console.log("API RESPONSE =>", res.data);



      const caretakerRequests =
        (res.data.data || []).filter(
          (req) =>
            req.requestedBy?.role === "caretaker"
        );



      console.log(
        "ONLY CARETAKER REQUESTS =>",
        caretakerRequests
      );



      setRequests(caretakerRequests);


    }
    catch (err) {

      console.log(err);

    }
    finally {

      setLoading(false);

    }

  };





  return (

    <div className="min-h-screen bg-green-100">


      <div className="
bg-[#4CBB17]/40 
px-4 
md:px-8 
py-4
">

        <div className="
flex 
flex-col 
md:flex-row 
items-center 
justify-between
">


          <Link to="/" className="text-center md:text-left cursor-pointer hover:opacity-90 transition block" title="Go to Home">
            <h1 className="flex items-center gap-3 text-3xl md:text-5xl font-extrabold text-green-900">
              <img
                src="/garbageVehicle.jpeg"
                alt="CleanTrack"
                className="w-12 h-12 object-contain"
              />
              CleanTrack
            </h1>

            <p className="text-gray-800 mt-1">
              Smart Waste Management Control Center
            </p>
          </Link>

          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <Link
              to="/supervisor-dashboard"
              className="bg-green-800 hover:bg-green-900 text-white font-semibold px-4 py-2 rounded-xl transition shadow text-sm md:text-base"
            >
              Supervisor Dashboard
            </Link>
            <LogoutButton />
          </div>

        </div>

      </div>





      <h1 className="
text-3xl
font-bold
text-green-900
p-6
">

        Caretaker Requests

      </h1>





      <div className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-5
p-6
">



        {
          loading ?


            <div className="
col-span-full
flex
justify-center
py-20
">

              <h2 className="
text-xl
font-bold
text-green-800
animate-pulse
">

                Loading Caretaker Requests...

              </h2>

            </div>



            :

            requests.length === 0 ?


              <div className="
col-span-full
flex
justify-center
py-20
">

                <h2 className="
text-xl
font-bold
text-red-600
">

                  No Requests Found

                </h2>

              </div>



              :


              requests.map((req) => (


                <div
                  key={req._id}
                  className="
bg-white
rounded-2xl
shadow
p-5
border
relative
"
                >



                  <div
                    className="
  absolute
  top-4
  right-4
  flex
  items-center
  gap-2
  flex-wrap
  "
                  >
                    <span
                      className={
                        req.status === "Completed"
                          ? "bg-green-600 text-white px-4 py-1 rounded-full text-sm"
                          : req.status === "Scheduled"
                            ? "bg-sky-500 text-white px-4 py-1 rounded-full text-sm"
                            : req.status === "Arrived"
                              ? "bg-orange-500 text-white px-4 py-1 rounded-full text-sm"
                              : "bg-yellow-400 text-black px-4 py-1 rounded-full text-sm"
                      }
                    >
                      {req.status}
                    </span>

                    {req.isOverdue && (
                      <span
                        className="
      bg-red-600
      text-white
      px-3
      py-1
      rounded-full
      text-sm
      "
                      >
                        OVERDUE
                      </span>
                    )}
                  </div>





                  <h2 className="
text-xl
font-bold
text-green-800
mb-3
">

                    📍 {req.location?.locationName || "Unknown Location"}

                  </h2>





                  <p className="mt-2">

                    <b>
                      Caretaker :
                    </b>{" "}

                    {req.requestedBy?.name || "N/A"}

                  </p>




                  <p>

                    <b>
                      Mobile :
                    </b>{" "}

                    {req.requestedBy?.mobile || "N/A"}

                  </p>





                  <p className="mt-2">

                    <b>
                      Priority :
                    </b>{" "}

                    {req.priority}

                  </p>


                  {
                    req.scheduledDate &&

                    <p className="
text-sky-700
mt-3
font-medium
">

                      Scheduled :

                      {req.scheduledDate}

                      {" | "}

                      {req.scheduledTime}


                    </p>

                  }







                  {
                    req.completedAt &&

                    <p className="
text-green-700
mt-3
font-medium
">

                      Completed :

                      {
                        new Date(req.completedAt)
                          .toLocaleString("en-IN")
                      }


                    </p>

                  }




                </div>


              ))


        }



      </div>



    </div>


  );

}