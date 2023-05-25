import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const key = import.meta.env.VITE_MOVIE_API_KEY;

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.openweathermap.org/data/2.5/',
  }),
  endpoints: builder => ({
    getCityDetails: builder.query({
      query: city => `weather?q=${city}&units=metric&appid=${key}`,
    }),
    getCityWeather: builder.query({
      query: ({ lat, lon }) =>
        `onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${key}`,
    }),
  }),
});

export const { useGetCityDetailsQuery, useGetCityWeatherQuery } = weatherApi;
