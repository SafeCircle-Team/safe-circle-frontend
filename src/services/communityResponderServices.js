import api from "./api";

export const getCommunityResponders = async () => {
    return await api("/communityResponders/responders", {
        method: "GET",
    });
};

