import React, { useContext } from 'react';
import WeatherContext from '../store/weather-context';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import classes from './Chart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ hourlyData }) => {
  const ctx = useContext(WeatherContext);
  const { getTime } = ctx;
  const temp = [];
  const tempTimestamp = [];

  for (let i = 0; i < 12; i += 2) {
    temp.push(`${hourlyData[i]?.temp?.toFixed(1)}`);
  }

  for (let i = 0; i < 12; i += 2) {
    tempTimestamp.push(i === 0 ? 'Now' : getTime(hourlyData[i]?.dt));
  }

  const data = {
    labels: tempTimestamp,
    datasets: [
      {
        label: 'Hourly',
        data: temp,
        fill: false,
        backgroundColor: '#33adff',
        borderColor: '#33adff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    tension: 0.3,
    plugins: {
      legend: {
        position: 'top',
        display: 'true',
        labels: {
          color: '#fff',
          boxHeight: 5,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
      },
      y: {
        ticks: {
          color: '#fff',
        },
      },
    },
  };

  return (
    <div className={classes.chartContainer}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
