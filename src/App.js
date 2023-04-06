import React, { useEffect, useState } from 'react';
// STEP 1 : 載入 emotion 的 styled 套件
import styled from '@emotion/styled';

import { ThemeProvider } from '@emotion/react';
import dayjs from 'dayjs';

// 載入圖示
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from './images/loading.svg';

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

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
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

const Location = styled.div`
  color: ${({ theme }) => theme.titleColor};
  font-size: 28px;
  margin-bottom: 20px;
`;
// color: ${({theme}) => theme === 'dark' ? '#dadada' : '#212121'};


const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};

  /* STEP 1：定義旋轉的動畫效果，並取名為 rotate */
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  svg {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    cursor: pointer;

    /* STEP 2：使用 rotate 動畫效果在 svg 圖示上 */
    animation: rotate infinite 1.5s linear;

    /* STEP 3：isLoading 的時候才套用旋轉的效果 */
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')};
  }
`;

const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`

const AUTHORIZATION_KEY = 'CWB-47EA4267-8CFE-4100-B086-B09835724C3F';
const LOCATION_NAME = '臺北'; //STEP 1 : 定義LOCATION_NAME

function App() {
  // 元件一開始加入 console.log
  console.log('invoke function component');

  const [currentTheme, setCurrentTheme] = useState('dark');

  // 定義會使用到的資料狀態
  const [currentWeather, setCurrentWeather] = useState({
    locationName: '臺北市',
    description: '多雲時晴',
    temperature: '22.9',
    windSpeed: '1.1',
    rainPossibility: '48,3',
    observationTime: '2020-12-12 22:10:00',
    isLoading: true,
  });


  //STEP 2 : 將 AUTHORIZATION_KEY 和 LOCATION_NAME 帶入 API 請求中
  const fetchCurrentWeather = () => {

    setCurrentWeather((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`

    )
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
        const locationData = data.records.location[0]

        // STEP 2：將風速（WDSD）和氣溫（TEMP）的資料取出
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['WDSD', 'TEMP'].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          },
          {}
        );

        // STEP 3：要使用到 React 組件中的資料
        setCurrentWeather({
          locationName: locationData.locationName,
          description: '多雲時晴',
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          rainPossibility: '48,3',
          observationTime: locationData.time.obsTime,
          isLoading: false,
        });
      });
  }


  // function a (){
  //   setCurrentTheme('light')
  // }

  // 加入 useEffect 方法，參數是需要放入函式
  useEffect(() => {
    // useEffect 中加入 console.log
    console.log('execute function in useEffect');
    fetchCurrentWeather();
  }, []);

  const {
    locationName,
    description,
    temperature,
    windSpeed,
    rainPossibility,
    observationTime,
    isLoading,
  } = currentWeather;

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      {/* <button onClick={a}> click</button> */}
      <Container>
        {/* JSX 中加入 console.log */}
        {console.log('render, isLoading:', isLoading)};

        <WeatherCard>
          <Location>{locationName}</Location>
          <Description>{description}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)}<Celsius>°C</Celsius>
            </Temperature>
            <DayCloudy />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon />{windSpeed} m/h
          </AirFlow>
          <Rain>
            <RainIcon />{rainPossibility}%
          </Rain>
          {/* STEP 3 : 綁定 onClick 時會呼叫的 handleClick 方法 */}
          <Refresh onClick={fetchCurrentWeather}
            isLoading={isLoading}>
            最後觀測時間：

            {new Intl.DateTimeFormat('zh-TW', {
              hour: 'numeric',
              minute: 'numeric',
            }).format(dayjs(observationTime))}

            {''}

            {isLoading ? <LoadingIcon /> : <RefreshIcon />}

          </Refresh>
        </WeatherCard>
      </Container >
    </ThemeProvider>
  );
}

export default App;
