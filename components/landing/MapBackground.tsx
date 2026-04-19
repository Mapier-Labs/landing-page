"use client";

import { useEffect, useRef } from "react";

const CHICAGO = { lat: 41.8781, lng: -87.6298 };
const DEFAULT_ZOOM = 13;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ saturation: 36 }, { color: "#333333" }, { lightness: 40 }] },
  { featureType: "all", elementType: "labels.text.stroke", stylers: [{ visibility: "on" }, { color: "#ffffff" }, { lightness: 16 }] },
  { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry.fill", stylers: [{ color: "#fefefe" }, { lightness: 20 }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }] },
  { featureType: "administrative", elementType: "labels.text", stylers: [{ visibility: "off" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }, { lightness: 20 }] },
  { featureType: "landscape.natural", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f5f5f5" }, { lightness: 21 }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#dedede" }, { lightness: 21 }] },
  { featureType: "road", elementType: "labels.text", stylers: [{ visibility: "off" }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }, { lightness: 17 }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 18 }] },
  { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 16 }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#f2f2f2" }, { lightness: 19 }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }, { lightness: 17 }] },
];

declare global {
  interface Window {
    __initGoogleMaps?: () => void;
  }
}

let googleMapsPromise: Promise<typeof google> | null = null;

function loadGoogleMaps(apiKey: string): Promise<typeof google> {
  if (typeof window !== "undefined" && window.google?.maps?.Map) {
    return Promise.resolve(window.google);
  }
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-gmaps="1"]`)) {
      const poll = setInterval(() => {
        if (window.google?.maps?.Map) {
          clearInterval(poll);
          resolve(window.google);
        }
      }, 50);
      return;
    }
    window.__initGoogleMaps = () => {
      delete window.__initGoogleMaps;
      resolve(window.google);
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&callback=__initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.dataset.gmaps = "1";
    script.onerror = () => reject(new Error("google maps load failed"));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function getUserLocation(): Promise<google.maps.LatLngLiteral> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("geolocation unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      reject,
      { timeout: 5000, maximumAge: 60 * 60 * 1000 }
    );
  });
}

export function MapBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn("[MapBackground] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set");
      return;
    }

    let cancelled = false;
    let map: google.maps.Map | undefined;

    (async () => {
      try {
        const g = await loadGoogleMaps(GOOGLE_MAPS_API_KEY);
        if (cancelled || !containerRef.current) return;

        map = new g.maps.Map(containerRef.current, {
          center: CHICAGO,
          zoom: DEFAULT_ZOOM,
          disableDefaultUI: true,
          gestureHandling: "none",
          keyboardShortcuts: false,
          clickableIcons: false,
          backgroundColor: "#f5f5f5",
          styles: MAP_STYLES,
        });

        try {
          const coords = await getUserLocation();
          if (!cancelled && map) map.panTo(coords);
        } catch {
          // geolocation denied / unavailable — Chicago default
        }
      } catch {
        // google maps failed to load — leave background empty
      }
    })();

    return () => {
      cancelled = true;
      map = undefined;
    };
  }, []);

  return (
    <div className="bg" aria-hidden>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
