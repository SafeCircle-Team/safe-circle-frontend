import api from "./api";

export const getMyFamilyContacts = async () => {
    return await api("/familyContacts/", {
        method: "GET",
    });
};

export const createFamilyContact = async (contactData) => {
  return await api("/familyContacts/", {
    method: "POST",
    body: contactData,
  });
};

export const deleteFamilyContact = async (contactId) => {
  return await api(`/familyContacts/${contactId}`, {
    method: "DELETE",
  });
};
