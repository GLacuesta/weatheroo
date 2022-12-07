import { isArray } from 'lodash';
import { WMO } from './constants';

export const buildParams = (params) => {
  let queryObject = {};
  if (isArray(params)) {
    params.forEach((value, key) => {
      queryObject = {
        ...queryObject,
        [key]: value,
      }
    });
  } else {
    queryObject = Object.fromEntries(Object.entries(params).filter(([a, b]) => !!b).sort());
  }
  return queryObject;
}

export const getWMO = (code: string | number) => {
  if (!code) {
    return '';
  }
  return WMO[code];
}