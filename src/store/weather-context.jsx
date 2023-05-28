import React, { useState } from 'react';

const WeatherContext = React.createContext({
  city: '',
  lat: '',
  lan: '',
  formattedDate: () => {},
  windDirection: () => {},
  getTime: () => {},
  getDay: () => {},
});

export const WeatherContextProvider = props => {
  const [city, setCity] = useState('');
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const windDirection = angle => {
    const directions = [
      '↑ N',
      '↗ NE',
      '→ E',
      '↘ SE',
      '↓ S',
      '↙ SW',
      '← W',
      '↖ NW',
    ];
    return directions[Math.round(angle / 45) % 8];
  };

  let options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    // second: 'numeric',
  };

  const formattedDate = date => {
    return new Intl.DateTimeFormat('en-US', options).format(date);
    // .replace('at', '');
  };

  let timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
  };

  const getTime = date =>
    new Intl.DateTimeFormat('en-US', timeOptions).format(date * 1000);

  let dayOptions = {
    weekday: 'long',
  };

  const getDay = date =>
    new Intl.DateTimeFormat('en-US', dayOptions).format(date * 1000);

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity,
        formattedDate,
        windDirection,
        getTime,
        getDay,
      }}
    >
      {props.children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
