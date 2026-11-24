import { useEffect, useState } from "react";
import {
  getIncidents,
  createIncident,
  updateIncidentStatus,
} from "../services/incidentServices";

import { useAuth } from "../context/AuthContext";

const Incidents = () => {
  const { user } = useAuth();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAllIncidents, setShowAllIncidents] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    emergencyType: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await getIncidents();
        setIncidents(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const incidentTypes = [
    { value: "BURGLARY", label: "Burglary" },
    { value: "FIRE_OUTBREAK", label: "Fire Outbreak" },
    { value: "MEDICAL_EMERGENCY", label: "Medical Emergency" },
    { value: "DOMESTIC_ACCIDENT", label: "Domestic Accident" },
    { value: "ROAD_ACCIDENT", label: "Road Accident" },
    { value: "MISSING_PERSON", label: "Missing Person" },
    { value: "KIDNAPPING", label: "Kidnapping" },
    { value: "FLOODING", label: "Flooding" },
    { value: "OTHER", label: "Other" },
  ];

  const canUpdateStatus =
    user?.role === "SUPER_ADMIN" || user?.role === "COMMUNITY_ADMIN";

  const totalIncidents = incidents.length;

  const openIncidents = incidents.filter(
    (incident) => incident.status === "OPEN",
  ).length;

  const investigatingIncidents = incidents.filter(
    (incident) => incident.status === "INVESTIGATING",
  ).length;

  const resolvedIncidents = incidents.filter(
    (incident) => incident.status === "RESOLVED",
  ).length;

  const filteredIncidents = incidents
    .filter((incident) => {
      return statusFilter === "ALL" || incident.status === statusFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const displayedIncidents = showAllIncidents
    ? filteredIncidents
    : filteredIncidents.slice(0, 5);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleCreateIncident = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await createIncident(formData);

      // Refresh the incident list after successful submission
      const response = await getIncidents();
      setIncidents(response.data);

      // Reset the form
      setFormData({
        title: "",
        description: "",
        emergencyType: "",
      });

      setShowForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setError("");

      await updateIncidentStatus(id, status);

      // Refresh the incident list
      const response = await getIncidents();
      setIncidents(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-red-100 text-red-700";

      case "INVESTIGATING":
        return "bg-amber-100 text-amber-700";

      case "RESOLVED":
        return "bg-green-100 text-green-700";

      case "CLOSED":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Incident Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Report and monitor incidents within your community.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Report Incident"}
        </button>
      </div>

      {/* Incident Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Incidents</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalIncidents}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Open Incidents</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {openIncidents}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Investigating</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {investigatingIncidents}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Resolved Incidents
          </p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {resolvedIncidents}
          </p>
        </div>
      </div>

      {/* Incident Reporting Form */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Report a New Incident
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Provide the details of the incident below.
          </p>

          {/*Incident form*/}
          <form onSubmit={handleCreateIncident} className="mt-6 space-y-5">
            {/* Incident Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Incident Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Suspicious Movement"
                required
                minLength={2}
                maxLength={50}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {formData.title.length}/50 characters
              </p>
            </div>

            {/* Incident Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Incident Type
              </label>

              <select
                name="emergencyType"
                value={formData.emergencyType}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select incident type</option>

                {incidentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide details about the incident..."
                required
                minLength={2}
                maxLength={300}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                {formData.description.length}/300 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Incident"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Incident Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Filter Incidents
          </p>
          <p className="text-xs text-gray-500">
            View incidents by their current status.
          </p>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 sm:w-52"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>
      {/* Loading State */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">Loading incidents...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredIncidents.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            No incidents found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            There are no incidents matching your selected filter.
          </p>
        </div>
      )}

      {/* Incident Records */}
      {!loading && !error && filteredIncidents.length > 0 && (
        <div className="grid gap-5">
          {displayedIncidents.map((incident) => (
            <div
              key={incident.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Incident Header */}
              <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Incident
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    {incident.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {incident.emergencyType.replaceAll("_", " ")}
                  </p>
                </div>

                <div className="sm:min-w-48">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Status
                  </label>

                  {canUpdateStatus ? (
                    <select
                      value={incident.status}
                      onChange={(event) =>
                        handleStatusChange(incident.id, event.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="INVESTIGATING">INVESTIGATING</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  ) : (
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(incident.status)}`}
                    >
                      {incident.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Incident Details */}
              <div className="p-5">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Description
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-700">
                    {incident.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Reported
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {new Date(incident.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Community
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {incident.community?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Reported By
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {incident.reportedBy?.firstName}{" "}
                      {incident.reportedBy?.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Incidents */}
      {!loading && !error && filteredIncidents.length > 5 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAllIncidents(!showAllIncidents)}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {showAllIncidents
              ? "Show Recent Incidents"
              : `View All ${filteredIncidents.length} Incidents`}
          </button>
        </div>
      )}
    </div>
  );
};

export default Incidents;
