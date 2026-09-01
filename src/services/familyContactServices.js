import api from "./api";

export const getMyFamilyContacts = async () => {
    return await api("/familyContacts/", {
        method: "GET",
    });
};

