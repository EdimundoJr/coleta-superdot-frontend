export const stateWithGroupSample = (state: any): boolean => {
    if (!state) return false;
    if (typeof state !== "object") return false;
    if (typeof state.groupSelected !== "string") return false;
    return true;
};
