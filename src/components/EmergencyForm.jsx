import { useState, useEffect } from "react";
import { createEmergency } from "../services/emergencyServices";
import { getMyFamilyContacts } from "../services/familyContactServices";
import { getCommunityResponders } from "../services/communityResponderServices";

const EmergencyForm = ({ onEmergencyCreated }) => {
  const [emergencyType, setEmergencyType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");
  const [familyContacts, setFamilyContacts] = useState([]);
  const [communityResponders, setCommunityResponders] = useState([]);
  const [recipientFamilyContactIds, setRecipientFamilyContactIds] = useState(
    [],
  );
  // const [recipientCommunityResponderIds, setRecipientCommunityResponderIds] =
  //   useState([]);

  const [emergencyPin, setEmergencyPin] = useState("");

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const familyResponse = await getMyFamilyContacts();
        const responderResponse = await getCommunityResponders();

        setFamilyContacts(familyResponse.data);
        setCommunityResponders(responderResponse.data);
      } catch (error) {
        console.error("Failed to fetch recipients:", error);
      }
    };

    fetchRecipients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emergencyType) {
      setError("Please select emergency type");
      return;
    }

    // if (recipientCommunityResponderIds.length < 2) {
    //   setError("Please select at least two community responders.");
    //   return;
    // }

    setError("");

    const emergencyData = {
      emergencyType,
      description,
      priority,
      emergencyPin,
      recipientFamilyContactIds,
    };

    try {
      const response = await createEmergency(emergencyData);
      onEmergencyCreated(response.data);
      setEmergencyPin("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFamilyContactSelection = (contactId) => {
    setRecipientFamilyContactIds((currentIds) => {
      if (currentIds.includes(contactId)) {
        return currentIds.filter((id) => id !== contactId);
      }

      return [...currentIds, contactId];
    });
  };

  // const handleCommunityResponderSelection = (responderId) => {
  //   setRecipientCommunityResponderIds((currentIds) => {
  //     if (currentIds.includes(responderId)) {
  //       return currentIds.filter((id) => id !== responderId);
  //     }

  //     return [...currentIds, responderId];
  //   });
  // };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <h2 className="text-xl font-bold text-gray-800">Report an Emergency</h2>

      <p className="mt-2 text-sm text-gray-600">
        Please provide the details of the emergency.
      </p>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Emergency Type
        </label>

        <select
          value={emergencyType}
          onChange={(e) => setEmergencyType(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">Select emergency type</option>
          <option value="BURGLARY">Burglary</option>
          <option value="FIRE_OUTBREAK">Fire Outbreak</option>
          <option value="MEDICAL_EMERGENCY">Medical Emergency</option>
          <option value="DOMESTIC_ACCIDENT">Domestic ACCIDENT</option>
          <option value="ROAD_ACCIDENT">Road Accident</option>
          <option value="MISSING_PERSON">Missing Person</option>
          <option value="KIDNAPPING">Kidnapping</option>
          <option value="FLOODING">Flooding</option>
        </select>

        <p className="mt-2 text-sm text-gray-500">Selected: {emergencyType}</p>
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="Describe the emergency..."
        />
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">Select priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>
      <div className="mt-6">
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Notify Family Contacts
          </h3>

          {familyContacts.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">
              You have no saved family contacts.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {familyContacts.map((contact) => (
                <label
                  key={contact.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <input
                    type="checkbox"
                    checked={recipientFamilyContactIds.includes(contact.id)}
                    onChange={() => handleFamilyContactSelection(contact.id)}
                  />

                  <span>
                    {contact.firstName} {contact.lastName}
                    <span className="ml-2 text-sm text-gray-500">
                      ({contact.relationship})
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Notify Community Responders
          </h3>

          {communityResponders.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">
              No community responders are currently available.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {communityResponders.map((responder) => (
                <label
                  key={responder.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <input
                    type="checkbox"
                    checked={recipientCommunityResponderIds.includes(
                      responder.id,
                    )}
                    onChange={() =>
                      handleCommunityResponderSelection(responder.id)
                    }
                  />

                  <span>
                    {responder.user.firstName} {responder.user.lastName}
                    <span className="ml-2 text-sm text-gray-500">
                      ({responder.responderType})
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div> */}

        <div className="mt-6"></div>
        <div>
          <label
            htmlFor="emergencyPin"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Emergency PIN
          </label>

          <input
            id="emergencyPin"
            type="password"
            inputMode="numeric"
            maxLength={4}
            pattern="[0-9]{4}"
            value={emergencyPin}
            onChange={(e) =>
              setEmergencyPin(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="Enter your 4-digit PIN"
            required
            autoComplete="off"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Report Emergency
        </button>
      </div>
    </form>
  );
};

export default EmergencyForm;
