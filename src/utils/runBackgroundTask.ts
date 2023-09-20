import detachBackgroundTask from "./detachBackgroundTask.ts";

/**
 * Takes an async function, executes it immediately and detaches the promise returned
 */
const runBackgroundTask = function <T>(task: () => Promise<T>): void {
    detachBackgroundTask(task());
};

export default runBackgroundTask;
