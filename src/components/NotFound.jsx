import React from 'react';
import classes from './NotFound.module.css';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className={classes.container}>
      <p>Location Not Found!</p>
      <Link to="/">
        <button>Search Again</button>
      </Link>
    </div>
  );
};

export default NotFound;
