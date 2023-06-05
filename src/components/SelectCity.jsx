import React, { useState } from 'react';
import { motion } from 'framer-motion';
import classes from './SelectCity.module.css';
import { useNavigate } from 'react-router-dom';
import FeaturedCities from './FeaturedCities';
import { useEffect } from 'react';
import { useGetCityWeatherQuery } from '../services/getWeatherapi';
import { skipToken } from '@reduxjs/toolkit/dist/query';

const key = import.meta.env.VITE_OPEN_CAGE_DATA_KEY;

const SelectCity = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  const [autoLocate, setAutoLocate] = useState(false);
  const [coords, setCoords] = useState(null);

  const navigate = useNavigate();
  const [city, setCity] = useState('');

  // const { data: cityWeather, isFetching: fetchingCityWeather } =
  //   useGetCityWeatherQuery(coords ?? skipToken);

  const getLocation = () => {
    if (!navigator.geolocation) return console.log('browser not supported');

    navigator.geolocation.getCurrentPosition(
      position => {
        setCoords({
          lat: position?.coords?.latitude,
          lon: position?.coords?.longitude,
        });
        // console.log(position);
      },
      error => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    if (!autoLocate) return;
    getLocation();
  }, [autoLocate]);

  useEffect(() => {
    if (!autoLocate || !coords) return;

    const getCityName = async (lat, lon) => {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${key}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data) return;
      // console.log(data?.results[0]?.components);
      const details = data?.results[0]?.components;
      const district = details?.district?.replace('District', '').trim();
      const city = details?.city;
      const town = details?.town;
      const county = details?.county;
      const subdistrict = details?.subdistrict?.replace('Tehsil', '').trim();
      const location = subdistrict ?? county ?? town ?? city ?? district;
      // console.log(location);

      navigate(`/${lat}+${lon}/${location.toLowerCase()}`);
    };

    try {
      getCityName(coords?.lat, coords?.lon);
    } catch (err) {
      console.log(err);
    }
  }, [coords, autoLocate]);

  // if (fetchingCityWeather) return;

  // console.log(cityWeather);

  const submitHandler = e => {
    e.preventDefault();
    navigate(`/${city}`);
  };

  return (
    <motion.div
      className={classes.selectContainer}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <button className="getWeatherBtn">Get Weather</button>
        <button className="getWeatherBtn" onClick={() => setAutoLocate(true)}>
          Auto Locate
        </button>
      </form>

      {/* <FeaturedCities /> */}
    </motion.div>
  );
};

export default SelectCity;
