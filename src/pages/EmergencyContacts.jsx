import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getCommunityResponders,
  getCommunityUsers,
  getEmergencyRecipientPreferences,
  addEmergencyRecipientPreference,
  removeEmergencyRecipientPreference,
} from "../services/communityService";

import {
  getMyFamilyContacts,
  createFamilyContact,
  deleteFamilyContact,
} from "../services/familyContactServices";

const EmergencyContacts = () => {
  const { user } = useAuth();
  const [officialOfficers, setOfficialOfficers] = useState([]);
  const [officersLoading, setOfficersLoading] = useState(true);
  const [officersError, setOfficersError] = useState("");

  const [availableResidents, setAvailableResidents] = useState([]);
  const [savedRecipients, setSavedRecipients] = useState([]);
  const [recipientsLoading, setRecipientsLoading] = useState(true);
  const [recipientsError, setRecipientsError] = useState("");
  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [savingRecipient, setSavingRecipient] = useState(false);

  const [removingRecipientId, setRemovingRecipientId] = useState(null);

  const [familyContacts, setFamilyContacts] = useState([]);
  const [familyContactsLoading, setFamilyContactsLoading] = useState(true);
  const [familyContactsError, setFamilyContactsError] = useState("");
  const [addingFamilyContact, setAddingFamilyContact] = useState(false);
  const [removingFamilyContactId, setRemovingFamilyContactId] = useState(null);

  const [familyContactForm, setFamilyContactForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    relationship: "",
  });

  useEffect(() => {
    const fetchOfficialOfficers = async () => {
      try {
        const response = await getCommunityResponders();
        setOfficialOfficers(response.data || []);
      } catch (error) {
        console.error("Failed to fetch community officers:", error);
        setOfficersError(error.message || "Failed to load community officers.");
      } finally {
        setOfficersLoading(false);
      }
    };

    fetchOfficialOfficers();
  }, []);

  useEffect(() => {
    const fetchRecipients = async () => {
      if (!user?.communityId) {
        setRecipientsError("You are not assigned to a community.");
        setRecipientsLoading(false);
        return;
      }

      try {
        setRecipientsError("");

        const [residentsResponse, preferencesResponse] = await Promise.all([
          getCommunityUsers(user.communityId),
          getEmergencyRecipientPreferences(),
        ]);

        setAvailableResidents(residentsResponse.data || []);
        setSavedRecipients(preferencesResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch emergency recipients:", error);
        setRecipientsError(
          error.message || "Failed to load emergency recipients.",
        );
      } finally {
        setRecipientsLoading(false);
      }
    };

    fetchRecipients();
  }, [user?.communityId]);

  useEffect(() => {
    const fetchFamilyContacts = async () => {
      try {
        setFamilyContactsError("");

        const response = await getMyFamilyContacts();
        setFamilyContacts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch family contacts:", error);
        setFamilyContactsError(
          error.message || "Failed to load family contacts.",
        );
      } finally {
        setFamilyContactsLoading(false);
      }
    };

    fetchFamilyContacts();
  }, []);

  const handleFamilyContactChange = (event) => {
    const { name, value } = event.target;

    setFamilyContactForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleAddFamilyContact = async (event) => {
    event.preventDefault();

    if (addingFamilyContact) return;

    try {
      setAddingFamilyContact(true);
      setFamilyContactsError("");

      await createFamilyContact(familyContactForm);

      // Refresh the list from the backend
      const response = await getMyFamilyContacts();
      setFamilyContacts(response.data || []);

      // Clear the form after a successful addition
      setFamilyContactForm({
        firstName: "",
        lastName: "",
        phone: "",
        relationship: "",
      });
    } catch (error) {
      console.error("Failed to add family contact:", error);
      setFamilyContactsError(error.message || "Failed to add family contact.");
    } finally {
      setAddingFamilyContact(false);
    }
  };

  const handleRemoveFamilyContact = async (contactId) => {
    if (removingFamilyContactId) return;

    try {
      setRemovingFamilyContactId(contactId);
      setFamilyContactsError("");

      await deleteFamilyContact(contactId);

      // Refresh the list from the backend
      const response = await getMyFamilyContacts();
      setFamilyContacts(response.data || []);
    } catch (error) {
      console.error("Failed to remove family contact:", error);
      setFamilyContactsError(
        error.message || "Failed to remove family contact.",
      );
    } finally {
      setRemovingFamilyContactId(null);
    }
  };

  const officialOfficerUserIds = officialOfficers.map(
    (officer) => officer.user?.id,
  );

  const savedRecipientIds = savedRecipients.map(
    (preference) => preference.recipientUserId,
  );

  const selectableResidents = availableResidents.filter((resident) => {
    return (
      resident.id !== user?.id &&
      resident.status === "ACTIVE" &&
      !officialOfficerUserIds.includes(resident.id) &&
      !savedRecipientIds.includes(resident.id)
    );
  });

  const handleAddRecipient = async () => {
    if (!selectedResidentId || savingRecipient) return;

    try {
      setSavingRecipient(true);
      setRecipientsError("");

      await addEmergencyRecipientPreference(selectedResidentId);

      // Refresh the saved preferences from the backend
      const response = await getEmergencyRecipientPreferences();
      setSavedRecipients(response.data || []);
      setSelectedResidentId("");
    } catch (error) {
      console.error("Failed to add recipient:", error);
      setRecipientsError(error.message || "Failed to add recipient.");
    } finally {
      setSavingRecipient(false);
    }
  };

  const handleRemoveRecipient = async (recipientUserId) => {
    if (removingRecipientId) return;
    try {
      setRemovingRecipientId(recipientUserId);
      setRecipientsError("");

      await removeEmergencyRecipientPreference(recipientUserId);

      // Refresh the saved preferences from the backend
      const response = await getEmergencyRecipientPreferences();
      setSavedRecipients(response.data || []);
    } catch (error) {
      console.error("Failed to remove recipient:", error);
      setRecipientsError(error.message || "Failed to remove recipient.");
    } finally {
      setRemovingRecipientId(null);
    }
  };

  const requiredOfficerPositions = [
    { type: "CHAIRMAN", label: "Chairman" },
    { type: "ADMIN_STAFF", label: "Admin Staff" },
    { type: "SECURITY_OFFICER", label: "Security Officer" },
  ];

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Emergency Contacts</h1>

        <p className="mt-2 text-gray-600">
          Manage the people who can receive your emergency alerts.
        </p>
      </div>

      {/* Official community officers */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Official Community Officers
          </h2>

          <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Read only
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          These officers are automatically included in your emergency alerts.
        </p>

        <div className="mt-5 divide-y divide-gray-100">
          {officersLoading ? (
            <p className="py-4 text-sm text-gray-500">
              Loading community officers...
            </p>
          ) : officersError ? (
            <p className="py-4 text-sm text-red-600">{officersError}</p>
          ) : (
            <div className="mt-5 divide-y divide-gray-100">
              {requiredOfficerPositions.map((position) => {
                const officer = officialOfficers.find(
                  (item) => item.responderType === position.type,
                );

                const officerName = officer?.user
                  ? `${officer.user.firstName || ""} ${
                      officer.user.lastName || ""
                    }`.trim()
                  : "";

                return (
                  <div
                    key={position.type}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {position.label}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {officerName || "Not assigned yet"}
                      </p>
                    </div>

                    <span className="text-xs text-gray-500">
                      Automatically included
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Additional community recipients */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          My Additional Community Recipients
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Choose active residents in your community to receive your emergency
          alerts in addition to the official officers.
        </p>

        <div className="mt-5">
          {recipientsLoading ? (
            <p className="text-sm text-gray-500">Loading your recipients...</p>
          ) : (
            <>
              {recipientsError && (
                <p className="mb-4 text-sm text-red-600">{recipientsError}</p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedResidentId}
                  onChange={(event) =>
                    setSelectedResidentId(event.target.value)
                  }
                  disabled={selectableResidents.length === 0 || savingRecipient}
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select a resident</option>

                  {selectableResidents.map((resident) => (
                    <option key={resident.id} value={resident.id}>
                      {resident.firstName} {resident.lastName}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddRecipient}
                  disabled={!selectedResidentId || savingRecipient}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingRecipient ? "Adding..." : "Add Recipient"}
                </button>
              </div>

              {selectableResidents.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  No additional residents are available to select.
                </p>
              )}

              <div className="mt-6">
                <h3 className="font-medium text-gray-800">Saved Recipients</h3>

                {savedRecipients.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-500">
                    You haven't added any additional recipients yet.
                  </p>
                ) : (
                  <div className="mt-3 divide-y divide-gray-100">
                    {savedRecipients.map((preference) => {
                      const recipient = preference.recipientUser;

                      if (!recipient) return null;

                      return (
                        <div
                          key={preference.id}
                          className="flex items-center justify-between gap-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {recipient.firstName} {recipient.lastName}
                            </p>
                            {recipient.phone && (
                              <p className="mt-1 text-sm text-gray-500">
                                {recipient.phone}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveRecipient(preference.recipientUserId)
                            }
                            disabled={removingRecipientId !== null}
                            className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            {removingRecipientId === preference.recipientUserId
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Family contacts */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          My Family Contacts
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Manage the family contacts you may want to notify during an emergency.
        </p>

        <div className="mt-5">
          {familyContactsError && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {familyContactsError}
            </p>
          )}

          <form onSubmit={handleAddFamilyContact} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="familyFirstName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <input
                  id="familyFirstName"
                  name="firstName"
                  type="text"
                  value={familyContactForm.firstName}
                  onChange={(event) =>
                    setFamilyContactForm((currentForm) => ({
                      ...currentForm,
                      firstName: event.target.value.toUpperCase(),
                    }))
                  }
                  required
                  maxLength={50}
                  autoComplete="given-name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="First name"
                />
              </div>

              <div>
                <label
                  htmlFor="familyLastName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <input
                  id="familyLastName"
                  name="lastName"
                  type="text"
                  value={familyContactForm.lastName}
                  onChange={(event) =>
                    setFamilyContactForm((currentForm) => ({
                      ...currentForm,
                      lastName: event.target.value.toUpperCase(),
                    }))
                  }
                  required
                  maxLength={50}
                  autoComplete="family-name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Last name"
                />
              </div>

              <div>
                <label
                  htmlFor="familyPhone"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <input
                  id="familyPhone"
                  name="phone"
                  type="tel"
                  value={familyContactForm.phone}
                  onChange={(event) =>
                    setFamilyContactForm((currentForm) => ({
                      ...currentForm,
                      phone: event.target.value.toUpperCase(),
                    }))
                  }
                  required
                  autoComplete="tel"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Contact phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="familyRelationship"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Relationship
                </label>
                <input
                  id="familyRelationship"
                  name="relationship"
                  type="text"
                  value={familyContactForm.relationship}
                  onChange={(event) =>
                    setFamilyContactForm((currentForm) => ({
                      ...currentForm,
                      relationship: event.target.value.toUpperCase(),
                    }))
                  }
                  required
                  maxLength={50}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Spouse, sibling, friend"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={addingFamilyContact || familyContacts.length >= 5}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addingFamilyContact ? "Adding Contact..." : "Add Family Contact"}
            </button>

            <p className="text-xs text-gray-500">
              You can save up to 5 family contacts.
            </p>
          </form>

          <div className="mt-8">
            <h3 className="font-medium text-gray-800">
              Saved Family Contacts ({familyContacts.length}/5)
            </h3>

            {familyContactsLoading ? (
              <p className="mt-3 text-sm text-gray-500">
                Loading family contacts...
              </p>
            ) : familyContacts.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">
                You haven't added any family contacts yet.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-gray-100">
                {familyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {contact.relationship}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {contact.phone}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFamilyContact(contact.id)}
                      disabled={removingFamilyContactId !== null}
                      className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingFamilyContactId === contact.id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmergencyContacts;
