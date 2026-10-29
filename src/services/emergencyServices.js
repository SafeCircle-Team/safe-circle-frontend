import api from "./api";

export const getMyEmergencies = async () => {
    return await api("/emergencies/my", {
        method: "GET"
    });
}

export const createEmergency = async (emergencyData) => {
  return await api("/emergencies", {
    method: "POST",
    body:emergencyData,
  });
};

export const getEmergencies = async () => {
  return await api("/emergencies", {
    method: "GET",
  });
  
};

export const updateEmergencyStatus = async (id, status) => {
  return await api(`/emergencies/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
};

export const updateEmergencyPriority = async (id, priority) => {
  return await api(`/emergencies/${id}/priority`, {
    method: "PATCH",
    body: { priority },
  });
};

export const updateEmergencyResponse = async (id, response) => {
  return await api(`/emergencies/${id}/response`, {
    method: "PATCH",
    body: { response },
  });
};