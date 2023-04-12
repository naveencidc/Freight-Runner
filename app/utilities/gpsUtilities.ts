import Geolocation, {
  GeoPosition,
  SuccessCallback,
} from "react-native-geolocation-service";
import { GeoCoordinate } from "geocoordinate";
import { convertToMiles, stringToNumber } from "../utilities/numberUtilities";
import { Alert } from "react-native";

export const calculateDistance = (
  firstLocation: { lat: number | string; lng: number | string },
  secondLocation: { lat: number | string; lng: number | string }
) => {
  if (typeof firstLocation.lat === "string") {
    Object.assign(firstLocation, { lat: stringToNumber(firstLocation.lat) });
  }
  if (typeof firstLocation.lng === "string") {
    Object.assign(firstLocation, { lng: stringToNumber(firstLocation.lng) });
  }
  if (typeof secondLocation.lat === "string") {
    Object.assign(secondLocation, { lat: stringToNumber(secondLocation.lat) });
  }
  if (typeof secondLocation.lng === "string") {
    Object.assign(secondLocation, { lng: stringToNumber(secondLocation.lng) });
  }

  const pointA = new GeoCoordinate(firstLocation.lat, firstLocation.lng);
  const pointB = new GeoCoordinate(secondLocation.lat, secondLocation.lng);
  const distanceInMeters = pointA.quickDistanceTo(pointB);

  return convertToMiles(distanceInMeters);
};

export const getCurrentLocation = (callback: SuccessCallback) => {
  Geolocation.getCurrentPosition(
    (position: GeoPosition) => {
      callback(position);
    },
    (error) => {
      console.log("-+++++++++", error);
    }
  );
};
