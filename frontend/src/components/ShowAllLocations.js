import { useState } from "react";
import axios from "axios";
import Api from "../api/Api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function ShowAllLocations() {
  const [zone, setZone] = useState("");
  const [locations, setLocations] = useState([]);
  const [supervisor, setSupervisor] = useState("");
  const [search, setSearch] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isShown, setIsShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [caretakers, setCaretakers] = useState([]);
  const [selectedCaretaker, setSelectedCaretaker] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [updateLocation, setUpdateLocation] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate();

  const handleShow = async () => {
    if (!zone) return toast.warning("Please select a zone");

    setIsShown(true);
    setLoading(true);

    try {

      if (
        zone === "Hostel Zone 1" ||
        zone === "Hostel Zone 2"
      ) {
        await loadCaretakers();
      }

      const res = await axios.get(
        `${Api.get_Locations_By_Zone}/${encodeURIComponent(zone)}`
      );

      setSupervisor(res.data?.supervisor || "No Supervisor Assigned");

      const sorted = (res.data?.locations || []).sort((a, b) =>
        a.locationName.localeCompare(
          b.locationName,
          undefined,
          {
            numeric: true,
            sensitivity: "base"
          }
        )
      );

      setLocations(sorted);
      setFilteredLocations(sorted);

    } catch (err) {
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this location?")) return;

    try {
      await axios.delete(`${Api.delete_Locations}/${id}`);
      toast.success("Deleted");

      setLocations((prev) => prev.filter((l) => l._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const loadCaretakers = async () => {

    try {

      const res =
        await axios.get(
          Api.get_All_Caretakers
        );

      console.log(res.data)
      setCaretakers(
        res.data.data
      );


    } catch (err) {

      toast.error(
        "Failed to load caretakers"
      );

    }

  };


  const assignCaretaker = async () => {

    try {

      const data = {
        caretakerId: selectedCaretaker,
        locationId: selectedLocation,
      };


      if (isUpdate) {

        await axios.put(
          Api.update_Caretaker_Hostel,
          data
        );

        toast.success("Caretaker updated successfully");

      }
      else {

        await axios.post(
          Api.caretaker_Assign_Hostel,
          data
        );

        toast.success("Caretaker assigned successfully");

      }


      setSelectedCaretaker("");
      setSelectedLocation(null);
      setIsUpdate(false);

      handleShow();


    } catch (error) {

      console.log("FULL ERROR:", error);

      // backend ka error message show hoga
      toast.error(
        error.response?.data?.message || "Operation failed"
      );

    }

  };
  return (
    <div className="min-h-screen bg-green-100">

      {/* HEADER */}
      <div className="mb-6 bg-[#4CBB17]/40 px-4 py-3 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="cursor-pointer hover:opacity-90 transition block" title="Go to Home">
          <h1 className="flex items-center justify-center lg:justify-start gap-3 text-3xl lg:text-5xl font-extrabold text-green-900">
            <img
              src="/garbageVehicle.jpeg"
              className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
              alt="CleanTrack"
            />
            CleanTrack
          </h1>
          <p className="text-gray-900 mt-1 text-center lg:text-left text-sm sm:text-base">
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

      {/* TITLE */}
      <h1 className="text-2xl font-bold text-center mt-4">
        All Locations
      </h1>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-5 px-4">

        <select
          value={zone}
          onChange={(e) => {
            setZone(e.target.value);
            setSearch("");
            setLocations([]);
            setFilteredLocations([]);
            setIsShown(false);
            setSupervisor("");
          }}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">Select Zone</option>
          <option>Hostel Zone 1</option>
          <option>Hostel Zone 2</option>
          <option>Academic Zone</option>
          <option>Colony Zone</option>
        </select>

        <button
          onClick={handleShow}
          className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Show
        </button>
      </div>

      {locations.length > 0 && (
        <div className="flex justify-center mt-5 px-4">

          <input
            type="text"
            placeholder="Search location..."
            value={search}
            onChange={(e) => {

              const value = e.target.value;
              setSearch(value);

              if (value.length < 1) {
                setFilteredLocations(locations);
                return;
              }

              const result = locations.filter((loc) => {

                const name = String(loc.locationName).toLowerCase();
                const searchValue = String(value).toLowerCase();

                return name.includes(searchValue);

              });

              setFilteredLocations(result);

            }}
            className="border p-2 rounded w-full sm:w-96"
          />

        </div>
      )}

      {/* SUPERVISOR (CENTERED ALWAYS) */}
      {supervisor && (
        <div className="text-center text-lg font-semibold mt-4">
          Supervisor:
          <span className="text-blue-700 ml-2">
            {supervisor}
          </span>
        </div>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block px-6 mt-6">

        <table className="w-full bg-white shadow rounded text-center">

          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3">Location</th>
              <th className="p-3">
                Caretaker
              </th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {!isShown ? (

              <tr>
                <td colSpan="3" className="p-5 text-gray-600 font-semibold">
                  Please select a zone and click Show
                </td>
              </tr>

            ) : loading ? (

              <tr>
                <td colSpan="3" className="p-5 text-blue-600 font-semibold">
                  Loading locations...
                </td>
              </tr>

            ) : filteredLocations.length > 0 ? (

              filteredLocations.map((loc) => (

                <tr key={loc._id} className="border">

                  <td className="p-3 font-medium">
                    {loc.locationName}
                  </td>

                  <td className="p-3">


                    {loc.caretaker ? (

                      <div>

                        <p className="font-semibold text-green-700">
                          {loc.caretaker.name}
                        </p>

                        <p className="text-sm">
                          {loc.caretaker.mobile}
                        </p>

                        <button
                          onClick={() => {

                            setSelectedLocation(loc._id);

                            setIsUpdate(true);

                            setSelectedCaretaker(
                              loc.caretaker._id
                            );

                          }}
                          className="
mt-2
bg-yellow-500
text-white
px-3
py-1
rounded
"
                        >
                          Update CareTaker
                        </button>


                      </div>

                    )
                      :

                      (

                        loc.zone.includes("Hostel") &&

                        <button
                          onClick={() => {

                            setSelectedLocation(loc._id);
                            setIsUpdate(false);

                          }}
                          className="
bg-green-600
text-white
px-3
py-1
rounded
"
                        >
                          Assign Caretaker
                        </button>
                      )

                    }


                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => navigate(`/create-location/${loc._id}`)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Update Location
                      </button>

                      <button
                        onClick={() => handleDelete(loc._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete Location
                      </button>

                    </div>
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="3" className="p-5 text-red-600 font-semibold">
                  No Location Found
                </td>
              </tr>

            )}

          </tbody>

        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden px-4 mt-6 space-y-3">

        {!isShown ? (

          <div className="bg-white rounded shadow p-4 text-center text-gray-600 font-semibold">
            Please select a zone and click Show
          </div>

        ) : loading ? (

          <div className="bg-white rounded shadow p-4 text-center text-blue-600 font-semibold">
            Loading locations...
          </div>

        ) : filteredLocations.length > 0 ? (

          filteredLocations.map((loc) => (

            <div
              key={loc._id}
              className="bg-white rounded-lg shadow p-4"
            >

              <div className="flex justify-between items-center">

                {/* LOCATION */}
                <div>
                  <p className="font-bold text-gray-800">
                    {loc.locationName}
                  </p>


                  {loc.caretaker && (

                    <div className="mt-2">

                      <p className="text-sm text-green-700 font-semibold">
                        {loc.caretaker.name}
                      </p>

                      <p className="text-xs text-gray-600">
                        {loc.caretaker.mobile}
                      </p>

                    </div>

                  )}

                </div>



                {/* CARETAKER BUTTON SIDE */}
                <div>


                  {loc.caretaker ? (

                    <button
                      onClick={() => {

                        setSelectedLocation(loc._id);
                        setIsUpdate(true);

                        setSelectedCaretaker(
                          loc.caretaker._id
                        );

                      }}
                      className="
bg-yellow-500
text-white
px-3
py-1
rounded
text-sm
"
                    >
                      Update CareTaker
                    </button>


                  )

                    :

                    (

                      loc.zone.includes("Hostel") &&

                      <button
                        onClick={() => {

                          setSelectedLocation(loc._id);
                          setIsUpdate(false);

                        }}
                        className="
bg-green-600
text-white
px-3
py-1
rounded
text-sm
"
                      >
                        Assign
                      </button>

                    )


                  }

                </div>


              </div>



              {/* LOCATION UPDATE DELETE */}
              <div className="flex gap-2 mt-4">


                <button
                  onClick={() => navigate(`/create-location/${loc._id}`)}
                  className="
bg-blue-600
text-white
px-3
py-1
rounded
text-sm
flex-1
"
                >
                  Edit Location
                </button>


                <button
                  onClick={() => handleDelete(loc._id)}
                  className="
bg-red-600
text-white
px-3
py-1
rounded
text-sm
flex-1
"
                >
                  Delete Location
                </button>


              </div>



            </div>

          ))


        )

          : (

            <div className="bg-white rounded shadow p-4 text-center text-red-600 font-semibold">
              No Location Found
            </div>

          )}

      </div>

      {selectedLocation && (

        <div className="
fixed inset-0
bg-black/40
flex
items-center
justify-center
z-50
">

          <div className="
bg-white
rounded-xl
shadow-xl
p-6
w-96
">


            <h2 className="text-xl font-bold mb-4 text-center">
              {
                selectedLocation &&
                  filteredLocations.find(
                    l => l._id === selectedLocation
                  )?.caretaker
                  ? "Update Caretaker"
                  : "Assign Caretaker"
              }
            </h2>


            <select

              value={selectedCaretaker}

              onChange={(e) =>
                setSelectedCaretaker(e.target.value)
              }

              className="
border
p-2
rounded
w-full
"

            >

              <option value="">
                Select Caretaker
              </option>


              {
                caretakers.map((c) => (

                  <option
                    key={c._id}
                    value={c._id}
                  >

                    {c.name} - {c.mobile}

                  </option>

                ))
              }


            </select>


            <div className="flex gap-3 mt-5">


              <button

                onClick={assignCaretaker}

                className="
bg-green-600
text-white
px-4
py-2
rounded
flex-1
">

                {
                  filteredLocations.find(
                    l => l._id === selectedLocation
                  )?.caretaker
                    ? "Update"
                    : "Assign"
                }

              </button>



              <button

                onClick={() => {

                  setSelectedLocation(null);
                  setSelectedCaretaker("");

                }}

                className="
bg-gray-400
text-white
px-4
py-2
rounded
flex-1
">

                Cancel

              </button>


            </div>


          </div>

        </div>

      )}

    </div>
  );
}