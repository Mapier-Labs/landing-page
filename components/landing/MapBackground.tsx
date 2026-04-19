"use client";

import { useEffect, useRef } from "react";

const CHICAGO: [number, number] = [41.8781, -87.6298];
const DEFAULT_ZOOM = 13;
const LEAFLET_VERSION = "1.9.4";
const LEAFLET_CSS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const LEAFLET_JS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;

type LeafletGlobal = {
  map: (el: HTMLElement, opts: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, opts: Record<string, unknown>) => { addTo: (m: LeafletMap) => void };
};

type LeafletMap = {
  setView: (center: [number, number], zoom: number, opts?: Record<string, unknown>) => void;
  remove: () => void;
};

declare global {
  interface Window {
    L?: LeafletGlobal;
  }
}

function loadLeaflet(): Promise<LeafletGlobal> {
  if (window.L) return Promise.resolve(window.L);

  if (!document.querySelector(`link[data-leaflet="1"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = LEAFLET_CSS;
    link.dataset.leaflet = "1";
    document.head.appendChild(link);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-leaflet="1"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L!));
      existing.addEventListener("error", () => reject(new Error("leaflet load failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.dataset.leaflet = "1";
    script.onload = () => resolve(window.L!);
    script.onerror = () => reject(new Error("leaflet load failed"));
    document.head.appendChild(script);
  });
}

function getUserLocation(): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("geolocation unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      reject,
      { timeout: 5000, maximumAge: 60 * 60 * 1000 }
    );
  });
}

export function MapBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | undefined;

    (async () => {
      try {
        const L = await loadLeaflet();
        if (cancelled || !containerRef.current) return;

        map = L.map(containerRef.current, {
          center: CHICAGO,
          zoom: DEFAULT_ZOOM,
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
          touchZoom: false,
          tap: false,
          zoomSnap: 0.25,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map);

        try {
          const coords = await getUserLocation();
          if (!cancelled && map) map.setView(coords, DEFAULT_ZOOM, { animate: true });
        } catch {
          // geolocation denied / unavailable — Chicago default already set
        }
      } catch {
        // leaflet failed to load — leave background empty
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return <div ref={containerRef} className="bg" aria-hidden />;
}
