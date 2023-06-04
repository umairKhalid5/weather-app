import React from 'react';
import { Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';

const MapsChild = ({ position, cities, citiesWeather, curr }) => {
  const myIcon = new L.Icon({
    iconUrl: curr?.icon,
    // iconRetinaUrl: iconIs,
    iconSize: [50, 50],
    iconAnchor: [32, 50],
  });

  return (
    <div>
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}
      {/* <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
      /> */}
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>'
        url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
      />
      <Marker position={position} icon={myIcon}>
        <Popup>
          <span className="capital">
            {curr?.temp}
            {' - '}
            {curr?.desc}
          </span>
        </Popup>
      </Marker>

      {citiesWeather &&
        cities.length === citiesWeather.length &&
        cities.map((city, idx) => (
          <Marker
            key={idx}
            position={[city.latitude, city.longitude]}
            icon={
              new L.Icon({
                iconUrl: `https://openweathermap.org/img/wn/${citiesWeather[idx]?.weather[0]?.icon}.png`,
                // iconRetinaUrl: iconIs,
                iconSize: [50, 50],
                iconAnchor: [32, 45],
              })
            }
          >
            <Popup>
              <span className="capital">
                {citiesWeather[idx]?.temp.toFixed(1)}°{' - '}
                {citiesWeather[idx]?.weather[0]?.description}
              </span>
            </Popup>
          </Marker>
        ))}
    </div>
  );
};

export default MapsChild;

// 32.9306752,72.802182
