import SummaryCard from "../components/SummaryCard";
import { useState, useEffect } from "react";
import { getMyEmergencies } from "../services/emergencyServices";
import EmergencyCard from "../components/EmergencyCard";
import EmergencyForm from "../components/EmergencyForm";

const Dashboard = () => {
  const [success, setSuccess] = useState("");
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);

  useEffect (() => {
    const fetchEmergencies = async () => {
      try{
      const response = await getMyEmergencies();
      console.log(response);
      setEmergencies(response.data);
      } catch (error){
        setError(error.message);
      } finally {
        setLoading(false);
      }

    };
    fetchEmergencies();
  }, []);

  const handleEmergencyCreated = (newEmergency) => {
    setEmergencies((currentEmergencies) => [
      newEmergency,
      ...currentEmergencies,
    ]);
    setShowEmergencyForm(false);
    setSuccess("Emergency reported successfully!");
  };


  const totalEmergencies = emergencies.length;

  const openEmergencies = emergencies.filter((emergency) => 
    emergency.status === "OPEN").length;

  const resolvedEmergencies = emergencies.filter((emergency) => 
    emergency.status === "RESOLVED").length;


  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        SafeCircle Dashboard
      </h1>

      <button
        onClick={() =>{ 
          setSuccess("")
          setShowEmergencyForm(true)}}
         className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
      >
          Report Emergency
      </button>

      {success && (
  <p className="mt-3 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-700">
    {success}
  </p>
)}

      {showEmergencyForm && (
        <EmergencyForm
         onEmergencyCreated={handleEmergencyCreated}
          />)}

      <p className="mt-2 text-gray-600">
        Welcome to your SafeCircle dashboard.
      </p>

      {loading && (
        <p className="mt-2 text-gray-600">
          Loading emergencies...</p>
      )}

      {error && (
        <p className="mt-2 text-red-600">
          Error: {error}
        </p>
      )}

  <div className="mt-6 grid gap-4 md:grid-cols-3">
  <SummaryCard
    title="Total Emergencies"
    value={totalEmergencies}
  />

  <SummaryCard
    title="Open Emergencies"
    value={openEmergencies}
    color="red"
  />

  <SummaryCard
    title="Resolved Emergencies"
    value={resolvedEmergencies}
    color="green"
  />

  </div> 
  {selectedEmergency && (
  <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
    <h2 className="text-xl font-bold text-blue-800">
      Emergency Details
    </h2>

    <div className="mt-4 space-y-3">
     <p>
  <span className="font-medium">Status:</span>{" "}

  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      selectedEmergency.status === "RESOLVED"
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {selectedEmergency.status}
  </span>
</p>

      <p>
        <span className="font-medium">Description:</span>{" "}
        {selectedEmergency.description}
      </p>

     <p>
  <span className="font-medium">Priority:</span>{" "}

  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      selectedEmergency.priority === "CRITICAL"
        ? "bg-red-800 text-white"
        : selectedEmergency.priority === "HIGH"
        ? "bg-red-100 text-red-700"
        : selectedEmergency.priority === "MEDIUM"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    {selectedEmergency.priority}
  </span>
</p>

      <p>
        <span className="font-medium">Reported by:</span>{" "}
        {selectedEmergency.reportedBy?.firstName}{" "}
        {selectedEmergency.reportedBy?.lastName}
      </p>

      <p>
        <span className="font-medium">Reported:</span>{" "}
        {new Date(selectedEmergency.createdAt).toLocaleString()}
      </p>
    </div>

    <button
    onClick={() => setSelectedEmergency(null)}
    className="mt-6 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
    >
     Close Details
    </button>
     </div>
    )} 

      {!loading && emergencies.length === 0 && !error && (
     <p className="mt-4 text-gray-600">
       You haven't reported any emergencies yet.
     </p>
  )}
    <div className="mt-6 space-y-4">
       {emergencies.map((emergency) => (
        <EmergencyCard
         key={emergency.id}
          emergency={emergency}
          onClick={() => setSelectedEmergency(emergency)}
          selected={selectedEmergency?.id === emergency.id}
     />
  ))}
</div>

   
    </div>
  );
};

export default Dashboard;