import axios, { AxiosResponse } from "axios";
import Config from "react-native-config";
import { GeoPosition } from "react-native-geolocation-service";
import {
  camelCaseResponseTransformer as responseTransformer,
  snakeCaseRequestTransformer as requestTransformer,
} from "./transformers";

type MapboxFeature = {
  placeName: string;
};

type MapboxResponse = {
  type: string;
  query: [number, number];
  features: MapboxFeature[];
  attribution: string;
};

const MapboxApiInstance = axios.create({
  baseURL: Config.MAPBOX_BASE_API,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  transformRequest: [requestTransformer],
  transformResponse: [responseTransformer],
});

export const reverseLookup = (
  position: GeoPosition
): Promise<AxiosResponse<MapboxResponse>> => {
  const { latitude, longitude } = position.coords;
  return MapboxApiInstance.get(
    `/geocoding/v5/mapbox.places/${longitude.toString()},${latitude.toString()}.json?access_token=${
      Config.MAPBOX_API_KEY
    }`
  ).then((res) => res);
};

export const googlereverseLookup = async (position: GeoPosition) => {
  const { latitude, longitude } = position.coords;
  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${"AIzaSyDAmOaaNP3Yx-MBnK2wGTqWMBnAaPPEY_0"}`
  );
  return res;
};
