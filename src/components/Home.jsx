import React, { useContext, useState } from 'react';
import classes from './Home.module.css';
import WeatherContext from '../store/weather-context';
import {
  useGetCityDetailsQuery,
  useGetCityWeatherQuery,
} from '../services/getWeatherapi';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useNavigate, useParams } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const params = useParams();

  const ctx = useContext(WeatherContext);
  const { formattedDate, windDirection, getTime } = ctx;

  const [searchTerm, setSearchTerm] = useState('');

  const date = new Date();
  const dateToUse = formattedDate(date);

  const submitHandler = e => {
    e.preventDefault();
    navigate(`/${searchTerm}`);
    setSearchTerm('');
  };

  const { data: cityDetails, isFetching: fetchingCityDetails } =
    useGetCityDetailsQuery(params?.city ?? skipToken);

  const { data: cityWeather, isFetching: fetchingCityWeather } =
    useGetCityWeatherQuery(cityDetails?.coord ?? skipToken);

  if (fetchingCityDetails || fetchingCityWeather) return;

  const hourly = cityWeather?.hourly?.slice(0, 24);
  console.log(hourly);

  const sunrise = getTime(cityWeather?.current?.sunrise);
  const sunset = getTime(cityWeather?.current?.sunset);

  const tempDifference =
    Math.floor(cityWeather?.daily[0]?.temp?.day) -
    Math.floor(cityWeather?.daily[0]?.temp?.night);

  return (
    <div
      className={classes.homeContainer}
      style={{
        backgroundImage: 'url(src/assets/cloudy.jpg)',
      }}
    >
      {/* //?Left */}
      <div className={`${classes.left} `}>
        <form className={classes.form} onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Enter city"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </form>

        <div className={classes.majorDetails}>
          <p className="flex">
            {cityWeather?.current?.temp.toFixed(1)}° <span>+/-</span>{' '}
            {tempDifference}
          </p>
          <p className="flex">
            Feels like: {cityWeather?.current?.feels_like.toFixed(1)}°
            <span>
              Wind: {windDirection(cityWeather?.current?.wind_deg)}{' '}
              {cityWeather?.current?.wind_speed.toFixed(1)}km/h
            </span>
          </p>
        </div>

        <div className={classes.graph}>Graph</div>

        <div className={classes.quality}>
          <h3>
            {cityDetails?.name}, {cityDetails?.sys?.country}
          </h3>
          <p>Sunrise: &nbsp;{sunrise}</p>
          <p>Sunset: &nbsp;{sunset}</p>
          <p>Humidity: &nbsp;{cityWeather?.current?.humidity}%</p>
          <p>Min: &nbsp;{cityWeather?.daily[0]?.temp?.max}°</p>
          <p>Max: &nbsp;{cityWeather?.daily[0]?.temp?.min}°</p>
          <p>UV Index: &nbsp;{cityWeather?.current?.uvi}</p>
        </div>
      </div>

      {/* //?Right */}
      <div className={`${classes.right}`}>
        <div className={classes.overview}>
          <h4>Weather Forecast</h4>
          <p>{cityWeather?.current?.weather[0]?.description}</p>
        </div>

        <div className={`${classes.date} flex`}>
          <i>
            <img
              src={`https://openweathermap.org/img/wn/${cityWeather?.current?.weather[0]?.icon}@2x.png`}
              alt=""
            />
          </i>
          {dateToUse}
        </div>

        {/* <div className={classes.desc}>
          <p>Sunrise: &nbsp;{sunrise}</p>
          <p>Sunset: &nbsp;{sunset}</p>
        </div> */}

        <div className={classes.hourBox}>
          {hourly?.map((hour, i) => (
            <div className={classes.hour} key={i}>
              <p>{i + 1}</p>
              <p>{formattedDate(hour?.dt * 1000)}</p>
              <p>{hour?.temp}</p>
              <p>{hour?.weather[0]?.description}</p>
            </div>
          ))}
        </div>
        {/* <div className={classes.weekly}>Weekly</div> */}
      </div>

      <div className={classes.lastUpdate}>
        Last update: <span>{dateToUse}</span>
      </div>
    </div>
  );
};

export default Home;
