import axios from "axios";

export interface LocationCity {
  name: string;
}

export interface LocationState {
  name: string;
  cities: LocationCity[];
}

export interface LocationCountry {
  name: string;
  iso2: string;
  states: LocationState[];
}

export interface LocationsResponse {
  count: number;
  countries: LocationCountry[];
}

class LocationService {
  getLocations() {
    return axios.get<LocationsResponse>("/api/locations");
  }
}

export default new LocationService();
