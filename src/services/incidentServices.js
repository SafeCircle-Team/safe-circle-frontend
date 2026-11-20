import api from "./api";

export const getIncidents = async () => {
  return await api("/incidents", {
    method: "GET",
  });
};

export const getMyIncidents = async () => {
  return await api("/incidents/my", {
    method: "GET",
  });
};

export const createIncident = async (incidentData) => {
  return await api("/incidents", {
    method: "POST",
    body: incidentData,
  });
};

export const updateIncidentStatus = async (id, status) => {
  return await api(`/incidents/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
};
