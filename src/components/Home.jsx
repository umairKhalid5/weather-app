import React, { useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import classes from './Home.module.css';
import WeatherContext from '../store/weather-context';
import {
  useGetCityDetailsLatLonQuery,
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
import LiveDate from './LiveDate';
import Maps from './Maps';
import FeaturedCities from './FeaturedCities';
import countriesList from '../countries/countries.js';
import SearchIcon from '@mui/icons-material/Search';
import Loader from './Loader';

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
  'drizzle',
  'overcastclouds',
  'haze',
];

const Home = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  const navigate = useNavigate();
  const params = useParams();

  const ctx = useContext(WeatherContext);
  const { formattedDate, windDirection, getTime, getDay } = ctx;

  const searchRef = useRef();
  const formBtnRef = useRef();

  const date = new Date();
  const dateToUse = formattedDate(date);

  const submitHandler = e => {
    e.preventDefault();
    if (searchRef.current.value.trim().length < 1) return;
    navigate(`/weather/${searchRef.current.value}`);
    searchRef.current.value = '';
  };

  const handleInpClick = () => formBtnRef.current.click();

  let coords;
  if (params.coords) {
    const coordsSplit = params.coords.split('+');
    coords = {
      lat: +coordsSplit[0],
      lon: +coordsSplit[1],
    };
  }

  const {
    data: cityDetails,
    isFetching: fetchingCityDetails,
    isError,
  } = useGetCityDetailsQuery(params?.city ?? skipToken);

  const {
    data: cityDetailsLatLon,
    isFetching: fetchingCityLatLon,
    isErrorLatLon,
  } = useGetCityDetailsLatLonQuery(coords ?? skipToken);

  const { data: cityWeather, isFetching: fetchingCityWeather } =
    useGetCityWeatherQuery(cityDetails?.coord ?? coords ?? skipToken);

  if (fetchingCityDetails || fetchingCityWeather || fetchingCityLatLon)
    return <Loader />;
  if (isError || isErrorLatLon) return <NotFound />;

  // console.log(cityWeather?.current);

  const dayOrNight =
    cityWeather?.current?.dt >= cityWeather?.current?.sunrise &&
    cityWeather?.current?.dt <= cityWeather?.current?.sunset
      ? 'day'
      : 'night';

  const hourly = cityWeather?.hourly?.slice(0, 24);
  const daily = cityWeather?.daily;

  const timeZoneOffset = new Date().getTimezoneOffset() * 60;

  const sunriseTime = getTime(
    cityWeather?.current?.sunrise +
      cityWeather?.timezone_offset +
      timeZoneOffset
  );
  const sunsetTime = getTime(
    cityWeather?.current?.sunset + cityWeather?.timezone_offset + timeZoneOffset
  );

  const tempDifference =
    Math.floor(cityWeather?.daily[0]?.temp?.day) -
    Math.floor(cityWeather?.daily[0]?.temp?.night);

  let bgImage = weatherResponses
    .filter(
      res =>
        res ===
        cityWeather?.current?.weather[0]?.description
          .toLowerCase()
          .replace(' ', '')
    )
    .join('');
  if (!bgImage.trim())
    bgImage = weatherResponses.filter(
      res =>
        res ===
        cityWeather?.current?.weather[0]?.main.toLowerCase().replace(' ', '')
    );

  const contVariants = {
    hidden: {
      opacity: 0,
      rotateY: 90,
    },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: { delay: 0.3, duration: 0.6 },
    },
    exit: {
      x: '-100vw',
      transition: { ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      className={classes.wrapper}
      // initial={{ opacity: 0, rotateY: 90 }}
      // animate={{ opacity: 1, rotateY: 0 }}
      // exit={{ opacity: 0, rotateY: 90 }}
      // transition={{ duration: 0.5 }}
      // style={{ transformOrigin: 'center' }}
      variants={contVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div
        className={classes.homeContainer}
        style={{
          backgroundImage: `url(/${dayOrNight}/${bgImage}.jpg)`,
        }}
      >
        {/* //?Left */}
        <div className={`${classes.left} `}>
          <form
            className={`${classes.form} ${classes.miniWrapper}`}
            onSubmit={submitHandler}
            style={{ paddingTop: '1rem' }}
          >
            <div className="inputContainer home">
              <input
                type="text"
                placeholder="Enter a different city"
                ref={searchRef}
                // value={searchTerm}
                // onChange={e => setSearchTerm(e.target.value)}
              />
              <i onClick={handleInpClick}>
                <SearchIcon />
              </i>
            </div>
            <h4>
              <span>Current:</span>{' '}
              {cityDetails?.name ?? cityDetailsLatLon?.name},{' '}
              {cityDetails?.sys?.country ?? cityDetailsLatLon?.sys?.country}
            </h4>
            <button
              ref={formBtnRef}
              style={{
                visibility: 'hidden',
                position: 'absolute',
                transform: 'translate(-200vw, -200vh)',
              }}
            >
              Submit
            </button>
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
            <Chart
              hourlyData={hourly}
              cWOffset={cityWeather?.timezone_offset}
              tZOffset={timeZoneOffset}
            />
          </div>

          <div className={`${classes.more} ${classes.miniWrapper}`}>
            <h3>
              {cityDetails?.name ?? cityDetailsLatLon?.name},{' '}
              {countriesList[cityDetails?.sys?.country] ??
                countriesList[cityDetailsLatLon?.sys?.country]}
            </h3>
            <div className={classes.grid}>
              <div>
                <p>High: &nbsp;{cityWeather?.daily[0]?.temp?.max}°</p>
                <p>Low: &nbsp;{cityWeather?.daily[0]?.temp?.min}°</p>
                <p>Humidity: &nbsp;{cityWeather?.current?.humidity}%</p>
                <p>Cloudiness: &nbsp;{cityWeather?.current?.clouds}%</p>
              </div>
              <div>
                <p>Pressure: &nbsp;{cityWeather?.current?.pressure}hPa</p>
                <p>Sunrise: &nbsp;{sunriseTime}</p>
                <p>Sunset: &nbsp;{sunsetTime}</p>
                <p>UV: &nbsp;{cityWeather?.current?.uvi}</p>
              </div>
            </div>
          </div>
        </div>

        {/* //?Right */}
        <div className={`${classes.right}`}>
          <div className={classes.overview}>
            {/* <h4>Weather Forecast</h4> */}
            <p>{cityWeather?.current?.weather[0]?.description}</p>
          </div>

          <div>
            <div className={`${classes.date} flex`}>
              <img
                src={`https://openweathermap.org/img/wn/${cityWeather?.current?.weather[0]?.icon}@2x.png`}
                alt=""
              />
              <span
                style={{
                  marginLeft: '-0.1rem',
                  fontWeight: 500,
                }}
              >
                {cityDetails?.name ?? cityDetailsLatLon?.name},{' '}
                {countriesList[cityDetails?.sys?.country] ??
                  countriesList[cityDetailsLatLon?.sys?.country]}
              </span>
            </div>
            <LiveDate
              current={cityWeather?.current?.dt}
              timezone={cityWeather?.timezone_offset}
              timeZoneOffset={timeZoneOffset}
            />
          </div>

          {/* //? Hourly */}
          <div className={classes.sliderContainer}>
            <h4>Hourly:</h4>
            <div className={classes.sliderBox}>
              {hourly?.map((hour, i) => (
                <div className={classes.box} key={i}>
                  <p>
                    {i === 0
                      ? 'Now'
                      : getTime(
                          hour?.dt +
                            cityWeather?.timezone_offset +
                            timeZoneOffset
                        )}
                  </p>
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
                    {windDirection(hour?.wind_deg)}{' '}
                    {hour?.wind_speed.toFixed(1)}
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
                  <p>
                    {i === 0
                      ? 'Today'
                      : getDay(
                          day?.dt +
                            cityWeather?.timezone_offset +
                            timeZoneOffset
                        )}
                  </p>
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
          Last updated: <span>{dateToUse}</span>
        </div>
      </div>

      <div className={classes.mapsCitiesContainer}>
        <Maps
          coords={cityDetails?.coord ?? coords}
          id={cityDetails?.id}
          icon={cityWeather?.current?.weather[0]?.icon}
          curr={{
            temp: cityWeather?.current?.temp.toFixed(1),
            desc: cityWeather?.current?.weather[0]?.description,
            icon: `https://openweathermap.org/img/wn/${cityWeather?.current?.weather[0]?.icon}@2x.png`,
          }}
        />

        <FeaturedCities />
      </div>
    </motion.div>
  );
};

export default Home;
