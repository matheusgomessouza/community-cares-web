"use client";

import React, { useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface MapPickerComponentProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.75rem",
};

const defaultCenter = {
  lat: -23.5505,
  lng: -46.6333,
};

export function MapPickerComponent({
  onLocationSelect,
  initialLat,
  initialLng,
}: MapPickerComponentProps) {
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null,
  );

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        onLocationSelect(lat, lng);
      }
    },
    [onLocationSelect],
  );

  const center = markerPosition || defaultCenter;

  return (
    <div className="w-full mb-10">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </LoadScript>
      <p className="text-gray text-sm mt-2 text-center">
        Click on the map to set the location
      </p>
    </div>
  );
}
