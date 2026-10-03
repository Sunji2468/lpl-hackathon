let queue = Promise.resolve();
let lastRequestAt = 0;

export function scheduleBedrock(task) {
  const run = async () => {
    const elapsed = Date.now() - lastRequestAt;
    const minimumDelay = 1100;

    if (elapsed < minimumDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, minimumDelay - elapsed),
      );
    }

    lastRequestAt = Date.now();

    return task();
  };

  const result = queue.then(run, run);
  queue = result.catch(() => {});

  return result;
}