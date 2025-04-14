import { useState, useEffect } from "react";
import useMapStore from "../../hooks/useMapStore";
import { LineString } from "ol/geom";
import { fromLonLat, toLonLat } from "ol/proj";
import useNavigationStore from "../../hooks/useNavigationStore";
import Feature from "ol/Feature";
import { getLength } from "ol/sphere";
import { Tooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const DrawnLines = () => {
  const vectorSource = useMapStore((state) => state.vectorSource);
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [units, setUnits] = useState<"metricke" | "imperialni">("metricke");
  const [totalLength, setTotalLength] = useState<number>(0);
  const [pointDistances, setPointDistances] = useState<number[]>([]);
  const [unitsAngle, setUnitsAngle] = useState<"stupne" | "radiany">("stupne");
  const [angles, setAngles] = useState<number[]>([]);

  const { setSaving, setDrawn } = useNavigationStore();

  useEffect(() => {
    const handleSourceChange = () => {
      const features = vectorSource.getFeatures();
      if (features.length > 0) {
        const geometry = features[features.length - 1].getGeometry();
        if (geometry instanceof LineString) {
          const transformedCoords = geometry
            .getCoordinates()
            .map((coord) => toLonLat(coord));
          setCoordinates(transformedCoords);
          calculateLengthAndDistances(geometry);
        } else {
          setCoordinates([]);
          setTotalLength(0);
          setPointDistances([]);
          setAngles([]);
        }
      } else {
        setCoordinates([]);
        setTotalLength(0);
        setPointDistances([]);
        setAngles([]);
      }
    };

    vectorSource.on("addfeature", handleSourceChange);
    vectorSource.on("removefeature", handleSourceChange);
    vectorSource.on("changefeature", handleSourceChange);
    handleSourceChange();

    return () => {
      vectorSource.un("addfeature", handleSourceChange);
      vectorSource.un("removefeature", handleSourceChange);
      vectorSource.un("changefeature", handleSourceChange);
    };
  }, [vectorSource]);

  const calculateAngles = (coords: number[][]) => {
    const calculatedAngles: number[] = [];
    if (coords.length < 3) {
      setAngles([]);
      return;
    }

    for (let i = 1; i < coords.length - 1; i++) {
      const point1 = coords[i - 1];
      const point2 = coords[i];
      const point3 = coords[i + 1];

      const vector1 = [point2[0] - point1[0], point2[1] - point1[1]];
      const vector2 = [point3[0] - point2[0], point3[1] - point2[1]];

      const dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1];
      const magnitude1 = Math.sqrt(
        vector1[0] * vector1[0] + vector1[1] * vector1[1]
      );
      const magnitude2 = Math.sqrt(
        vector2[0] * vector2[0] + vector2[1] * vector2[1]
      );

      if (magnitude1 === 0 || magnitude2 === 0) {
        calculatedAngles.push(0);
        continue;
      }

      const angleRadians = Math.acos(dotProduct / (magnitude1 * magnitude2));
      const angleDegrees = (angleRadians * 180) / Math.PI;

      calculatedAngles.push(
        unitsAngle == "stupne" ? angleDegrees : angleRadians
      );
    }

    setAngles(calculatedAngles);
  };

  const calculateLengthAndDistances = (geometry: LineString) => {
    const transformedCoords = geometry
      .getCoordinates()
      .map((coord) => toLonLat(coord));
    setCoordinates(transformedCoords);

    let length = getLength(geometry); //v metrech příjde

    length = length / 1000;

    if (units == "imperialni") {
      length = length * 0.621371;
    }

    setTotalLength(length);

    const distances = [];
    for (let i = 0; i < transformedCoords.length - 1; i++) {
      const point1 = fromLonLat(transformedCoords[i]);
      const point2 = fromLonLat(transformedCoords[i + 1]);
      const line = new LineString([point1, point2]);
      let lineLength = getLength(line); //default vrací v metrech

      lineLength = lineLength / 1000; //prevod na km

      if (units == "imperialni") {
        lineLength = lineLength * 0.621371;
      }

      distances.push(lineLength);
    }
    setPointDistances(distances);
  };

  const handleCoordChange = (index: number, axis: number, value: string) => {
    const newCoordinates = [...coordinates];
    newCoordinates[index][axis] = parseFloat(value.replace(",", "."));
    setCoordinates(newCoordinates);

    const features = vectorSource.getFeatures();
    if (features.length > 0) {
      const geometry = features[features.length - 1].getGeometry();
      if (geometry instanceof LineString) {
        const transformedBack = newCoordinates.map((coord) =>
          fromLonLat(coord)
        );
        geometry.setCoordinates(transformedBack);
        calculateLengthAndDistances(geometry);
        calculateAngles(newCoordinates);
      }
    }
  };

  const addPoint = () => {
    const newCoord = [0, 0];
    const newCoordinates = [...coordinates, [...newCoord]];
    setCoordinates(newCoordinates);

    const features = vectorSource.getFeatures();
    if (features.length > 0) {
      const geometry = features[features.length - 1].getGeometry();
      if (geometry instanceof LineString) {
        const transformedBack = newCoordinates.map((coord) =>
          fromLonLat(coord)
        );
        geometry.setCoordinates(transformedBack);
        calculateLengthAndDistances(geometry);
        calculateAngles(newCoordinates);
      }
    } else {
      const transformedBack = newCoordinates.map((coord) => fromLonLat(coord));
      const newLineString = new LineString(transformedBack);
      const newFeature = new Feature({ geometry: newLineString });
      vectorSource.addFeature(newFeature);
      calculateLengthAndDistances(newLineString);
      calculateAngles(newCoordinates);
    }
    setDrawn(true);
    setSaving(true);
  };

  const removePoint = (index: number) => {
    const newCoordinates = coordinates.filter((_, i) => i !== index);
    setCoordinates(newCoordinates);

    const features = vectorSource.getFeatures();
    if (features.length > 0) {
      const geometry = features[features.length - 1].getGeometry();
      if (geometry instanceof LineString) {
        const transformedBack = newCoordinates.map((coord) =>
          fromLonLat(coord)
        );
        geometry.setCoordinates(transformedBack);
        calculateLengthAndDistances(geometry);
        calculateAngles(newCoordinates);
      }
    }
  };

  useEffect(() => {
    const features = vectorSource.getFeatures();
    if (features.length > 0) {
      const geometry = features[features.length - 1].getGeometry();
      if (geometry instanceof LineString) {
        calculateLengthAndDistances(geometry);
        calculateAngles(coordinates);
      }
    }
  }, [units, coordinates]);

  useEffect(() => {
    if (coordinates.length === 0) {
      vectorSource.clear();
      setDrawn(false);
      setSaving(false);
    }
  }, [coordinates, vectorSource, setDrawn, setSaving]);

  return (
    <>
      {angles && angles.length > 0 ? (
        <div className="button-angles">
          <h2>Svírané úhly</h2>
          <ul>
            {angles.map((angle, index) => (
              <li key={index}>
                <b>
                  BOD {index + 1}-{index + 2}-{index + 3}:
                </b>{" "}
                {angle.toFixed(2)}
                {unitsAngle == "stupne" ? "°" : " rad"}
              </li>
            ))}
          </ul>
          <div className="units-changer">
            <span>Jednotky:</span>
            <label>
              <input
                type="radio"
                name="unitsAngle"
                value={"stupne"}
                checked={unitsAngle == "stupne"}
                onChange={(e) =>
                  setUnitsAngle(e.target.value as "stupne" | "radiany")
                }
              />
              Stupně
            </label>
            <label>
              <input
                type="radio"
                name="unitsAngle"
                value={"radiany"}
                checked={unitsAngle == "radiany"}
                onChange={(e) =>
                  setUnitsAngle(e.target.value as "stupne" | "radiany")
                }
              />
              Radiány
            </label>
          </div>
        </div>
      ) : null}
      <div className="draw-lines">
        <div className="draw-lines-wrap">
          <h2>
            EDITACE POLYČÁRY{" "}
            <small>
              Celková délka: {totalLength.toFixed(2)}{" "}
              {units == "metricke" ? "km" : "mi"}
            </small>
          </h2>
          <div className="coords-list">
            {coordinates.map((coord, index) => (
              <div key={index}>
                <span>BOD {index + 1}</span>
                <div className="inputs">
                  <label>
                    <span>LAT:</span>
                    <input
                      type="number"
                      value={coord[1]}
                      onChange={(e) =>
                        handleCoordChange(index, 1, e.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>LON:</span>
                    <input
                      type="number"
                      value={coord[0]}
                      onChange={(e) =>
                        handleCoordChange(index, 0, e.target.value)
                      }
                    />
                  </label>
                </div>

                {index > 0 && (
                  <div className="distance-between">
                    {"Délka spojnice: "}
                    {pointDistances[index - 1]?.toFixed(2) || 0}{" "}
                    {units == "metricke" ? "km" : "mi"}
                  </div>
                )}

                <button
                  className="remove-point-button"
                  onClick={() => removePoint(index)}
                  data-tooltip-id="remove-point-tooltip"
                  data-tooltip-content={"Odebrat bod"}
                  data-tooltip-place="left">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
          </div>
          <div className="units-changer">
            <span>Jednotky:</span>
            <label>
              <input
                type="radio"
                name="units"
                value={"metricke"}
                checked={units == "metricke"}
                onChange={(e) =>
                  setUnits(e.target.value as "metricke" | "imperialni")
                }
              />
              Metrické
            </label>
            <label>
              <input
                type="radio"
                name="units"
                value={"imperialni"}
                checked={units == "imperialni"}
                onChange={(e) =>
                  setUnits(e.target.value as "metricke" | "imperialni")
                }
              />
              Imperiální
            </label>
          </div>
          <button className="add-point-button" onClick={addPoint}>
            Přidat bod
          </button>
          <Tooltip id="remove-point-tooltip" />
        </div>
      </div>
    </>
  );
};

export default DrawnLines;
