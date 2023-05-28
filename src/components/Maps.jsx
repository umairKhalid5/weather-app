import React, { useEffect } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import MapsChild from './MapsChild';

const url =
  'https://wft-geo-db.p.rapidapi.com/v1/geo/locations/51.5085-118.387099/nearbyCities';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '5c8d2488ccmsh8d348500874bcc6p14e2c6jsne5f20f854132',
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
  },
};

const Maps = ({ coords, icon }) => {
  // console.log(coords);

  const position = [coords?.lat, coords?.lon];

  return (
    <div
      style={{ margin: '1rem auto', width: 'min(1300px, 90%)', height: '100%' }}
    >
      <MapContainer
        dragging={false}
        center={position}
        zoom={8}
        style={{ width: '100%', height: '550px' }}
        scrollWheelZoom={false}
      >
        <MapsChild position={coords} icon={icon} />
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
      </MapContainer>
    </div>
  );
};

export default Maps;
