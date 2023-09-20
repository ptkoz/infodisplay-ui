/**
 * Wraps promise, so it can be safely put into background, to prevent floating promise errors.
 */
const detachBackgroundTask = function <T>(promise: Promise<T>): void {
    promise.catch((error) => {
        console.error(error);
    });
};

export default detachBackgroundTask;
