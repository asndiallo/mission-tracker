"use client";

export const registerServiceWorker = async (): Promise<void> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.log("Service workers are not supported");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    console.log("Service Worker registered successfully:", registration);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every minute

    // Listen for updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New service worker available
            console.log("New service worker available");

            // Optionally notify the user about the update
            if (confirm("A new version is available. Reload to update?")) {
              newWorker.postMessage({ type: "SKIP_WAITING" });
              window.location.reload();
            }
          }
        });
      }
    });

    // Handle controller change
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("Service worker controller changed");
    });
  } catch (error) {
    console.error("Service Worker registration failed:", error);
  }
};

export const unregisterServiceWorker = async (): Promise<void> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.unregister();
    console.log("Service Worker unregistered");
  } catch (error) {
    console.error("Service Worker unregistration failed:", error);
  }
};
