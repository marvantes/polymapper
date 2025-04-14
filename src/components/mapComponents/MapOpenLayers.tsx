import React, { useRef, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import { Draw, Modify } from "ol/interaction";
import { SketchCoordType } from "ol/interaction/Draw";
import Feature from "ol/Feature";
import { LineString, SimpleGeometry } from "ol/geom";
import { MapOpenLayersProps } from "../../interfaces/MapOpenLayersProps";
import useNavigationStore from "../../hooks/useNavigationStore";
import useMapStore from "../../hooks/useMapStore"; // Importuj náš nový store
import "ol/ol.css";
import "../../styles/MapOpenLayers.less";

const MapOpenLayers: React.FC<MapOpenLayersProps> = ({
  center = [0, 0],
  zoom = 10,
}) => {
  const {
    isSaving,
    isDrawingEnabled,
    isEditEnabled,
    setDrawingEnabled,
    setSaving,
    setEditEnabled,
    setDrawn,
  } = useNavigationStore();

  const {
    vectorSource,
    map,
    draw,
    modify,
    currentFeature,
    setMap,
    setDraw,
    setModify,
    setCurrentFeature,
    resetMapStore,
  } = useMapStore();

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const newMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSource,
        }),
      ],
      view: new View({
        center: center,
        zoom: zoom,
      }),
    });

    setMap(newMap);

    return () => {
      newMap.dispose();
      setMap(null);
      resetMapStore();
    };
  }, []);

  useEffect(() => {
    if (map) {
      map.getView().setCenter(center);
      map.getView().setZoom(zoom);
    }
  }, [center, zoom, map]);

  useEffect(() => {
    if (map) {
      map.getInteractions().forEach((interaction: any) => {
        if (interaction instanceof Draw || interaction instanceof Modify) {
          map.removeInteraction(interaction);
        }
      });

      if (isDrawingEnabled || isEditEnabled) {
        if (!currentFeature) {
          const newFeature = new Feature({
            geometry: new LineString([]),
          });
          vectorSource.addFeature(newFeature);
          setCurrentFeature(newFeature);
        }

        console.log(currentFeature);

        if (isEditEnabled) {
          const newModify = new Modify({
            source: vectorSource,
          });
          map.addInteraction(newModify);
          setModify(newModify);
        } else {
          const newDraw = new Draw({
            source: vectorSource,
            type: "LineString",
            geometryFunction: (
              coordinates: SketchCoordType,
              geometry?: SimpleGeometry
            ) => {
              if (geometry) {
                (geometry as LineString).setCoordinates(
                  coordinates as number[][]
                );
                return geometry;
              } else {
                return new LineString(coordinates as number[][]);
              }
            },
          });
          map.addInteraction(newDraw);
          setDraw(newDraw);

          newDraw.on("drawend", () => {
            setDrawn(true);
            setSaving(true);
          });
        }
      }
    }
  }, [
    isDrawingEnabled,
    isEditEnabled,
    map,
    vectorSource,
    setCurrentFeature,
    setDraw,
    setModify,
  ]);

  useEffect(() => {
    if (map && draw && isSaving) {
      setDrawingEnabled(false);
      setSaving(false);
      setEditEnabled(false);

      map.removeInteraction(draw);
      if (modify) map.removeInteraction(modify);
    }
  }, [
    isSaving,
    map,
    draw,
    modify,
    setDrawingEnabled,
    setSaving,
    setEditEnabled,
    setDraw,
    setModify,
  ]);

  return <div ref={mapRef} className="map-container" />;
};

export default MapOpenLayers;
