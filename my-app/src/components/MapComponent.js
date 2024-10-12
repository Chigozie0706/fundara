import React, { useRef, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map({ latitude, longitude }) {
  const mapRef = useRef(null);
  const [viewport, setViewport] = useState({
    latitude: latitude,
    longitude: longitude,
    zoom: 10,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  return (
    <div
      className="text-white relative"
      style={{ height: "50%", width: "100%" }}
    >
      <ReactMapGL
        {...viewport}
        mapboxAccessToken="pk.eyJ1IjoiY2hpZ296aWUiLCJhIjoiY2tleTQ0YWRxM3hrYTJzbXFiMndoZ3pzdyJ9.RrGjafCoZTxzK7ReIqpYiw"
        onMove={(evt) => setViewport(evt.viewState)}
        ref={mapRef}
        minZoom={5}
        maxZoom={15}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <Marker latitude={latitude} longitude={longitude}>
          <img
            src="/Daco.png"
            alt="Location Icon"
            style={{ width: "24px", height: "24px" }}
          />
        </Marker>
      </ReactMapGL>
    </div>
  );
}
