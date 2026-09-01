const EmergencyCard = ({ emergency, onClick, selected }) => {
    return (
    <div onClick={onClick} className={`cursor-pointer rounded-lg border p-4
     shadow-sm transition hover:shadow-md ${selected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 bg-white"
     }`}>
    <h2 className="font-semibold text-gray-800">
      Emergency Type: {emergency.emergencyType}
    </h2>
  
    <p className="mt-1 text-sm text-gray-600">
      {emergency.description}
    </p>

    <p className="mt-2 text-sm text-gray-500">
        Reported by:{" "}
            {emergency.reportedBy?.firstName} {emergency.reportedBy?.lastName}
    </p>
  
    <div className="mt-2">
        <span className="text-sm text-gray-500">
             Status:{" "}
        </span>

        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
        emergency.status === "RESOLVED"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-700"
        }`}>
            {emergency.status}
         </span>
    </div>
    <div className="mt-2">
  <span className="text-sm text-gray-500">
    Priority:{" "}
  </span>

  <span
  className={`rounded-full px-3 py-1 text-xs font-medium ${
    emergency.priority === "CRITICAL"
      ? "bg-red-800 text-white"
      :emergency.priority === "HIGH"
      ? "bg-red-100 text-red-700"
      : emergency.priority === "MEDIUM"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700"
  }`}
    >
  {emergency.priority}
</span>
    </div>
    <p className="mt-1 text-sm text-gray-500">
        Reported: {new Date(emergency.createdAt).toLocaleString()}
    </p>

    <p className="mt-4 text-sm font-medium text-blue-600">
        Click to view details →
    </p>

  </div>
    );
        
};
export default EmergencyCard;