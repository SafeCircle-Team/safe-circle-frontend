import { useEffect, useState } from "react";
import {
getEmergencies,
updateEmergencyStatus,
updateEmergencyPriority,
updateEmergencyResponse,
} from "../services/emergencyServices";

const Emergency = () => {
const [emergencies, setEmergencies] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");
const [priorityFilter, setPriorityFilter] = useState("ALL");

useEffect(() => {
const fetchEmergencies = async () => {
try {
const response = await getEmergencies();

    setEmergencies(response.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

fetchEmergencies();

}, []);

const handleStatusChange = async (id, status) => {
try {
await updateEmergencyStatus(id, status);

  setEmergencies((currentEmergencies) =>
    currentEmergencies.map((emergency) =>
      emergency.id === id
        ? { ...emergency, status }
        : emergency
    )
  );
} catch (error) {
  setError(error.message);
}

};

const handlePriorityChange = async (id, priority) => {
try {
await updateEmergencyPriority(id, priority);

  setEmergencies((currentEmergencies) =>
    currentEmergencies.map((emergency) =>
      emergency.id === id
        ? { ...emergency, priority }
        : emergency
    )
  );
} catch (error) {
  setError(error.message);
}

};

const handleResponseChange = async (id, response) => {
try {
await updateEmergencyResponse(id, response);

  setEmergencies((currentEmergencies) =>
    currentEmergencies.map((emergency) =>
      emergency.id === id
        ? { ...emergency, response }
        : emergency
    )
  );
} catch (error) {
  setError(error.message);
}

};

const totalEmergencies = emergencies.length;

const openEmergencies = emergencies.filter(
  (emergency) => emergency.status === "OPEN"
).length;

const criticalEmergencies = emergencies.filter(
  (emergency) => emergency.priority === "CRITICAL"
).length;

const resolvedEmergencies = emergencies.filter(
  (emergency) => emergency.status === "RESOLVED"
).length;

const filteredEmergencies = emergencies.filter((emergency) => {
  const matchesStatus =
    statusFilter === "ALL" ||
    emergency.status === statusFilter;

  const matchesPriority =
    priorityFilter === "ALL" ||
    emergency.priority === priorityFilter;

  return matchesStatus && matchesPriority;
});

return ( <div className="space-y-6"> <div> <h1 className="text-2xl font-bold text-gray-900">
Emergency Management </h1>
    <p className="mt-1 text-sm text-gray-500">
      Monitor and manage emergencies reported within your community.
    </p>
  </div>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Total Emergencies
    </p>

<p className="mt-2 text-3xl font-bold text-gray-900">
  {totalEmergencies}
</p>

  </div>

  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Open Emergencies
    </p>

<p className="mt-2 text-3xl font-bold text-gray-900">
  {openEmergencies}
</p>

  </div>

  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Critical Emergencies
    </p>

<p className="mt-2 text-3xl font-bold text-gray-900">
  {criticalEmergencies}
</p>

  </div>

  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Resolved Emergencies
    </p>

<p className="mt-2 text-3xl font-bold text-gray-900">
  {resolvedEmergencies}
</p>


  </div>
</div>

<div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
  <div>
    <p className="text-sm font-semibold text-gray-800">
      Filter Emergencies
    </p>

<p className="text-xs text-gray-500">
  View emergencies by status and priority.
</p>

  </div>

  <div className="flex flex-col gap-3 sm:flex-row">
    <select
      value={statusFilter}
      onChange={(event) => setStatusFilter(event.target.value)}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
    >
      <option value="ALL">All Statuses</option>
      <option value="OPEN">Open</option>
      <option value="RESOLVED">Resolved</option>
    </select>

<select
  value={priorityFilter}
  onChange={(event) => setPriorityFilter(event.target.value)}
  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
>
  <option value="ALL">All Priorities</option>
  <option value="LOW">Low</option>
  <option value="MEDIUM">Medium</option>
  <option value="HIGH">High</option>
  <option value="CRITICAL">Critical</option>
</select>

  </div>
</div>

  {loading && (
    <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500 shadow-sm">
      Loading emergencies...
    </div>
  )}

  {error && (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
      Error: {error}
    </div>
  )}

  {!loading && !error && emergencies.length === 0 && (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
      <p className="text-gray-500">
        There are no emergencies in your community.
      </p>
    </div>
  )}

  <div className="grid gap-5">
    {filteredEmergencies.map((emergency) => (
      <div
        key={emergency.id}
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Emergency
            </p>

            <h2 className="mt-1 text-lg font-bold text-gray-900">
              {emergency.emergencyType.replaceAll("_", " ")}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500">
              Status
            </span>

            <select
              value={emergency.status}
              onChange={(event) =>
                handleStatusChange(
                  emergency.id,
                  event.target.value
                )
              }
              className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="OPEN">OPEN</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>

        <div className="p-5">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Description
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-700">
              {emergency.description || "No description provided."}
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-4">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                Priority
              </label>

              <select
                value={emergency.priority || ""}
                onChange={(event) =>
                  handlePriorityChange(
                    emergency.id,
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                Response
              </label>

              <select
                value={emergency.response || ""}
                onChange={(event) =>
                  handleResponseChange(
                    emergency.id,
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
              >
                <option value="">
                  Select response
                </option>
                <option value="ACKNOWLEDGED">
                  ACKNOWLEDGED
                </option>
                <option value="INVESTIGATING">
                  INVESTIGATING
                </option>
                <option value="RESOLVED">
                  RESOLVED
                </option>
                <option value="FALSE_ALARM">
                  FALSE ALARM
                </option>
                <option value="UNRESOLVED">
                  UNRESOLVED
                </option>
              </select>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Reported
              </p>

              <p className="mt-2 text-sm font-medium text-gray-700">
                {new Date(
                  emergency.createdAt
                ).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Community
              </p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                {emergency.community?.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Reported By
              </p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                {emergency.reportedBy?.firstName}{" "}
                {emergency.reportedBy?.lastName}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Contact Number
              </p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                {emergency.reportedBy?.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

);
};

export default Emergency;
