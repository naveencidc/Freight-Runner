import {
  PERMISSIONS,
  request,
  check,
  openSettings,
} from "react-native-permissions";
import Snackbar from "react-native-snackbar";
import Geolocation from "react-native-geolocation-service";
import { Alert, Linking, Platform } from "react-native";
import deviceInfoModule from "react-native-device-info";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const _getLocationEnabledStatus = async () => {
  let status;
  await deviceInfoModule.isLocationEnabled().then((enabled) => {
    // To check weather location turned on or off
    // true or false
    if (enabled) {
      status = true;
    } else {
      status = false;
    }
  });
  if (status !== undefined) {
    if (status) {
      return true;
    } else {
      return false;
    }
  }
};
const _showLocationStatus = () => {
  Snackbar.show({
    text: "Turn on your location",
    duration: 2000,
  });
  Geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
    },
    (error) => {
      console.log("---------off---location-----");
      // See error code charts below.
      console.log(error.code, error.message);
    },
    {
      enableHighAccuracy: Platform.OS === "ios" ? true : false,
      timeout: 20000,
      // maximumAge: Platform.OS === 'ios' ? 10000 : 0,
    }
  );
};
export const checkLocationPermission = async () => {
  let isAllOK = false;
  await check(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    })
  )
    .then(async (val) => {
      if (val === "granted") {
        // To check Location Permission
        let enabled = await _getLocationEnabledStatus();
        console.log("---_getLocationEnabledStatus", enabled);
        if (enabled) {
          isAllOK = true;
          //Do action
        } else {
          _showLocationStatus();
        }
      } else if (val === "blocked") {
        isAllOK = false;
        // Alert.alert(
        //   "",
        //   "Location Permission is Required to Track the Live Location for the In-Progress Loads, Turn on the Location in Settings?",
        //   [
        //     {
        //       text: "Cancel",
        //       onPress: () => console.log("Cancel Pressed"),
        //       style: "cancel"
        //     },
        //     {
        //       text: "OK",
        //       onPress: () => {
        //         openSettings().catch(() => console.warn("cannot open settings"));
        //       }
        //     }
        //   ]
        // );
      } else if (val === "denied") {
        request(
          Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          })
          // {
          //   title: 'Location Permission',
          //   message: 'We need your location to get the nearby',
          // },
        )
          .then(async (value) => {
            if (value === "granted") {
              let enabled = await _getLocationEnabledStatus();
              if (enabled) {
                isAllOK = true;
                //Do action
              } else {
                _showLocationStatus();
              }
            } else if (value === "blocked") {
              // Snackbar.show({
              //   text: "Turn on your location permission",
              //   duration: 2000
              // });
              isAllOK = false;
              // openSettings().catch(() => console.warn("cannot open settings"));
            }
          })
          .catch((e) => {});
      }
    })
    .catch((e) => {});
  return isAllOK;
};

export const convertToMiles = (distanceInMeters: number): string => {
  const mileToMeterConversion = 1609.34;
  return Math.floor(distanceInMeters / mileToMeterConversion).toString();
};

export const dialPhoneNumber = (phoneNumber: string) => {
  Linking.openURL(`tel:${phoneNumber}`);
};

export const stringToNumber = (value: string) => {
  return numeral(value).value();
};

export const formatPhoneNumber = (unformattedNumber: string) => {
  if (!unformattedNumber) return "";
  return parsePhoneNumberFromString(unformattedNumber, "US")?.formatNational();
};

export const amountIsUnderStripeLimit = (number: string | number): boolean => {
  let numberToCompare = number;
  if (typeof number === "string") numberToCompare = stringToNumber(number);

  return numberToCompare < 1000000;
};
