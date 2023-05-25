import React, { useContext, useState } from 'react';
import classes from './SelectCity.module.css';
import { useNavigate } from 'react-router-dom';

const SelectCity = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');

  const submitHandler = e => {
    e.preventDefault();
    navigate(`/${city}`);
  };

  return (
    <div className={classes.selectContainer}>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <button>Get Weather</button>
      </form>
    </div>
  );
};

export default SelectCity;
