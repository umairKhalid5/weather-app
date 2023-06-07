import React from 'react';
import classes from './NotFound.module.css';
import { Link } from 'react-router-dom';

const NotFound = ({ msg }) => {
  return (
    <div className={classes.container}>
      <p>{msg ?? 'Location Not Found 😞'}</p>
      {msg && <span>Please try entering a location manually</span>}
      <Link to="/">
        <button className="getWeatherBtn">Search Again</button>
      </Link>
    </div>
  );
};

export default NotFound;
