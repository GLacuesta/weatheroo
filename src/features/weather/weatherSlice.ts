import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { get, isEmpty } from 'lodash';
import { get as getApi } from '../../api';
import { buildParams } from '../../utils';
import { WEATHER_URL } from '../../utils/constants';
import { ILocation } from '../../interface';

const FETCH_WEATHER_ACTION_TYPE = 'weather/fetchWeather';

const fetchWeather = async url => await getApi(url).catch(e => e);

export const rtkFetchWeather = createAsyncThunk(
  FETCH_WEATHER_ACTION_TYPE,
  async (values: ILocation) => {
    try {
      const places = get(values, 'places', []);
      if (isEmpty(places)) { return; }

      const updatedPlaces = places.map(i => {
        const url = new URL(WEATHER_URL);
        const params = buildParams({
          latitude: get(i, 'latitude', ''),
          longitude: get(i, 'longitude', ''),
          current_weather: true,
        });
        url.search = new URLSearchParams(params).toString();
        return url.href;
      })
      
      const response =
        await Promise.all(updatedPlaces.map(fetchWeather))
          .catch(e => {
          console.error(e);
          return e;
        });
      return response;
    } catch (err) {
      throw(err);
    }
  }
)

const updateState = (state, action) => {
  const actionType = get(action, 'type', '');
  const requestStatus = get(action, 'meta.requestStatus', '');
  const data = get(action, 'payload', []).map(i => i.data);
  if (actionType.includes(FETCH_WEATHER_ACTION_TYPE)) {
    state.status = requestStatus;
    if (requestStatus === 'fulfilled') {
      state.info = data;
      state.error = '';
      return;
    }
    if (requestStatus === 'rejected') {
      state.error = 'Error in fetching forecast!';
      state.info = []
      return;
    }
    return;
  }

}

const initialState = {
  name: 'weather info',
  info: [],
  status: 'idle',
  error: '',
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    resetAll: (state) => {
      state.info = [];
      state.status = 'idle';
      state.error = '';
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        isAnyOf(rtkFetchWeather.pending),
        (state, action) => {
        updateState(state, action);
      })
      .addMatcher(
        isAnyOf(rtkFetchWeather.fulfilled),
        (state, action) => {
        updateState(state, action);
      })
      .addMatcher(
        isAnyOf(rtkFetchWeather.rejected),
        (state, action) => {
        updateState(state, action);
      })
  }
});

export const selectWeatherInfo = state => get(state, 'weather.info', []);
export const selectWeatherError = state => get(state, 'weather.error', '');
export const selectWeatherStatus = state => get(state, 'weather.status', '');

export const { resetAll } = weatherSlice.actions;

export default weatherSlice.reducer;