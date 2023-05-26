import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import classes from './Home.module.css';
import WeatherContext from '../store/weather-context';
import {
  useGetCityDetailsQuery,
  useGetCityWeatherQuery,
} from '../services/getWeatherapi';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useNavigate, useParams } from 'react-router-dom';
import sunrise from '../assets/icons/sunrise.png';
import sunset from '../assets/icons/sunset.png';
import temperature from '../assets/icons/temperature.png';
import wind from '../assets/icons/wind.png';
import Chart from './Chart';
import NotFound from './NotFound';

const weatherResponses = [
  'clearsky',
  'fewclouds',
  'scatteredclouds',
  'brokenclouds',
  'showerrain',
  'rain',
  'thunderstorm',
  'snow',
  'mist',
];

const Home = () => {
  const navigate = useNavigate();
  const params = useParams();

  const ctx = useContext(WeatherContext);
  const { formattedDate, windDirection, getTime, getDay } = ctx;

  const [searchTerm, setSearchTerm] = useState('');

  const date = new Date();
  const dateToUse = formattedDate(date);

  const submitHandler = e => {
    e.preventDefault();
    navigate(`/${searchTerm}`);
    setSearchTerm('');
  };

  const {
    data: cityDetails,
    isFetching: fetchingCityDetails,
    isError,
  } = useGetCityDetailsQuery(params?.city ?? skipToken);

  const { data: cityWeather, isFetching: fetchingCityWeather } =
    useGetCityWeatherQuery(cityDetails?.coord ?? skipToken);

  if (fetchingCityDetails || fetchingCityWeather) return;
  if (isError) return <NotFound />;

  const hourly = cityWeather?.hourly?.slice(0, 24);
  const daily = cityWeather?.daily;

  const sunriseTime = getTime(cityWeather?.current?.sunrise);
  const sunsetTime = getTime(cityWeather?.current?.sunset);

  const tempDifference =
    Math.floor(cityWeather?.daily[0]?.temp?.day) -
    Math.floor(cityWeather?.daily[0]?.temp?.night);

  const bgImage = weatherResponses
    .filter(
      res =>
        res ===
          cityWeather?.current?.weather[0]?.description
            .toLowerCase()
            .replace(' ', '') ||
        res ===
          cityWeather?.current?.weather[0]?.main.toLowerCase().replace(' ', '')
    )
    .join('');

  return (
    <motion.div
      className={classes.homeContainer}
      style={{
        backgroundImage: `url(src/assets/${bgImage}.jpg)`,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      {/* //?Left */}
      <div className={`${classes.left} `}>
        <form
          className={`${classes.form} ${classes.miniWrapper}`}
          onSubmit={submitHandler}
        >
          <input
            type="text"
            placeholder="Enter city"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <h4>
            <span>Showing:</span> {cityDetails?.name},{' '}
            {cityDetails?.sys?.country}
          </h4>
        </form>

        <div className={`${classes.majorDetails} ${classes.miniWrapper}`}>
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

        {/* //?Chart */}
        <div className={`${classes.graph} ${classes.miniWrapper}`}>
          <Chart hourlyData={hourly} />
        </div>

        <div className={`${classes.more} ${classes.miniWrapper}`}>
          <h3>
            {cityDetails?.name}, {cityDetails?.sys?.country}
          </h3>
          <p>High: &nbsp;{cityWeather?.daily[0]?.temp?.min}°</p>
          <p>Low: &nbsp;{cityWeather?.daily[0]?.temp?.max}°</p>
          <p>Humidity: &nbsp;{cityWeather?.current?.humidity}%</p>
          <p>Sunrise: &nbsp;{sunriseTime}</p>
          <p>Sunset: &nbsp;{sunsetTime}</p>
          <p>Pressure: &nbsp;{cityWeather?.current?.pressure}hPa</p>
          <p>UV: &nbsp;{cityWeather?.current?.uvi}</p>
        </div>
      </div>

      {/* //?Right */}
      <div className={`${classes.right}`}>
        <div className={classes.overview}>
          <h4>Weather Forecast</h4>
          <p>{cityWeather?.current?.weather[0]?.description}</p>
        </div>

        <div className={`${classes.date} flex`}>
          <img
            src={`https://openweathermap.org/img/wn/${cityWeather?.current?.weather[0]?.icon}@2x.png`}
            alt=""
          />

          {dateToUse}
        </div>

        {/* <div className={classes.desc}>
          <p>Sunrise: &nbsp;{sunrise}</p>
          <p>Sunset: &nbsp;{sunset}</p>
        </div> */}

        {/* //? Hourly */}
        <div className={classes.sliderContainer}>
          <h4>Hourly:</h4>
          <div className={classes.sliderBox}>
            {hourly?.map((hour, i) => (
              <div className={classes.box} key={i}>
                <p>{i === 0 ? 'Now' : getTime(hour?.dt)}</p>
                <p className={classes.boxTemp}>{hour?.temp.toFixed(1)}°</p>
                <div className={`${classes.icons} flex`}>
                  <i>
                    <img
                      src={`https://openweathermap.org/img/wn/${hour?.weather[0]?.icon}.png`}
                      alt=""
                    />
                  </i>
                  <p className={classes.boxDesc}>
                    {hour?.weather[0]?.description}
                  </p>
                </div>
                <p className={`${classes.icon} flex`}>
                  <img src={wind} alt="" />
                  {windDirection(hour?.wind_deg)} {hour?.wind_speed.toFixed(1)}
                  km/h
                </p>
                <p>Humidity: {hour?.humidity}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* //? Weekly */}
        <div className={classes.sliderContainer}>
          <h4>Weekly:</h4>
          <div className={classes.sliderBox}>
            {daily?.map((day, i) => (
              <div className={classes.box} key={i}>
                <p>{i === 0 ? 'Today' : getDay(day?.dt)}</p>
                <div className={classes.boxTempDaily}>
                  <img src={temperature} alt="" />
                  <div>
                    <span>{day?.temp?.day?.toFixed(1)}°</span>
                    <span>{day?.temp?.night?.toFixed(1)}°</span>
                  </div>
                </div>
                <div className={`${classes.icons} flex`}>
                  <i>
                    <img
                      src={`https://openweathermap.org/img/wn/${day?.weather[0]?.icon}.png`}
                      alt=""
                    />
                  </i>
                  <p className={classes.boxDesc}>
                    {day?.weather[0]?.description}
                  </p>
                </div>
                <p className={`${classes.icon} flex`}>
                  <img src={wind} alt="" />
                  {windDirection(day?.wind_deg)} {day?.wind_speed?.toFixed(1)}
                  km/h
                </p>
                <div className={`${classes.icon} ${classes.sun} flex`}>
                  <div className="flex">
                    <img src={sunrise} alt="" />
                    {getTime(day?.sunrise)}
                  </div>
                  <div className="flex">
                    <img src={sunset} alt="" />
                    {getTime(day?.sunset)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={classes.lastUpdate}>
        Last update: <span>{dateToUse}</span>
      </div>
    </motion.div>
  );
};

export default Home;
