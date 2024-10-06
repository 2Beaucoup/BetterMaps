"use client";
import normalizedFoodDesertnessScores from "@/lib/food-desert-metric";
import chicagoInternet from "@/data/chicago_internet.json";
import { scaleSequential } from "d3-scale";
import { interpolateBlues, interpolateReds } from "d3-scale-chromatic";
import React, { useState, useEffect, useCallback } from "react";
import Map, { Source, Layer, MapRef } from "react-map-gl";
import * as d3 from "d3";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { useNeighborhood } from "../providers/neighborhood-provider";
import { Toggle } from "./toggle";
import { Label } from "./label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "./separator";

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

// create a dictionary where neighborhood name is key and population is value
const neighborhoodPopulations: { [key: string]: number } = {};

for (const neighborhood in chicagoInternet) {
  neighborhoodPopulations[neighborhood.toLowerCase()] =
    chicagoInternet[neighborhood].total_pop;
}

const MapComponent: React.FC = () => {
  const { setNeighborhood } = useNeighborhood();
  const [visualizeDigitalDisparity, setVisualizeDigitalDisparity] =
    useState<boolean>(false);
  const [visualizeFoodDeserts, setVisualizeFoodDeserts] =
    useState<boolean>(false);
  const [internetData, setInternetData] = useState<{ [key: string]: number }>(
    {},
  );
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

  // color the neighborhoods based on the neighborhood's % of households with internet from chicago_internet.json
  // use the d3 color scale to color the neighborhoods

  // Create a color scale

  // Generate the paint property dynamically
  /*const paint = {
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
  };*/

  let max = 0;
  useEffect(() => {
    // Load the internet data
    const data = chicagoInternet.reduce((acc, item) => {
      acc[item.name] = item["hh_no_internet(%)"];
      if (item["hh_no_internet(%)"] > max) {
        max = item["hh_no_internet(%)"];
      }
      return acc;
    }, {});

    setInternetData(data);
  }, []);

  // Create a color scale based on the internet percentage
  const colorScale = scaleSequential(interpolateReds).domain([0, 25]); // Assuming the percentage ranges from 0 to 100

  const paintDigitalDisparity = {
    "fill-color": [
      "case",
      ["==", ["get", "pri_neigh"], hoveredNeighborhood],
      "#ff0000", // Highlight color
      [
        "match",
        ["get", "pri_neigh"],
        ...Object.keys(internetData).flatMap((neighborhood) => [
          neighborhood,
          colorScale(internetData[neighborhood]),
        ]),
        "#ccc", // default color
      ],
    ],
    "fill-opacity": 0.8,
  };

  // Create a color scale based on the normalized food desertness scores
  const foodDesertnessScores = normalizedFoodDesertnessScores;
  const colorScaleFoodDeserts = scaleSequential(interpolateBlues).domain([0, 100]);

  const paintFoodDeserts = {
    "fill-color": [
      "case",
      ["==", ["get", "pri_neigh"], hoveredNeighborhood],
      "#ff0000", // Highlight color
      [
        "match",
        ["get", "pri_neigh"],
        ...Object.keys(foodDesertnessScores).flatMap((neighborhood) => [
          neighborhood,
          colorScaleFoodDeserts(foodDesertnessScores[neighborhood]),
        ]),
        "#ccc", // default color
      ],
    ],
    "fill-opacity": 0.8,
  };

  // Generate legend items
  const legendItems = d3.range(0, 40, 5).map((value) => ({
    value,
    color: colorScale(value),
  }));
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
        interactiveLayerIds={["neighborhoods-layer", "neighborhoods-layer-2"]}
        onClick={handleClick}
        ref={mapRef}
        onLoad={onMapLoad}
        onMouseMove={onHover}
      >
        <Layer
            type="line"
            id="outline"
            source="neighborhoods"
            layout={{}}
            paint={{
              "line-color": "#000",
              "line-width": 2,
            }}
            />

{visualizeFoodDeserts && (
          <Source
            id="neighborhoods"
            type="geojson"
            data="/data/chicago-boundaries.geojson"
          >
            <Layer
            
              id="neighborhoods-layer-2"
              type="fill"
              source="neighborhoods"
              paint={paintFoodDeserts}
            />
          </Source>
        )}

        {visualizeDigitalDisparity && (
          <Source
            id="neighborhoods"
            type="geojson"
            data="/data/chicago-boundaries.geojson"
          >
            <Layer
              id="neighborhoods-layer"
              type="fill"
              source="neighborhoods"
              paint={paintDigitalDisparity}
            />
          </Source>
        )}



        {/* Add Source and Layer for neighborhoods here if needed */}
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

      <div className="absolute bottom-0 right-0 m-4 p-2 bg-white rounded shadow">
        <h4 className="text-sm font-semibold">Internet Percentage</h4>
        <div className="flex flex-col">
          {legendItems.map((item) => (
            <div key={item.value} className="flex items-center">
              <div
                className="w-4 h-4 mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        {hoverInfo && (
          <div
            className="absolute z-10 p-2 bg-white rounded shadow pointer-events-none"
            style={{ left: hoverInfo.x, top: hoverInfo.y }}
          >
            <p className="text-sm font-semibold">
              {hoverInfo.feature.properties.pri_neigh} (foodDesertnessScores:{" "}
              {
                foodDesertnessScores[
                  hoverInfo.feature.properties.pri_neigh.toLowerCase()
                ]
              }
              )
            </p>
          </div>
        )}
      </div>

      <div
        className={
          "bg-white rounded-lg p-4 absolute top-0 right-0 shadow m-2 flex flex-col justify-center gap-2"
        }
      >
        <div className={"flex items-start gap-2 justify-start"}>
          <Switch
            id="digital-disparity"
            checked={visualizeDigitalDisparity}
            onCheckedChange={(val) => setVisualizeDigitalDisparity(val)}
          />
          <Label htmlFor={"digital-disparity"}>
            Visualize Digital Disparity
          </Label>
        </div>

        <Separator />

        <div className={"flex items-start justify-start gap-2"}>
          <Switch
            id="food-deserts"
            checked={visualizeFoodDeserts}
            onCheckedChange={(val) => setVisualizeFoodDeserts(val)}
          />
          <Label htmlFor={"food-deserts"}>Visualize Food Deserts</Label>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
export { MapComponent, MapInfo };
