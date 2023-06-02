/*************************************************
 * FreightRunner
 * @exports
 * @function ChooseFromMap.tsx
 * @extends Component
 * Created by Deepak B on 2/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useState, useEffect, useContext } from "react";
import { View, ViewStyle, StyleSheet, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5Pro";
import colors from "../../styles/colors";
// import MapboxGL from "@react-native-mapbox-gl/maps";
type Props = { navigation: any };
import Config from "react-native-config";
import { GeoPosition } from "react-native-geolocation-service";
import { getCurrentLocation } from "../../utilities/gpsUtilities";
import {
  googlereverseLookup,
  reverseLookup,
} from "../../services/mapboxService";
// MapboxGL.setAccessToken(Config.MAPBOX_API_KEY);
// const { MapView, Camera, UserLocation, PointAnnotation } = MapboxGL;
import { MyContext } from "../../context/MyContextProvider";
import storage from "../../helpers/storage";
import HeaderWithBack from "../../components/HeaderWithBack";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
let currentPosition: GeoPosition;
let features: any = {};
let currentLocation: Object = {};
let getData: Array<string> = [];
let addressObj: Object = {};

const ChooseFromMap: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  const [coordinates, setCoordinates] = useState<any>({});
  let [address1, setAddress1] = useState<string>("");
  let [address2, setAddress2] = useState<string>("");
  let [city, setCity] = useState<string>("");
  let [stateName, setState] = useState<string>("");
  let [zipCode, setZipCode] = useState(addressObj);
  const [selectedCordinates, setSelectedCordinates] = useState<any>({
    coords: {
      latitude: "",
      longitude: "",
    },
  });
  const global = useContext(MyContext);

  useEffect(() => {
    getCurrentLocation((position) => {
      currentPosition = position;
      setSelectedCordinates({
        coords: {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        },
      });
      getData = [
        parseFloat(global.myState.userBusinessInfo.long),
        parseFloat(global.myState.userBusinessInfo.lat),
      ];
      setCoordinates(currentPosition);
    });
  }, []);
  const changeLocation = async (e: any) => {
    setSelectedCordinates({
      coords: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
    });
    let arrayData = {
      coords: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
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
        isRightText={false}
        onPress={() => navigation.goBack()}
      ></HeaderWithBack>
      <View style={{ flex: 1 }}>
        {selectedCordinates?.coords?.longitude ? (
          <MapView
            onPoiClick={(e) => {
              if (isFrom !== "ProfileBusinessAddress") {
                changeLocation(e);
              }
            }}
            onPress={(e) => {
              if (isFrom !== "ProfileBusinessAddress") {
                changeLocation(e);
              }
              // e.stopPropagation();
            }}
            showsUserLocation
            loadingEnabled
            style={{ flex: 1 }}
            initialRegion={{
              latitude: selectedCordinates?.coords?.latitude,
              longitude: selectedCordinates?.coords?.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: selectedCordinates?.coords?.latitude,
              longitude: selectedCordinates?.coords?.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            //  onRegionChange={this.onRegionChange}
          >
            <Marker
              draggable
              coordinate={{
                latitude: selectedCordinates?.coords?.latitude,
                longitude: selectedCordinates?.coords?.longitude,
              }}
              title={"title"}
              description={"description"}
            />
          </MapView>
        ) : // <MapView
        //   style={{ flex: 1 }}
        //   logoEnabled={false}
        //   scrollEnabled={true}
        //   rotateEnabled={false}
        //   onPress={feature =>
        //     isFrom !== "ProfileBusinessAddress"
        //       ? getSelectedCoordinates(feature.geometry.coordinates)
        //       : null
        //   }
        //   // onDidFinishRenderingMapFully={() => {
        //   //   setFollowUserLocation(true);
        //   // }}
        // >
        //   <Camera
        //     // followUserMode={"normal"}
        //     // followUserLocation={true}
        //     // followZoomLevel={11}
        //     // animationMode={"flyTo"}
        //     zoomLevel={11}
        //     centerCoordinate={
        //       isFrom !== "ProfileBusinessAddress"
        //         ? [coordinates?.coords?.longitude, coordinates?.coords?.latitude]
        //         : getData
        //     }
        //     // centerCoordinate={ !== 0 ? coordinatesForMap[3].beachCoordinate : []}
        //   />

        //   <PointAnnotation
        //     key={`pointAnnotation${1}`}
        //     id={`pointAnnotation${1}`}
        //     coordinate={
        //       isFrom !== "ProfileBusinessAddress"
        //         ? [selectedCordinates?.coords?.longitude, selectedCordinates?.coords?.latitude]
        //         : getData
        //     }
        //   >
        //     <Icon name={"map-marker-alt"} size={35} color={colors.pink} />
        //   </PointAnnotation>
        // </MapView>
        null}
      </View>
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
};

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    backgroundColor: "#F5F4F7",
    flex: 1,
  },
});

export default ChooseFromMap;
