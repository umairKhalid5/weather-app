import React, { useCallback, useContext, useEffect, useState } from 'react';
import WeatherContext from '../store/weather-context';

const LiveDate = () => {
  const ctx = useContext(WeatherContext);
  const [liveDate, setLiveDate] = useState();

  const { formattedDate } = ctx;

  const getDate = useCallback(() => {
    const date = new Date();
    return formattedDate(date);
  }, []);

  useEffect(() => {
    const date = new Date();
    setLiveDate(formattedDate(date));
  }, []);

  setInterval(() => {
    setLiveDate(getDate());
  }, 1000);

  return <>{liveDate}</>;
};

export default LiveDate;
