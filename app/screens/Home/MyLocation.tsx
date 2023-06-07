/*************************************************
 * FreightRunner
 * @exports
 * @function MyLocation.tsx
 * @extends Component
 * Created by Deepak B on 26/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useState, useEffect } from "react";
import {
  ViewStyle,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import FastImage from "react-native-fast-image";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getCurrentLocation } from "../../utilities/gpsUtilities";
import { GeoPosition } from "react-native-geolocation-service";
import {
  googlereverseLookup,
  reverseLookup,
} from "../../services/mapboxService";
import Config from "react-native-config";
import HeaderWithBack from "../../components/HeaderWithBack";
type Props = {
  navigation: any;
};
const deviceHeight = Dimensions.get("window").height;
let currentPosition: GeoPosition;
let features: any = {};
let addressObj: Object = {};
let currentLocation: Object = {};
const MyLocation: React.FC<Props> = ({ navigation, route }) => {
  let pickUpAddress = route.params?.pickUpAddress;
  let fullAddress = route.params?.fullAddress;
  const [coordinates, setCoordinates] = useState<Array>({});
  let [address1, setAddress1] = useState<string>("");
  let [address2, setAddress2] = useState<string>("");
  let [city, setCity] = useState<string>("");
  let [stateName, setState] = useState<string>("");
  let [zipCode, setZipCode] = useState(addressObj);
  let [clickState, setClickState] = useState(false);

  useEffect(() => {
    getCurrentLocation((position) => {
      currentPosition = position;
      setCoordinates(currentPosition);
    });
  }, []);

  // getting the current location
  const getHomeCondoLocation = async () => {
    try {
      await googlereverseLookup(currentPosition)
        .then((response) => {
          let cityName = response.data.results[0]?.address_components.find(
            (city) => city.types.includes("locality")
          );
          addressObj = {
            address_line1: "",
            address_line2: "",
            city: cityName.long_name,
            coords: currentPosition.coords,
          };
          currentLocation = addressObj;
          navigation.navigate("Home", { userCurrentLocation: currentLocation });
        })
        .catch((err) => {
          console.log("gps error", err);
        });
    } catch (error) {
      console.log("gps error", error);
    }
  };
  // navigates current location params to home screen
  const _navigateToHome = () => {
    if (clickState === true) {
      setTimeout(() => {
        navigation.navigate("Home", { userCurrentLocation: currentLocation });
      }, 1500);
      return <ActivityIndicator size="small" color="#808F99" />;
    } else {
      return null;
    }
  };

  const getSelectedCoordinates = async (getLocation) => {
    console.log(getLocation[1], "GET");
    let arrayData = {
      coords: {
        latitude: getLocation[0],
        longitude: getLocation[1],
      },
    };
    try {
      const placeInfo = await googlereverseLookup(arrayData)
        .then((response) => {
          let cityName = response.data.results[0]?.address_components.find(
            (city) => city.types.includes("locality")
          );
          addressObj = {
            address_line1: "",
            address_line2: "",
            city: cityName.long_name,
            coords: currentPosition.coords,
          };
          currentLocation = addressObj;
          navigation.navigate("Home", { userCurrentLocation: currentLocation });
        })
        .catch((err) => {
          console.log("gps error", err);
        });
    } catch (error) {
      console.log("gps error", error);
    }
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <HeaderWithBack
        title="MY LOCATION"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText="SELECT ALL"
        rightOnPress={() => navigation.goBack()}
      ></HeaderWithBack>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          alignSelf: "flex-end",
          marginHorizontal: 15,
        }}
      >
        <TouchableOpacity onPress={() => getHomeCondoLocation()}>
          <Text
            style={{
              fontSize: fontSizes.small,
              color: "#1C6191",
              marginTop: 5,
            }}
          >
            Current Location
          </Text>
        </TouchableOpacity>

        <View
          style={{
            height: "90%",
            width: 1.5,
            backgroundColor: "#1C6191",
            flexDirection: "row",
            marginHorizontal: 10,
            marginTop: 6,
            alignSelf: "center",
          }}
        ></View>
        <TouchableOpacity onPress={() => navigation.navigate("ChooseFromMap")}>
          <Text
            style={{
              fontSize: fontSizes.small,
              color: "#1C6191",
              marginTop: 5,
            }}
          >
            Choose from Map
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={{ marginTop: 10 }}
      >
        <GooglePlacesAutocomplete
          disableScroll={true}
          autoCorrect={false}
          spellCheck={false}
          fetchDetails={true}
          enablePoweredByContainer={false}
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          keepResultsAfterBlur={true}
          placeholder="Search for your city"
          query={{
            key: "AIzaSyDAmOaaNP3Yx-MBnK2wGTqWMBnAaPPEY_0",
            language: "en",
            components: "country:us",
          }}
          listEmptyComponent={() => {
            return (
              <Text
                style={{
                  fontSize: 16,
                  alignSelf: "center",
                  marginTop: 10,
                  color: "#A19B9B",
                }}
              >
                No results foundssss
              </Text>
            );
          }}
          renderHeaderComponent={() => {
            return (
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text style={{ fontSize: fontSizes.small, color: "#858C97" }}>
                  Search Results
                </Text>
              </View>
            );
          }}
          renderRow={(data, index) => {
            return (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FastImage
                  resizeMode={"contain"}
                  source={require("../../assets/images/LocationGray.png")}
                  style={{
                    height: 25,
                    width: 25,
                    marginVertical: 12,
                    marginRight: 12,
                  }}
                />
                <View>
                  <Text
                    style={{
                      color: colors.black,
                      fontWeight: "600",
                      fontSize: fontSizes.regular,
                    }}
                  >
                    {data.structured_formatting.main_text}
                  </Text>

                  <Text
                    style={{
                      color: colors.grey,
                      fontSize: fontSizes.xSmall,
                      marginTop: 5,
                    }}
                  >
                    {data.structured_formatting.secondary_text}
                  </Text>
                </View>
              </View>
            );
          }}
          renderRightButton={() => {
            return (
              <View
                style={{
                  position: "absolute",
                  right: 10,
                  alignSelf: "center",
                  paddingHorizontal: 10,
                }}
              >
                <FastImage
                  resizeMode={"contain"}
                  source={require("../../assets/images/LocationColor.png")}
                  style={{ height: 25, width: 25 }}
                />
              </View>
            );
          }}
          textInputProps={{
            InputComp: TextInput,
            placeholder: "Search for your city",
            placeholderTextColor: colors.black,
            backgroundColor: "#F5F4F7",
            height: 55,
            returnKeyType: "done",
            focusable: true,
            autoFocus: true,
            autoCorrect: false,
            spellCheck: false,
          }}
          onPress={(data, details = null) => {
            addressObj = {
              address_line1: "",
              address_line2: "",
              city: data.description,
              coords: {
                latitude: details?.geometry?.location.lat,
                longitude: details?.geometry?.location.lng,
              },
            };
            currentLocation = addressObj;
            navigation.navigate("Home", {
              userCurrentLocation: currentLocation,
            });
            // let setCoordinates = [
            //   JSON.stringify(details?.geometry?.location.lat),
            //   JSON.stringify(details?.geometry?.location.lng)
            // ];
            // getSelectedCoordinates(setCoordinates);
          }}
          styles={{
            row: {
              padding: 10,
              backgroundColor: colors.white,
            },
          }}
        />
      </KeyboardAwareScrollView>
      <View style={{ flex: 1 }}>{_navigateToHome()}</View>
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
};

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    backgroundColor: "white",
    flex: 1,
  },
});

export default MyLocation;
