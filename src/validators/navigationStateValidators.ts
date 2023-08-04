export const stateWithGroupSample = (state: any): boolean => {
    if (!state) return false;
    if (typeof state !== "object") return false;
    if (typeof state.groupSelected !== "string") return false;
    return true;
};

export const stateWithSample = (state: any): boolean => {
    if (!state) return false;
    if (typeof state !== "object") return false;
    if (typeof state.sample !== "object") return false;
    if (!state.sample._id) return false;
    if (!state.sample.researchCep) return false;
    return true;
};

export const stateWithNotification = (state: any): boolean => {
    if (!state) return false;
    if (typeof state !== "object") return false;
    if (typeof state.notification !== "object") return false;
    if (!state.notification.title) return false;
    if (!state.notification.description) return false;
    return true;
};
