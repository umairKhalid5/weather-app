import React, { useState } from 'react';

const WeatherContext = React.createContext({
  city: '',
  lat: '',
  lan: '',
  formattedDate: () => {},
  windDirection: () => {},
  getTime: () => {},
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
  };

  const formattedDate = date => {
    return new Intl.DateTimeFormat('en-US', options)
      .format(date)
      .replace('at', '');
  };

  let timeoptions = {
    hour: 'numeric',
    minute: 'numeric',
  };

  const getTime = date => {
    return new Intl.DateTimeFormat('en-US', timeoptions).format(date * 1000);
    // .replace('at', '');
  };

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity,
        formattedDate,
        windDirection,
        getTime,
      }}
    >
      {props.children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
