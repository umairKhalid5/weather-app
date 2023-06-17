import React from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

import MapsChild from './MapsChild';

const Maps = ({ coords, curr }) => {
  const position = [coords?.lat, coords?.lon];

  return (
    <motion.div
      className="mapContainer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MapContainer
        dragging={false}
        center={position}
        zoom={12}
        style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
        scrollWheelZoom={false}
      >
        <MapsChild position={coords} curr={curr} />
      </MapContainer>
    </motion.div>
  );
};

export default Maps;
