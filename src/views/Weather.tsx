import { LoadingButton } from '@mui/lab';
import { FormHelperText, TextField } from '@mui/material';
import { get, isEmpty } from 'lodash';
import { useState } from 'react';
import { get as getApi } from '../api';
import Card from '../components/Card';
import {
  resetAll,
  rtkFetchWeather,
  selectWeatherError,
  selectWeatherInfo,
  selectWeatherStatus
} from '../features/weather/weatherSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { ILocation } from '../interface';
import { ZIPCODE_URL } from '../utils/constants';
import Loading from '../components/Loading';


const Weather = () => {
  /* Showcase the use redux with redux toolkit */
  const dispatch = useAppDispatch();
  const weatherInfo = useAppSelector((state) => selectWeatherInfo(state));
  const weatherError = useAppSelector((state) => selectWeatherError(state));
  const weatherStatus = useAppSelector((state) => selectWeatherStatus(state));

  /* Showcase the use of plain react hooks and handling API */
  const [zipCode, setZipCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [record, setRecord] = useState<ILocation | null>(null);


  const changeHandler = event => {
    const val = get(event, 'target.value', '');
    setZipCode(val);
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setRecord(null);
    try {
      const response = await getApi(`${ZIPCODE_URL}/${zipCode}`);
      const data = get(response, 'data', {});
      if (!isEmpty(data)) {
        setRecord(data);
        runAsync(data);
      }
    } catch (e) {
      console.error('error here:', e);
      setError('Error in fetching zipcode details');
      await dispatch(resetAll());
    } finally {
      setIsLoading(false);
    }
  }

  const runAsync = async (values: ILocation) => {
    await dispatch(rtkFetchWeather(values));
  }

  const renderCards = () => {
    return (
      <>
      {weatherError && (
        <div className="text-red font-bold">
          Error fetching weather forecast!
        </div>
      )}
      {!isEmpty(record) && (
        <div className="font-bold text-3xl my-4">{`Country: ${get(record, 'country', '')}`}</div>
      )}
      {
        (!isEmpty(weatherInfo) && !isEmpty(record))
          ? get(record, 'places', []).map((r, index) => {
            return (<Card name={get(r, [`place name`], '')} weatherInfo={weatherInfo[index]} />)
          }) : null
      }
      </>
    )
  }

  return (
    <div className="justify-center">
      <div className="bg-white mb-4 mt-10 mx-8 rounded-lg text-blacklight">
        <div>
          <TextField
            label="Zip Code"
            placeholder="Zip Code"
            InputLabelProps={{
              shrink: true,
            }}
            name="zipcode"
            value={zipCode}
            onChange={changeHandler}
            fullWidth
            type="number"
            error={!!error}
          />
          <FormHelperText error style={{ textAlign: 'center'}}>
            {error}
          </FormHelperText>
        </div>
        <div className="my-4">
          <LoadingButton
            color="primary"
            disabled={false}
            fullWidth
            loading={(!!weatherStatus && weatherStatus === 'pending') || isLoading}
            onClick={() => handleSubmit()}
            variant="outlined"
            data-testid="travel-submit"
          >
            Check Forecast
          </LoadingButton>
        </div>
        <div className="mt-4">
          {((!!weatherStatus && weatherStatus === 'pending') || isLoading)
            ? (<div className="flex justify-center"><Loading /></div>)
            : renderCards()
          }
        </div>
      </div>
    </div>
  );
}

export default Weather;