import React, { useEffect, useState, useCallback, useMemo } from 'react';
// STEP 1 : 載入 emotion 的 styled 套件
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';

import WeatherCard from './views/WeatherCard';
import WeatherSetting from './views/WeatherSetting';
import { findLocation, getMoment } from './utils/helpers';
import useWeatherAPI from './hooks/useWeatherAPI';


const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

// STEP 2 : 定義帶有 styled 的 component
// STEP 2 : 在 styled Component 中可以透過 Props 取得對的顏色
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;


// 透過props取得傳進來的資料
// props會是{theme:"dark", children:"台北市"}
// 多種的情況
// color: ${props => {
//   switch (props.theme) {
//     case 'dark':
//       return '#dadada';
//     case 'light':
//       return '#212121';
//     case 'blue':
//       return '#9eaeed';
//     default:
//       return '#ec6666';
//   }
// }};

// color: ${props => props.theme === 'dark' ? '#dadada' : '#212121'};



const AUTHORIZATION_KEY = 'CWB-47EA4267-8CFE-4100-B086-B09835724C3F';
// const LOCATION_NAME = '臺北'; //STEP 1 : 定義LOCATION_NAME
// const LOCATION_NAME_FORECAST = '臺北市';



const App = () => {
  const [currentCity, setCurrentCity] = useState(() => localStorage.getItem('cityName') || '臺北市');
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const [currentTheme, setCurrentTheme] = useState('light');

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  const currentLocation = useMemo(() => findLocation(currentCity), [
    currentCity,
  ]);
  const { cityName, locationName, sunriseCityName } = currentLocation;
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}

        {currentPage === 'WeatherSetting' && (
          <WeatherSetting
            cityName={cityName}
            handleCurrentCityChange={handleCurrentCityChange}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
