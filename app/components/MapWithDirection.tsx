/*************************************************
 * FreightRunner
 * @exports
 * @function MapWithDirection.tsx
 * @extends Component
 * Created by Naveen E on 20/04/2023
 * Copyright © 2023 FreightRunner. All rights reserved.
 *************************************************/

import React, { useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Config from "react-native-config";

type Props = {
  loadDetail: any;
  isFromLoaddetails: boolean;
};

const MapWithDirection: React.FC<Props> = ({
  loadDetail,
  isFromLoaddetails,
}) => {
  const mapRef = useRef(null);
  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={{
        flex: isFromLoaddetails
          ? loadDetail?.status === 9 || loadDetail?.status === 10
            ? 0.6
            : 0.4
          : 0.9,
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
          mapRef?.current?.fitToSuppliedMarkers(["origin", "destination"], {
            edgePadding: {
              top: 50,
              right: 50,
              bottom: isFromLoaddetails ? 50 : 250,
              left: 50,
            },
          });
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
    </MapView>
  );
};

export default MapWithDirection;
