import React, { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

import MapsChild from './MapsChild';
import { useParams } from 'react-router-dom';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_GEO_CITIES_KEY,
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
  },
};
const key = import.meta.env.VITE_MOVIE_API_KEY;

const Maps = ({ coords, icon, curr }) => {
  const position = [coords?.lat, coords?.lon];

  const [cities, setCities] = useState([]);
  const [citiesWeather, setCitiesWeather] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const getCities = async (lat, long) => {
      setIsLoading(true);
      const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?location=${lat}${
        long > 0 ? '%2B' + long : long
      }&radius=100&distanceUnit=MI&minPopulation=10000&limit=3`;
      const res = await fetch(url, options);
      const data = await res.json();
      if (!data) return;
      setCities(
        data?.data?.filter(
          city =>
            !city?.name
              ?.toLowerCase()
              .includes(params?.city.toLocaleLowerCase())
        )
      );
      const allCoords = data?.data
        ?.filter(
          city =>
            !city?.name
              ?.toLowerCase()
              .includes(params?.city.toLocaleLowerCase())
        )
        .map(city => {
          return {
            lat: city.latitude,
            lon: city.longitude,
          };
        });
      if (allCoords.length > 0) {
        allCoords.forEach((coord, idx) =>
          setTimeout(() => {
            getCitiesWeather(coord.lat, coord.lon);
            if (idx === allCoords.length - 1) setIsLoading(false);
          }, idx * 550)
        );
      } else {
        setIsLoading(false);
      }
    };

    const getCitiesWeather = async (lat, lon) => {
      const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${key}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data) return;
      setCitiesWeather(prev => prev.concat([data?.current]));
    };

    try {
      getCities(coords?.lat, coords?.lon);
    } catch (err) {
      console.log(err);
    }
  }, [coords]);

  if (isLoading) return;

  // console.log(cities, citiesWeather);

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
        zoom={10}
        style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
        scrollWheelZoom={false}
      >
        <MapsChild
          position={coords}
          icon={icon}
          cities={cities}
          citiesWeather={citiesWeather}
          curr={curr}
        />
      </MapContainer>
    </motion.div>
  );
};

export default Maps;
