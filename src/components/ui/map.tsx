"use client";
import neighborhoods from "@/data/neighborhood_names.json";

import React, { useState, useEffect, useCallback } from "react";
import Map, { Source, Layer, MapRef } from "react-map-gl";

import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { useNeighborhood } from "../providers/neighborhood-provider";

// import the neighborhood names json
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// englewood, little italy, chinatown, pilson, lakeview, south chicago, jefferson park

interface MapInfoProps {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

const MapInfo: React.FC<MapInfoProps> = ({
  latitude,
  longitude,
  zoom,
  pitch,
  bearing,
}) => {
  return (
    <div className="absolute bottom-0 left-0 bg-white bg-opacity-75 p-2 m-2 rounded shadow">
      <p className="text-sm">
        Lat: <span className={"font-semibold"}>{latitude.toFixed(4)}</span>,
        Lon: <span className={"font-semibold"}>{longitude.toFixed(4)}</span>
      </p>
      <p className="text-sm">
        Zoom: <span className={"font-semibold"}>{zoom.toFixed(2)}</span>, Pitch:{" "}
        <span className={"font-semibold"}>{pitch.toFixed(2)}</span>, Bearing:{" "}
        <span className={"font-semibold"}>{bearing.toFixed(2)}</span>
      </p>
    </div>
  );
};

type HoverInfo = {
  feature: any;
  x: number;
  y: number;
};

const newNeighborhoods = [
  "Englewood",
  "Little Italy, UIC",
  "Chinatown",
  "Pilsen",
  "Lake View",
  "South Chicago",
  "Jefferson Park",
];

const MapComponent: React.FC = () => {
  const { setNeighborhood } = useNeighborhood();
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<
    string | null
  >(null);
  const [hoveredNeighborhood, setHoveredNeighborhood] = useState<string | null>(
    null,
  );
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | undefined>();

  const [viewState, setViewState] = useState({
    latitude: 41.8548,
    longitude: -87.6414,
    zoom: 9.77,
    pitch: 50,
    bearing: 0,
  });
  const mapRef = React.useRef<MapRef>(null);

  const handleClick = (event: any) => {
    const feature = event.features && event.features[0];

    if (feature && feature.properties.pri_neigh) {
      setNeighborhood(feature.properties.pri_neigh);
      setSelectedNeighborhood(feature.properties.pri_neigh);
    } else {
      setNeighborhood(null);
      setSelectedNeighborhood(null);
    }
  };

  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    const layers = map.getStyle()?.layers;
    const labelLayerId = layers?.find(
      (layer) =>
        layer.type === "symbol" && layer.layout && layer.layout["text-field"],
    )?.id;

    map.addLayer(
      {
        id: "add-3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["*", ["get", "height"], 2], // Increased multiplier to make buildings bigger
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["*", ["get", "min_height"], 2], // Increased multiplier for base height
          ],
          "fill-extrusion-opacity": 0.6,
        },
      },
      labelLayerId,
    );
  }, []);

  const onHover = useCallback((event) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(
      hoveredFeature
        ? {
            feature: hoveredFeature,
            x,
            y,
          }
        : undefined,
    );

    if (hoveredFeature) {
      setHoveredNeighborhood(hoveredFeature.properties.pri_neigh);
    } else {
      setHoveredNeighborhood(null);
    }
  }, []);

  // Create a color scale
  const colorScale = scaleOrdinal(schemeCategory10).domain(newNeighborhoods);

  // Generate the paint property dynamically
  const paint = {
    "fill-color": [
      "case",
      ["==", ["get", "pri_neigh"], hoveredNeighborhood],
      "#ff0000", // Highlight color
      [
        "match",
        ["get", "pri_neigh"],
        ...newNeighborhoods.flatMap((neighborhood) => [
          neighborhood,
          colorScale(neighborhood),
        ]),
        "#ccc", // default color
      ],
    ],
    "fill-opacity": 0.8,
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "auto", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        minZoom={10.5}
        pitchWithRotate={true}
        maxZoom={20}
        interactiveLayerIds={["neighborhoods-layer"]}
        onClick={handleClick}
        ref={mapRef}
        onLoad={onMapLoad}
        onMouseMove={onHover}
      >
        {/* Add Source and Layer for neighborhoods here if needed */}
        <Layer
          id="HoverInfo"
          type="line"
          layout={{ "line-join": "round", "line-cap": "round" }}
          paint={{
            "line-color": "#000",
            "line-width": 2,
          }}
          source="neighborhoods"
        />

        <Source
          id="neighborhoods"
          type="geojson"
          data="/data/chicago-boundaries.geojson"
        >
          <Layer
            id="neighborhoods-layer"
            type="fill"
            source="neighborhoods"
            paint={paint}
          />
        </Source>

        {selectedNeighborhood && (
          <Layer
            id="selected-neighborhood-layer"
            type="line"
            source="neighborhoods"
            filter={["==", ["get", "pri_neigh"], selectedNeighborhood]}
            paint={{
              "line-color": "#0000ff",
              "line-width": 3,
            }}
          />
        )}
      </Map>
      <MapInfo
        latitude={viewState.latitude}
        longitude={viewState.longitude}
        zoom={viewState.zoom}
        pitch={viewState.pitch}
        bearing={viewState.bearing}
      />

      <div>
        {hoverInfo && (
          <div
            className="absolute z-10 p-2 bg-white rounded shadow pointer-events-none"
            style={{ left: hoverInfo.x, top: hoverInfo.y }}
          >
            <p className="text-sm font-semibold">
              {hoverInfo.feature.properties.pri_neigh}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
export { MapComponent, MapInfo };
