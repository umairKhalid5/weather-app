import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import classes from './SelectCity.module.css';
import { useNavigate } from 'react-router-dom';
import FeaturedCities from './FeaturedCities';
import { useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const key = import.meta.env.VITE_OPEN_CAGE_DATA_KEY;

const SelectCity = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  const getWeatherRef = useRef();

  const [autoLocate, setAutoLocate] = useState(false);
  const [coords, setCoords] = useState(null);

  const navigate = useNavigate();
  const [city, setCity] = useState('');

  const getLocation = () => {
    if (!navigator.geolocation) return console.log('browser not supported');

    navigator.geolocation.getCurrentPosition(
      position => {
        setCoords({
          lat: position?.coords?.latitude,
          lon: position?.coords?.longitude,
        });
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
      setCity('');
      const details = data?.results[0]?.components;
      const district = details?.district?.replace('District', '').trim();
      const city = details?.city;
      const town = details?.town;
      const county = details?.county;
      const subdistrict = details?.subdistrict?.replace('Tehsil', '').trim();
      const location = subdistrict ?? county ?? town ?? city ?? district;
      // console.log(location);

      navigate(`/weather/${lat}+${lon}/${location.toLowerCase()}`);
    };

    try {
      getCityName(coords?.lat, coords?.lon);
    } catch (err) {
      console.log(err);
    }
  }, [coords, autoLocate]);

  const submitHandler = e => {
    e.preventDefault();
    navigate(`/weather/${city}`);
  };

  const cityVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.3, duration: 0.6 },
    },
    exit: {
      y: '110vh',
      transition: { ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      className={classes.selectContainer}
      variants={cityVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ transformOrigin: 'top' }}
    >
      <div className={classes.formWrapper}>
        <form onSubmit={submitHandler}>
          <div className="inputContainer b-bottom">
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
            <i onClick={() => getWeatherRef.current.click()}>
              <SearchIcon />
            </i>
          </div>
          <button
            ref={getWeatherRef}
            disabled={!city.trim()}
            className="getWeatherBtn"
          >
            Get Weather
          </button>
        </form>
        <button
          className={`getWeatherBtn ${classes.autoLocate}`}
          onClick={() => setAutoLocate(true)}
        >
          Auto Locate
        </button>
      </div>

      <FeaturedCities />
    </motion.div>
  );
};

export default SelectCity;
