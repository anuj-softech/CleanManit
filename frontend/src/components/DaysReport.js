import React, { useEffect, useState } from "react";
import axios from "axios";
import Api from "../api/Api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";


function DaysReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportGenerated, setReportGenerated] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [generatedStatus, setGeneratedStatus] = useState("");
  const [activeLists, setActiveLists] = useState({
    overdue: [],
    scheduled: [],
    pending: []
  });
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const today = new Date().toISOString().split("T")[0];
  const fetchCompletedRequests =
    async () => {
      try {
        const res = await axios.get(
          Api.get_All_Emg_Req
        );

        const data =
          res.data?.data ||
          res.data?.requests ||
          res.data ||
          [];

        setAllRequests(data);

      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch requests");
      }
    };

  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  const handleSearch = () => {

    if (!fromDate || !toDate) {
      return toast.warning("Select From and To Date");
    }

    const today = new Date().toISOString().split("T")[0];

    if (fromDate > today || toDate > today) {
      return toast.warning("Future dates are not allowed.");
    }

    if (fromDate > toDate) {
      return toast.warning("From Date cannot be later than To Date.");
    }


    const filtered = allRequests.filter((req) => {

      const requestDate = req.createdAt
        ? new Date(req.createdAt)
        : null;


      const dateMatch =
        requestDate &&
        requestDate >= new Date(fromDate) &&
        requestDate <= new Date(`${toDate}T23:59:59`);


      let statusMatch = true;


      if (statusFilter === "All") {
        statusMatch = req.status !== "Completed";
      }
      else if (statusFilter === "Completed") {
        statusMatch = req.status === "Completed";
      }


      return dateMatch && statusMatch;

    });


    if (statusFilter === "All") {

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      const overdue = filtered.filter((req) => {
        if (!req.scheduledDate) return false;

        const scheduled = new Date(
          `${req.scheduledDate}T${req.scheduledTime}`
        );

        return (
          scheduled < todayDate &&
          req.status !== "Completed"
        );
      });


      const scheduled = filtered.filter((req) => {
        if (!req.scheduledDate) return false;

        const scheduled = new Date(
          `${req.scheduledDate}T${req.scheduledTime}`
        );

        return (
          scheduled >= todayDate &&
          req.status !== "Completed"
        );
      });


      const pending = filtered.filter((req) =>
        !req.scheduledDate &&
        req.status !== "Completed"
      );


      const prioritySort = (a, b) => {

        const priority = {
          High: 1,
          Medium: 2,
          Low: 3
        };

        return priority[a.priority] - priority[b.priority];

      };


      setActiveLists({
        overdue: overdue.sort(prioritySort),
        scheduled: scheduled.sort(prioritySort),
        pending: pending.sort(prioritySort)
      });

    }

    // report generate hone ke baad hi show hoga
    setFilteredData(filtered);
    setReportGenerated(true);
    setGeneratedStatus(statusFilter);

    toast.success(
      `Report generated successfully (${filtered.length} records)`
    );


  };

  const downloadPDF = () => {

    if (
      generatedStatus === "All" &&
      activeLists.overdue.length === 0 &&
      activeLists.scheduled.length === 0 &&
      activeLists.pending.length === 0
    ) {
      return toast.warning("No Records to generate PDF");
    }

    if (
      generatedStatus === "Completed" &&
      filteredData.length === 0
    ) {
      return toast.warning("No Records to generate PDF");
    }


    const doc = new jsPDF();


    // Heading Style
    doc.setFontSize(22);

    // Green color (RGB)
    doc.setTextColor(0, 128, 0);


    // Center position calculate
    const title = "CleanTrack Report";

    const pageWidth = doc.internal.pageSize.getWidth();

    const textWidth = doc.getTextWidth(title);


    doc.text(
      title,
      (pageWidth - textWidth) / 2,
      18
    );


    // Reset color for tables/text
    doc.setTextColor(0, 0, 0);


    // Next content position
    let yPosition = 30;



    // ================= ACTIVE REPORT =================

    if (generatedStatus === "All") {

      // -------- OVERDUE --------
      if (activeLists.overdue.length > 0) {

        doc.setFontSize(16);
        doc.setTextColor(200, 0, 0);

        doc.text(
          `Overdue Requests (${activeLists.overdue.length})`,
          14,
          yPosition
        );

        autoTable(doc, {
          startY: yPosition + 5,

          head: [[
            "Location",
            "Priority",
            "Created",
            "Scheduled"
          ]],

          body: activeLists.overdue.map((req) => [
            req.location?.locationName || "-",
            req.priority || "-",
            formatDateTime(req.createdAt),
            formatDateTime(
              `${req.scheduledDate}T${req.scheduledTime}`
            )
          ])
        });


        yPosition = doc.lastAutoTable.finalY + 20;

      }



      // -------- SCHEDULED --------

      if (activeLists.scheduled.length > 0) {

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 200);

        doc.text(
          `Scheduled Requests (${activeLists.scheduled.length})`,
          14,
          yPosition
        );


        autoTable(doc, {

          startY: yPosition + 5,

          head: [[
            "Location",
            "Priority",
            "Created",
            "Scheduled"
          ]],

          body: activeLists.scheduled.map((req) => [
            req.location?.locationName || "-",
            req.priority || "-",
            formatDateTime(req.createdAt),
            formatDateTime(
              `${req.scheduledDate}T${req.scheduledTime}`
            )
          ])

        });


        yPosition = doc.lastAutoTable.finalY + 20;

      }




      // -------- PENDING --------

      if (activeLists.pending.length > 0) {

        doc.setFontSize(16);
        doc.setTextColor(200, 150, 0);

        doc.text(
          `Pending Requests (${activeLists.pending.length})`,
          14,
          yPosition
        );


        autoTable(doc, {

          startY: yPosition + 5,

          head: [[
            "Location",
            "Priority",
            "Created"
          ]],

          body: activeLists.pending.map((req) => [
            req.location?.locationName || "-",
            req.priority || "-",
            formatDateTime(req.createdAt)
          ])

        });

      }

    }



    // ================= COMPLETED REPORT =================


    else {


      doc.setFontSize(14);

      doc.text(
        `Completed Records (${filteredData.length})`,
        14,
        yPosition
      );


      autoTable(doc, {

        startY: yPosition + 5,


        head: [[
          "Location",
          "Priority",
          "Created",
          "Scheduled",
          "Arrived",
          "Completed"
        ]],


        body: filteredData.map((req) => [

          req.location?.locationName || "-",

          req.priority || "-",

          formatDateTime(req.createdAt),

          req.scheduledDate
            ?
            formatDateTime(
              `${req.scheduledDate}T${req.scheduledTime}`
            )
            :
            "-",


          formatDateTime(req.arrivedAt),

          formatDateTime(req.completedAt)

        ])

      });


    }



    doc.save(
      `CleanTrack_Report_${fromDate}_${toDate}.pdf`
    );


    toast.success(
      "PDF downloaded successfully"
    );

  };



  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-[#4CBB17]/20">
      <div className="min-h-screen bg-green-50 ">
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
              to="/admin"
              className="bg-green-800 hover:bg-green-900 text-white font-semibold px-4 py-2 rounded-xl transition shadow text-sm sm:text-base"
            >
              Admin Dashboard
            </Link>
            <LogoutButton />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8">

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h1 className="text-4xl font-bold text-green-900 mb-6">
              Days Report
            </h1>
            <div className="grid md:grid-cols-3 gap-4">

              {/* From Date */}
              <div>
                <label className="font-semibold block mb-2">
                  From Date
                </label>

                <input
                  type="date"
                  value={fromDate}
                  max={today}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="font-semibold block mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  max={today}
                  min={fromDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* Status */}
              <div>
                <label className="font-semibold block mb-2">
                  Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-lg p-3"
                >
                  <option value="All">All Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">

              <button
                onClick={handleSearch}
                className="bg-green-800 text-white py-3 px-8 rounded-lg hover:bg-green-900"
              >
                Generate Report
              </button>

              <button
                onClick={downloadPDF}
                className="bg-red-700 text-white py-3 px-8 rounded-lg hover:bg-red-800"
              >
                Download PDF
              </button>

            </div>
          </div>
          {reportGenerated && (
            <div className="bg-white rounded-2xl shadow-lg p-6">

              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-900">
                  {generatedStatus === "Completed"
                    ? "Completed Records"
                    : "Active Records"}
                </h2>

                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  Total: {filteredData.length}
                </span>
              </div>

              {generatedStatus === "All" ? (

                activeLists.overdue.length === 0 &&
                  activeLists.scheduled.length === 0 &&
                  activeLists.pending.length === 0 ? (

                  <div className="text-center py-10 text-gray-500 text-lg font-medium">
                    No Records Found
                  </div>

                ) : (

                  <div className="space-y-8">

                    {/* Overdue */}
                    {activeLists.overdue.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-red-700 mb-3">
                          Overdue Requests ({activeLists.overdue.length})
                        </h3>

                        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                          <table className="w-full border border-collapse">
                            <thead className="bg-red-100">
                              <tr>
                                <th className="border p-2">Location</th>
                                <th className="border p-2">Priority</th>
                                <th className="border p-2">Created</th>
                                <th className="border p-2">Scheduled</th>
                              </tr>
                            </thead>

                            <tbody>
                              {activeLists.overdue.map((req) => (
                                <tr key={req._id}>
                                  <td className="border p-2">{req.location?.locationName}</td>
                                  <td className="border p-2">{req.priority}</td>
                                  <td className="border p-2">{formatDateTime(req.createdAt)}</td>
                                  <td className="border p-2">
                                    {formatDateTime(`${req.scheduledDate}T${req.scheduledTime}`)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Scheduled */}
                    {activeLists.scheduled.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-blue-700 mb-3">
                          Scheduled Requests ({activeLists.scheduled.length})
                        </h3>

                        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">                <table className="w-full border border-collapse">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="border p-2">Location</th>
                              <th className="border p-2">Priority</th>
                              <th className="border p-2">Created</th>
                              <th className="border p-2">Scheduled</th>
                            </tr>
                          </thead>

                          <tbody>
                            {activeLists.scheduled.map((req) => (
                              <tr key={req._id}>
                                <td className="border p-2">{req.location?.locationName}</td>
                                <td className="border p-2">{req.priority}</td>
                                <td className="border p-2">{formatDateTime(req.createdAt)}</td>
                                <td className="border p-2">
                                  {formatDateTime(`${req.scheduledDate}T${req.scheduledTime}`)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                      </div>
                    )}

                    {/* Pending */}
                    {activeLists.pending.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-yellow-700 mb-3">
                          Pending Requests ({activeLists.pending.length})
                        </h3>

                        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">                <table className="w-full border border-collapse">
                          <thead className="bg-yellow-100">
                            <tr>
                              <th className="border p-2">Location</th>
                              <th className="border p-2">Priority</th>
                              <th className="border p-2">Created</th>
                            </tr>
                          </thead>

                          <tbody>
                            {activeLists.pending.map((req) => (
                              <tr key={req._id}>
                                <td className="border p-2">{req.location?.locationName}</td>
                                <td className="border p-2">{req.priority}</td>
                                <td className="border p-2">{formatDateTime(req.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                      </div>
                    )}

                  </div>

                )

              ) : (

                filteredData.length === 0 ? (

                  <div className="text-center py-10 text-gray-500 text-lg font-medium">
                    No Records Found
                  </div>

                ) : (

                  <div className="overflow-x-auto">
                    <table className="w-full border border-collapse">
                      <thead className="bg-green-200">
                        <tr>
                          <th className="border p-2">Location</th>
                          <th className="border p-2">Priority</th>
                          <th className="border p-2">Created</th>
                          <th className="border p-2">Scheduled</th>
                          <th className="border p-2">Arrived</th>
                          <th className="border p-2">Completed</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredData.map((req) => (
                          <tr key={req._id}>
                            <td className="border p-2">{req.location?.locationName}</td>
                            <td className="border p-2">{req.priority}</td>
                            <td className="border p-2">{formatDateTime(req.createdAt)}</td>
                            <td className="border p-2">
                              {req.scheduledDate
                                ? formatDateTime(`${req.scheduledDate}T${req.scheduledTime}`)
                                : "-"}
                            </td>
                            <td className="border p-2">{formatDateTime(req.arrivedAt)}</td>
                            <td className="border p-2">{formatDateTime(req.completedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                )

              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DaysReport;









