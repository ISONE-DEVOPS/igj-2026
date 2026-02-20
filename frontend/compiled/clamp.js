export const clamp = (num, lower, upper) => {
    num = num <= upper ? num : upper;
    num = num >= lower ? num : lower;
    return num;
};
