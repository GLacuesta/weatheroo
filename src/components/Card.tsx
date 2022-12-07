import { get } from 'lodash';
import { getWMO } from '../utils';

const Card = ({ name, weatherInfo }) => {
  return (
    <div className="text-justify my-4 border border-[#34558B] rounded-md">
      <div className="px-2">
        <div className="font-bold text-xl my-2">{name}</div>
        <div className="my-2">{`${getWMO(get(weatherInfo, 'current_weather.weathercode', ''))}`}</div>
        <div className="my-2">{`Temparature: ${get(weatherInfo, 'current_weather.temperature', '')} °C`}</div>
        <div className="my-2">{`Elevation: ${get(weatherInfo, 'elevation', '')}`}</div>
        <div className="my-2">{`Windspeed: ${get(weatherInfo, 'current_weather.windspeed', '')} Km/h`}</div>
      </div>
    </div>
  );
}

export default Card;