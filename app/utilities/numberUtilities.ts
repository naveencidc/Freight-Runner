import numeral from "numeral";
import { Linking } from "react-native";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const addCurrencyStrings = (amounts: string[]): string => {
  return amounts.reduce((acc, amount) => {
    const amountNumber = stringToNumber(amount);
    const accNumber = stringToNumber(acc);
    const total = (amountNumber + accNumber).toFixed(2);
    return `$${total}`;
  }, "$0.00");
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
