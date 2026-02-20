let isRunning = false;
let pending = [];
const next = () => {
    isRunning = true;
    const cb = pending.shift();
    if (cb) {
        return cb(next);
    }
    isRunning = false;
};
export const clear = () => {
    isRunning = false;
    pending = [];
};
export const queue = (cb) => {
    pending.push(cb);
    if (!isRunning && pending.length === 1) {
        next();
    }
};
