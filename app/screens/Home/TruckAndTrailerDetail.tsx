/*************************************************
 * FreightRunner
 * @exports
 * @function TruckAndTrailerDetail.tsx
 * @extends Component
 * Created by Deepak B on 13/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useContext, useEffect, useState } from "react";
import {
  ViewStyle,
  Dimensions,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Image,
  FlatList,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import colors from "../../styles/colors";
import HeaderWithBack from "../../components/HeaderWithBack";
import { fontSizes } from "../../styles/globalStyles";
import FastImage from "react-native-fast-image";
import { CustomButton } from "../../components";
import {
  deleteUserTrailer,
  deleteUserTruck,
  getUserTrailerList,
  getUserTruckList,
} from "../../services/myProfileServices";
import { MyContext } from "../../context/MyContextProvider";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import storage from "../../helpers/storage";
type Props = { navigation: any };
import LinearGradient from "react-native-linear-gradient";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const TruckAndTrailerDetail: React.FC<Props> = ({ navigation, route }) => {
  let item = route.params?.item;
  let isFrom = route.params?.isFrom;
  const [loading, setLoading] = useState(false);
  const global = useContext(MyContext);
  let trailerListArray: Array<string> = [];
  let findTrailerIndexData: any = {};
  let truckListArray: Array<string> = [];
  let findTruckIndexData: any = {};
  const [imageLoading, setimageLoading] = useState(false);
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);

  // for delete user truck
  const deleteTruck = async () => {
    setLoading(true);
    truckListArray = [...global.myState.userTruckList.results];
    findTruckIndexData = truckListArray.find(
      (id) => id.truck_id === item.truck_id
    );
    let index = truckListArray.findIndex((id) => id.truck_id === item.truck_id);
    try {
      await deleteUserTruck(findTruckIndexData.truck_id)
        .then(async (response) => {
          setLoading(false);
          if (response.status === 200) {
            if (index !== -1) {
              truckListArray.splice(index, 1);
            }
            fetchTruckListAPI();
            setMessage("Truck Deleted Successfully.");
            setVisible(true);
            navigation.goBack();
          }
        })
        .catch((e) => {
          setLoading(false);
          Alert.alert("Error", e.response.data.message);
        });
    } catch (e) {
      Alert.alert(
        "Error",
        "There was a error deleting a truck. Please try again later."
      );
      setLoading(false);
    }
  };

  // for delete user trailer
  const deleteTrailer = async () => {
    setLoading(true);
    trailerListArray = [...global.myState.userTrailerList.results];
    findTrailerIndexData = trailerListArray.find(
      (id) => id.trailer_id === item.trailer_id
    );
    let index = trailerListArray.findIndex(
      (id) => id.trailer_id === item.trailer_id
    );
    try {
      await deleteUserTrailer(findTrailerIndexData.trailer_id)
        .then(async (response) => {
          setLoading(false);
          if (response.status === 200) {
            if (index !== -1) {
              trailerListArray.splice(index, 1);
            }
            fetchTrailerListAPI();
            setMessage("Trailer Deleted successfully.");
            setVisible(true);
            navigation.goBack();
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log("login error", e.response);
          Alert.alert("Error", e.response.data.message);
        });
    } catch (e) {
      Alert.alert(
        "Error",
        "There was a error deleting a trailer. Please try again later."
      );
      setLoading(false);
    }
  };

  const fetchTruckListAPI = async () => {
    const userDetail = await storage.get("userData");
    const userTruckList = await getUserTruckList(userDetail.user_id, "0", "10");
    global.myDispatch({
      type: "GET_USER_TRUCK_LIST",
      payload: userTruckList.data,
    });
  };

  const fetchTrailerListAPI = async () => {
    const userDetail = await storage.get("userData");
    const userTrailerList = await getUserTrailerList(
      userDetail.user_id,
      "0",
      "10"
    );
    global.myDispatch({
      type: "GET_USER_TRAILER_LIST",
      payload: userTrailerList.data,
    });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <HeaderWithBack
        title={
          isFrom === "TruckList"
            ? item && item.modelDetails.model_name
            : item && item.trailerTypeDetails?.trailer_type_name
        }
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText=""
        isFrom={isFrom}
        // rightOnPress={() => navigation.goBack()}
      ></HeaderWithBack>
      <View style={{ flex: 1, backgroundColor: "#F5F4F7" }}>
        <View
          style={{
            backgroundColor: colors.white,
            marginTop: 15,
          }}
        >
          <View
            style={{
              backgroundColor: "#F5F4F7",
              marginHorizontal: 20,
              marginVertical: 20,
              borderRadius: 10,
            }}
          >
            <FastImage
              style={{ width: 200, height: 170, alignSelf: "center" }}
              source={
                isFrom === "TruckList"
                  ? item.modelDetails?.image
                    ? { uri: item.modelDetails?.image }
                    : require("../../assets/images/truck_new.png")
                  : item.trailerTypeDetails?.thumbnail
                  ? { uri: item.trailerTypeDetails?.thumbnail }
                  : require("../../assets/images/gooseneck.png")
              }
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          {/* <View style={{ paddingVertical: 20 }}> */}
          <ScrollView
            scrollEnabled={isFrom === "TruckList" ? false : true}
            style={{
              flexDirection: "column",
              marginHorizontal: 20,
              paddingBottom: 25,
              maxHeight:
                Platform.OS === "android"
                  ? deviceHeight / 1.86
                  : deviceHeight / 2.1,
            }}
          >
            {/* {isFrom === "TruckList" ? ( */}
            <>
              <Text
                style={{
                  fontSize: fontSizes.xSmall,
                  color: colors.lightGrey,
                  marginTop: 15,
                }}
              >
                {isFrom !== "TruckList" ? "Trailer Hookup" : "Power Type"}
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.small,
                  fontWeight: "600",
                  marginTop: 5,
                }}
              >
                {isFrom !== "TruckList"
                  ? item.hookupDetails.hookup
                  : item.powerTypeDetails?.type}
              </Text>
            </>
            {/* ) : null} */}
            <Text
              style={{
                fontSize: fontSizes.xSmall,
                color: colors.lightGrey,
                marginTop: 15,
              }}
            >
              {isFrom === "TruckList" ? "Model" : "Trailer Type"}
            </Text>
            <Text
              style={{
                fontSize: fontSizes.small,
                fontWeight: "600",
                marginTop: 5,
              }}
            >
              {isFrom === "TruckList"
                ? item.modelDetails.model_name
                : item.trailerTypeDetails?.trailer_type_name}
            </Text>
            {/* {isFrom !== "TruckList" ? (
              <View>
                <Text
                  style={{ fontSize: fontSizes.xSmall, color: colors.lightGrey, marginTop: 15 }}
                >
                  Connection
                </Text>
                <Text style={{ fontSize: fontSizes.small, fontWeight: "600", marginTop: 5 }}>
                  {item.trailerConnectionDetails?.connection_name}
                </Text>
                <Text
                  style={{ fontSize: fontSizes.xSmall, color: colors.lightGrey, marginTop: 15 }}
                >
                  Platform
                </Text>
                <Text style={{ fontSize: fontSizes.small, fontWeight: "600", marginTop: 5 }}>
                  {item.trailerPlatformDetails?.platform_name}
                </Text>
                <Text
                  style={{ fontSize: fontSizes.xSmall, color: colors.lightGrey, marginTop: 15 }}
                >
                  Axles
                </Text>
                <Text style={{ fontSize: fontSizes.small, fontWeight: "600", marginTop: 5 }}>
                  {item.trailerAxleDetails?.axle_name}
                </Text>
              </View>
            ) : null} */}
            <Text
              style={{
                fontSize: fontSizes.xSmall,
                color: colors.lightGrey,
                marginTop: 15,
              }}
            >
              {isFrom === "TruckList" ? "VIN Number" : "Trailer Length"}
            </Text>
            <Text
              style={{
                fontSize: fontSizes.small,
                fontWeight: "600",
                marginTop: 5,
              }}
            >
              {isFrom === "TruckList"
                ? item.vin
                  ? item.vin
                  : "--"
                : `${item.length} feet`}
            </Text>
            <Text
              style={{
                fontSize: fontSizes.xSmall,
                color: colors.lightGrey,
                marginTop: 15,
              }}
            >
              {isFrom === "TruckList" ? "Model Year" : "Max Load Capacity"}
            </Text>
            <Text
              style={{
                fontSize: fontSizes.small,
                fontWeight: "600",
                marginTop: 5,
              }}
            >
              {isFrom === "TruckList" ? item.year : `${item.capacity} lbs`}
            </Text>
            {isFrom !== "TruckList" ? (
              <View style={{ marginTop: 15, marginBottom: 30 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "500", color: "gray" }}
                >
                  OffLoad Equipments
                </Text>
                <FlatList
                  numColumns={item.offload_equipments.length > 4 ? 2 : 1}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  data={item.offload_equipments}
                  style={{ marginTop: 5 }}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 5,
                          marginRight: 15,
                          flex: 1,
                        }}
                      >
                        <Text style={{ fontSize: 8, fontWeight: "600" }}>
                          {"\u2B24"}
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSizes.small,
                            fontWeight: "600",
                            marginLeft: 5,
                          }}
                        >
                          {item.equipment_name}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            ) : null}
            {isFrom === "TruckList" ? (
              <View>
                <Text
                  style={{
                    fontSize: fontSizes.xSmall,
                    color: colors.lightGrey,
                    marginTop: 15,
                  }}
                >
                  {isFrom === "TruckList" ? "Brand Name" : null}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    alignItems: "center",
                  }}
                >
                  {item.brandDetails?.logo ? (
                    <FastImage
                      style={{
                        width: 25,
                        height: 25,
                        alignSelf: "center",
                        marginRight: 10,
                      }}
                      source={
                        item.brandDetails?.logo
                          ? { uri: item.brandDetails?.logo }
                          : require("../../assets/images/dodge.png")
                      }
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  ) : null}

                  <Text
                    style={{
                      fontSize: fontSizes.small,
                      fontWeight: "600",
                    }}
                  >
                    {item.brandDetails.brand_name}
                  </Text>
                </View>
              </View>
            ) : null}
          </ScrollView>
          {/* </View> */}
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 15,
            right: 20,
            left: 20,
          }}
        >
          <CustomButton
            titleColor={"#B60F0F"}
            borderColor={"#B60F0F"}
            onPress={() => {
              if (isFrom === "TrailerList") {
                deleteTrailer();
              } else {
                deleteTruck();
              }
            }}
            title="Delete"
            backgroundColor={colors.white}
            btnLoading={loading}
            isFrom={"TruckAndTrailerDetail"}
          ></CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
};

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    flex: 1,
  },
});

export default TruckAndTrailerDetail;
