export interface ILocation {
  country: string;
  [`counter abbreviation`]: string;
  places: IPlaces[];
  [`post code`]: string;
}

export interface IPlaces {
  latitude: string;
  longtitude: string;
  [`place name`]: string;
  state: string;
  [`state abbreviation`]: string;
}
