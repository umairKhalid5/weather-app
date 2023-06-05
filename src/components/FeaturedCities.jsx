import React from 'react';
import classes from './SelectCity.module.css';
import { useGetCityDetailsQuery } from '../services/getWeatherapi';
import { Link } from 'react-router-dom';

const FeaturedCities = () => {
  const { data: londonDetails, isFetching: fetchingLondonDetails } =
    useGetCityDetailsQuery('london');
  const { data: newYorkDetails, isFetching: fetchingNewYorkDetails } =
    useGetCityDetailsQuery('new york');
  const { data: parisDetails, isFetching: fetchingParisDetails } =
    useGetCityDetailsQuery('paris');
  const { data: dubaiDetails, isFetching: fetchingDubaiDetails } =
    useGetCityDetailsQuery('dubai');
  const { data: istanbulDetails, isFetching: fetchingIstanbulDetails } =
    useGetCityDetailsQuery('istanbul');
  const { data: tokyoDetails, isFetching: fetchingTokyoDetails } =
    useGetCityDetailsQuery('tokyo');
  const { data: beijingDetails, isFetching: fetchingBeijingDetails } =
    useGetCityDetailsQuery('beijing');
  const { data: sydneyDetails, isFetching: fetchingSydneyDetails } =
    useGetCityDetailsQuery('sydney');

  if (
    fetchingLondonDetails ||
    fetchingNewYorkDetails ||
    fetchingParisDetails ||
    fetchingDubaiDetails ||
    fetchingIstanbulDetails ||
    fetchingTokyoDetails ||
    fetchingBeijingDetails ||
    fetchingSydneyDetails
  )
    return;

  const cities = [
    londonDetails,
    newYorkDetails,
    parisDetails,
    dubaiDetails,
    istanbulDetails,
    tokyoDetails,
    beijingDetails,
    sydneyDetails,
  ];

  return (
    <div className={classes.featured}>
      <h3>Around the World:</h3>
      <ul role="list">
        {cities.map((city, idx) => (
          <Link key={idx} to={`/${city?.name.toLowerCase()}`}>
            <li className="flex">
              <p>{city?.name}</p>
              <div className="flex">
                <img
                  src={`https://openweathermap.org/img/wn/${city?.weather[0]?.icon}.png`}
                  alt=""
                />
                <p>{city?.main?.temp.toFixed(1)}°C</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default FeaturedCities;
