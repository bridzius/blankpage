export const sortCompare = (a: number, b: number): number => {
    if (a < b) {
        return 1;
    }
    if (b > a) {
        return -1;
    }
    return 0;
};
