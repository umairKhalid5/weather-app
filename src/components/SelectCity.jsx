import React, { useState } from 'react';
import { motion } from 'framer-motion';
import classes from './SelectCity.module.css';
import { useNavigate } from 'react-router-dom';
import FeaturedCities from './FeaturedCities';

const SelectCity = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  const navigate = useNavigate();
  const [city, setCity] = useState('');

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
      </form>

      <FeaturedCities />
    </motion.div>
  );
};

export default SelectCity;
