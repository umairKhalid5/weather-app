import React from 'react';
import { Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import iconIs from '../assets/icons/storm.png';

const MapsChild = ({ position, icon }) => {
  console.log(position);
  const myIcon = new L.Icon({
    iconUrl: `https://openweathermap.org/img/wn/${icon}.png`,
    // iconRetinaUrl: iconIs,
    iconSize: [50, 50],
    iconAnchor: [32, 45],
  });

  return (
    <div>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={myIcon}>
        <Popup>current</Popup>
      </Marker>

      <Marker position={[33.6007, 73.0679]} icon={myIcon}>
        <Popup>pindi</Popup>
      </Marker>
      {/* //? Jhelum */}
      <Marker position={[32.9331, 73.7264]} icon={myIcon}>
        <Popup>Jhelum</Popup>
      </Marker>
      {/* //? Taxila */}
      <Marker position={[33.7476, 72.8075]} icon={myIcon}>
        <Popup>Taxila</Popup>
      </Marker>
    </div>
  );
};

export default MapsChild;

// 32.9306752,72.802182
