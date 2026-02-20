let handle;
export const cancel = () => {
    if (handle) {
        window.cancelAnimationFrame(handle);
    }
};
export const timeout = (callback, delay) => {
    let deltaTime;
    let start;
    const frame = (time) => {
        start = start || time;
        deltaTime = time - start;
        if (deltaTime > delay) {
            callback();
            return;
        }
        handle = window.requestAnimationFrame(frame);
    };
    handle = window.requestAnimationFrame(frame);
};
