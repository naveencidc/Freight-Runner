/*************************************************
 * FreightRunner
 * @exports
 * @function PickUpDetailScreen.tsx
 * @extends Component
 * Created by Naveen E on 29/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useEffect, useState, useContext, useRef } from "react";
import {
  ViewStyle,
  Dimensions,
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Linking,
  SafeAreaView,
} from "react-native";
import HeaderWithBack from "../../components/HeaderWithBack";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import { MyContext } from "../../../app/context/MyContextProvider";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import MapWithDirection from "../../components/MapWithDirection";
// import MapboxGL from "@react-native-mapbox-gl/maps";

type Props = { navigation: any };

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const PickUpDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  let loadDetail = route.params?.loadDetail;
  const global = useContext(MyContext);
  const mapRef = useRef(null);

  const goToMap = () => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    // const latLng = `33.248905,-83.440619`;
    const latLng =
      isFrom === "PickUpDetail"
        ? `${loadDetail.origin_lat},${loadDetail.origin_lng}`
        : `${loadDetail.destination_lat},${loadDetail.destination_lng}`;
    const label =
      isFrom === "PickUpDetail"
        ? loadDetail.origin_city
        : loadDetail.destination_city;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url.replace(/ /g, ""));
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <HeaderWithBack
        title={
          isFrom === "PickUpDetail" ? "PICKUP DETAILS" : "DELIVERY DETAILS"
        }
        onPress={() => navigation.goBack()}
        isRightText={true}
        rightText="Support"
        isFrom={"LoadDetail"}
        rightOnPress={() => navigation.navigate("ContactUs")}
      />
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* {midcoordinates.length ? ( */}
          <MapWithDirection
            loadDetail={loadDetail}
            isFromLoaddetails={false}
          ></MapWithDirection>

          {/* <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{
              flex: 1,
            }}
            region={{
              latitude: parseFloat(loadDetail?.origin_lat),
              longitude: parseFloat(loadDetail?.origin_lng),
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}
            loadingEnabled
            loadingIndicatorColor={"black"}
            mapType={"standard"}
            paddingAdjustmentBehavior={"automatic"}
            zoomControlEnabled={false}
            onMapReady={() => {
              var i = setInterval(() => {
                mapRef?.current?.fitToSuppliedMarkers(
                  ["origin", "destination"],
                  {
                    edgePadding: {
                      top: 50,
                      right: 50,
                      bottom: 250,
                      left: 50,
                    },
                  }
                );
                clearInterval(i);
              }, 512);
            }}
          >
            <MapViewDirections
              origin={{
                latitude: parseFloat(loadDetail?.origin_lat),
                longitude: parseFloat(loadDetail?.origin_lng),
              }}
              destination={{
                latitude: loadDetail?.destination_lat
                  ? parseFloat(loadDetail?.destination_lat)
                  : 0,
                longitude: loadDetail?.destination_lng
                  ? parseFloat(loadDetail?.destination_lng)
                  : 0,
              }}
              mode={"DRIVING"}
              strokeColor="#000"
              apikey="AIzaSyDAmOaaNP3Yx-MBnK2wGTqWMBnAaPPEY_0"
              strokeWidth={3}
            />
            <Marker
              tracksViewChanges={false}
              coordinate={{
                latitude: loadDetail?.origin_lat
                  ? parseFloat(loadDetail?.origin_lat)
                  : 0,
                longitude: loadDetail?.origin_lng
                  ? parseFloat(loadDetail?.origin_lng)
                  : 0,
              }}
              title={"Pickup"}
              description={`${loadDetail.origin_address_line}, ${loadDetail.origin_address_city},${loadDetail.origin_address_state} - ${loadDetail.origin_address_zip}.`}
              identifier={"origin"}
            >
              <View
                style={{
                  height: 15,
                  width: 15,
                  backgroundColor: "#000000",
                  borderRadius: 50,
                  borderColor: "#000000",
                  borderWidth: 3,
                }}
              />
            </Marker>
            <Marker
              tracksViewChanges={false}
              coordinate={{
                latitude: parseFloat(loadDetail.destination_lat),
                longitude: parseFloat(loadDetail.destination_lng),
              }}
              title={"Destination"}
              description={`${loadDetail.reciever_address},${loadDetail.reciever_city},${loadDetail.reciever_state} -${loadDetail.reciever_zip}.`}
              identifier={"destination"}
            >
              <View
                style={{
                  height: 15,
                  width: 15,
                  backgroundColor: "#6064de",
                  borderRadius: 3,
                  borderColor: "#6064de",
                  borderWidth: 3,
                }}
              />
            </Marker>
          </MapView> */}

          {/* <MapboxGL.MapView style={{ flex: 0.85 }}>
              <MapboxGL.Camera zoomLevel={4} centerCoordinate={loadDetail.startcoordinates} />
              <MapboxGL.PointAnnotation
                key="pointAnnotation"
                id="pointAnnotation"
                coordinate={loadDetail.startcoordinates}
              >
                <View
                  style={{
                    height: 15,
                    width: 15,
                    backgroundColor: "#000000",
                    borderRadius: 50,
                    borderColor: "#000000",
                    borderWidth: 3
                  }}
                />
              </MapboxGL.PointAnnotation>
              <MapboxGL.PointAnnotation
                key="endpointAnnotation"
                id="endpointAnnotation"
                coordinate={loadDetail.endtcoordinates}
              >
                <View
                  style={{
                    height: 15,
                    width: 15,
                    backgroundColor: "#6064de",
                    borderRadius: 3,
                    borderColor: "#6064de",
                    borderWidth: 3
                  }}
                />
              </MapboxGL.PointAnnotation>
              <MapboxGL.ShapeSource id="line1" shape={loadDetail.route}>
                <MapboxGL.LineLayer
                  id="linelayer1"
                  style={{ lineColor: "#000000", lineWidth: 3 }}
                />
              </MapboxGL.ShapeSource>
            </MapboxGL.MapView> */}

          {/* ) : null} */}

          <View style={{ position: "absolute", width: deviceWidth, bottom: 0 }}>
            <View style={styles.renderListMainView}>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: deviceHeight / 45,
                }}
              >
                {(isFrom === "PickUpDetail" &&
                  loadDetail.shipperData?.shipperProfileDetails?.is_business ===
                    1) ||
                (isFrom !== "PickUpDetail" &&
                  loadDetail.reciever_is_business === 1) ? (
                  <Text
                    style={{ fontSize: fontSizes.medium, fontWeight: "600" }}
                  >
                    {isFrom === "PickUpDetail"
                      ? loadDetail.shipperData?.shipperProfileDetails
                          ?.business_name
                      : ""}
                  </Text>
                ) : null}

                <Text style={{ color: "#808F99", marginTop: 10 }}>
                  {isFrom === "PickUpDetail"
                    ? `${loadDetail.origin_address_city}, ${loadDetail.origin_address_state}`
                    : `${loadDetail.reciever_city}, ${loadDetail.reciever_state}`}
                </Text>
              </View>
              <View style={{ paddingHorizontal: 10 }}>
                <View
                  style={{ flex: 1, flexDirection: "row", paddingVertical: 5 }}
                >
                  <View style={{ flex: 1, paddingRight: 2 }}>
                    <Text style={{ color: "#808F99" }}>Phone #</Text>
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: fontSizes.small,
                        fontWeight: "600",
                      }}
                    >
                      +1{" "}
                      {isFrom === "PickUpDetail"
                        ? `${loadDetail.shipperData?.shipperProfileDetails?.mobile_number}`
                        : `${loadDetail.reciever_contact}`}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#808F99" }}>Email</Text>
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: fontSizes.small,
                        fontWeight: "600",
                      }}
                    >
                      {isFrom === "PickUpDetail"
                        ? `${loadDetail.shipperData?.email}`
                        : `${loadDetail.reciever_email}`}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomColor: "#F7F7F7",
                    borderBottomWidth: 1,
                    paddingVertical: 10,
                  }}
                />

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    paddingVertical: deviceHeight / 92,
                    marginTop: deviceHeight / 92,
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 2 }}>
                    <Text style={{ color: "#808F99" }}>
                      {isFrom === "PickUpDetail" ? "Pick Up" : "Delivery"}{" "}
                      address
                    </Text>
                    <Text
                      style={{
                        lineHeight: 22,
                        marginTop: 10,
                        fontSize: fontSizes.small,
                        fontWeight: "600",
                        marginRight: 5,
                      }}
                    >
                      {isFrom === "PickUpDetail"
                        ? `${loadDetail.origin_address_line}, ${loadDetail.origin_address_city}, ${loadDetail.origin_address_state} - ${loadDetail.origin_address_zip}`
                        : `${loadDetail.reciever_address}, ${loadDetail.reciever_city}, ${loadDetail.reciever_state} - ${loadDetail.reciever_zip}`}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#808F99" }}>Contact Person</Text>
                    <Text
                      style={{
                        lineHeight: 22,
                        marginTop: 10,
                        fontSize: fontSizes.small,
                        fontWeight: "600",
                      }}
                    >
                      {isFrom === "PickUpDetail"
                        ? `${
                            loadDetail.shipperData?.shipperProfileDetails
                              ?.first_name
                          }${" "}${
                            loadDetail.shipperData?.shipperProfileDetails
                              ?.last_name
                          }`
                        : `${loadDetail.reciever_name}`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{ paddingHorizontal: 20, marginVertical: deviceHeight / 40 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <TouchableOpacity
                onPress={goToMap}
                style={{
                  backgroundColor: colors.background,
                  paddingVertical: deviceHeight / 55,
                  paddingHorizontal: 20,
                  borderRadius: 30,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: fontSizes.medium,
                    fontWeight: "600",
                    color: colors.white,
                  }}
                >
                  Location
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
  renderListMainView: ViewStyle;
  verticalLineStyle: ViewStyle;
};

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    flex: 1,
  },
  renderListMainView: {
    borderWidth: 1,
    borderColor: "white",
    marginTop: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    flex: 1,
    elevation: Platform.OS === "android" ? 1 : 20,
    shadowColor: "#52006A",
    shadowOffset: { width: -2, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    paddingHorizontal: 10,
  },
  verticalLineStyle: {
    flex: 1,
    width: 1,
    borderWidth: 1,
    borderRadius: 1,
    borderColor: colors.greyLight,
    borderStyle: "dashed",
    position: "absolute",
    bottom: -28,
    top: -4,
    left: 5,
    right: 0,
  },
});

export default PickUpDetailScreen;
