"use client";

import { useEffect, useMemo, useRef } from "react";
import { DomEvent, divIcon, type LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import styles from "./DiagnosisMap.module.css";

type Locale = "sk" | "en";
type ProviderType = "psychologist" | "psychiatrist" | "support" | "neurologist" | "therapist";
type Coordinates = [number, number];
type Provider = { id: string; city: string | null; title: string; providerType: ProviderType; coordinates: Coordinates | null };

const mapBounds: [[number, number], [number, number]] = [[47.65, 16.65], [49.75, 22.65]];

function FocusSelectedProvider({ coordinates }: { coordinates: Coordinates | null }) {
  const map = useMap();
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (coordinates) map.flyTo(coordinates, Math.max(map.getZoom(), 15), { duration: 0.65 });
  }, [coordinates, map]);

  return null;
}

function ZoomControls({ labels }: { labels: { zoomIn: string; zoomOut: string; reset: string } }) {
  const map = useMap();
  const controls = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (controls.current) {
      DomEvent.disableClickPropagation(controls.current);
      DomEvent.disableScrollPropagation(controls.current);
    }
  }, []);

  const changeZoom = (direction: 1 | -1) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const nextZoom = map.getZoom() + direction * 0.5;
    map.setZoom(Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), nextZoom)), { animate: true });
  };

  return (
    <div ref={controls} className={styles.leafletControls} aria-label={labels.zoomIn}>
      <button type="button" aria-label={labels.zoomIn} onClick={changeZoom(1)}>+</button>
      <button type="button" aria-label={labels.zoomOut} onClick={changeZoom(-1)}>−</button>
      <button type="button" aria-label={labels.reset} onClick={(event) => { event.preventDefault(); event.stopPropagation(); map.flyTo([48.7, 19.5], 7.2, { duration: 0.65 }); }}>↺</button>
    </div>
  );
}

export default function ProviderMap({
  providers,
  selectedId,
  locale,
  onSelect,
  labels,
}: {
  providers: Provider[];
  selectedId?: string;
  locale: Locale;
  onSelect: (id: string) => void;
  labels: { zoomIn: string; zoomOut: string; reset: string; attribution: string; choose: string };
}) {
  const locations = useMemo(() => {
    const groups = new Map<string, { city: string; coordinates: Coordinates; providers: Provider[] }>();
    providers.forEach((provider) => {
      if (!provider.city || !provider.coordinates) return;
      const key = `${provider.coordinates[0].toFixed(5)},${provider.coordinates[1].toFixed(5)}`;
      const current = groups.get(key) ?? { city: provider.city, coordinates: provider.coordinates, providers: [] };
      current.providers.push(provider);
      groups.set(key, current);
    });
    return [...groups.values()];
  }, [providers]);
  const selectedCoordinates = providers.find((provider) => provider.id === selectedId)?.coordinates ?? null;

  return (
    <MapContainer
      className={styles.leafletMap}
      center={[48.7, 19.5]}
      zoom={7.2}
      minZoom={6.5}
      maxZoom={18}
      maxBounds={mapBounds}
      maxBoundsViscosity={0.78}
      zoomSnap={0.25}
      zoomDelta={0.5}
      wheelPxPerZoomLevel={100}
      zoomAnimation
      fadeAnimation
      markerZoomAnimation
      scrollWheelZoom
      doubleClickZoom
      touchZoom
      attributionControl={false}
      zoomControl={false}
      aria-label={locale === "sk" ? "Interaktívna mapa pracovísk a odborníkov na Slovensku" : "Interactive map of providers and specialists in Slovakia"}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={20}
        attribution={labels.attribution}
      />
      <FocusSelectedProvider coordinates={selectedCoordinates} />
      <ZoomControls labels={labels} />
      {locations.map(({ city, coordinates, providers: locationProviders }) => {
        const selectedInCity = locationProviders.some((provider) => provider.id === selectedId);
        const icon = divIcon({
          className: styles.leafletIcon,
          html: `<span class="${styles.mapPin} ${selectedInCity ? styles.mapPinSelected : ""}"><span>${locationProviders.length}</span></span>`,
          iconSize: [40, 40],
          // The rotated teardrop extends 8px below its 40px box; anchor to its tip.
          iconAnchor: [20, 48],
        });
        return (
          <Marker key={`${coordinates[0]}-${coordinates[1]}`} position={coordinates as LatLngExpression} icon={icon} eventHandlers={{ click: () => onSelect(locationProviders[0].id) }}>
            <Popup className={styles.leafletPopup}>
              <strong>{city}</strong>
              <span className={styles.popupCaption}>{labels.choose}</span>
              <div className={styles.popupProviders}>
                {locationProviders.map((provider) => (
                  <button key={provider.id} type="button" onClick={() => onSelect(provider.id)} aria-current={provider.id === selectedId ? "true" : undefined}>
                    <span className={`${styles.typeDot} ${styles[`type-${provider.providerType}`]}`} aria-hidden="true" />
                    {provider.title}
                  </button>
                ))}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
