import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TextStyle, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { View } from ".";
import colors from "../styles/colors";
import { fontSizes } from "../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

const deviceHeight = Dimensions.get("window").height;

type Props = {
  truckName: string;
  modalYear: string;
  vNumber: string;
  brandName: string;
  brandIcon: string;
  tons: string;
  trailerLength: string;
  isFrom: string;
  onPress(): void;
  navigation: any;
  item: any;
};

const MyTruckListAndTrailerList: React.FC<Props> = ({
  truckName,
  vNumber,
  modalYear,
  brandName,
  brandIcon,
  tons,
  trailerLength,
  isFrom,
  item,
  onPress
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <View
      style={{
        backgroundColor: colors.white
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={{ marginHorizontal: 15, marginVertical: deviceHeight / 40 }}>
          <View
            style={{
              flexDirection: "row"
            }}
          >
            <View>
              <FastImage
                onLoadStart={() => {
                  setLoading(true);
                }}
                onLoadEnd={() => {
                  setLoading(false);
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10
                }}
                source={
                  isFrom === "TruckList"
                    ? item.modelDetails?.image
                      ? { uri: item.modelDetails?.image }
                      : require("../assets/images/truck_new.png")
                    : item.trailerTypeDetails?.thumbnail
                    ? { uri: item.trailerTypeDetails?.thumbnail }
                    : require("../assets/images/gooseneck.png")
                }
                resizeMode={FastImage.resizeMode.contain}
              ></FastImage>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ width: 100, height: 100, borderRadius: 10, position: "absolute" }}
                  LinearGradient={LinearGradient}
                />
              ) : null}
            </View>

            <View
              style={{
                flexDirection: "column",
                paddingHorizontal: 15,
                marginTop: isFrom === "TruckList" ? 0 : 5
              }}
            >
              <View style={{}}>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {isFrom === "TruckList" ? truckName : truckName}
                </Text>
                {isFrom === "TruckList" ? (
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        marginTop: 5,
                        backgroundColor: "lightgray",
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        paddingVertical: 1.5
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSizes.xSmall,
                          color: "#000000"
                        }}
                      >
                        {isFrom === "TruckList"
                          ? item.powerTypeDetails?.type
                          : item.hookupDetails.hookup}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
              {isFrom === "TruckList" ? (
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    marginTop: isFrom === "TruckList" ? 5 : 0,
                    color: colors.lightGrey
                  }}
                >
                  {isFrom === "TruckList" ? "VIN: " : null}
                  {isFrom === "TruckList" ? (vNumber ? vNumber : " -- ") : null}
                </Text>
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      marginTop: 10,
                      backgroundColor: "lightgray",
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      paddingVertical: 1.5
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizes.xSmall,
                        color: "#000000"
                      }}
                    >
                      {item.hookupDetails?.hookup}
                    </Text>
                  </View>
                </View>
              )}

              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      fontSize: fontSizes.xSmall,
                      color: "#858C97",
                      marginTop: 10
                    }}
                  >
                    {isFrom === "TruckList" ? "Model Year" : "Trailer Length"}
                  </Text>
                  <Text style={{ fontSize: fontSizes.regular, marginTop: 5 }}>
                    {isFrom === "TruckList" ? modalYear : trailerLength}
                  </Text>
                </View>
                <View style={{ flexDirection: "column", marginHorizontal: 25 }}>
                  <Text
                    style={{
                      fontSize: fontSizes.xSmall,
                      color: "#858C97",
                      marginTop: 10
                    }}
                  >
                    {isFrom === "TruckList" ? "Brand" : "Capacity in LBS"}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 5,
                      alignItems: "center"
                    }}
                  >
                    {isFrom === "TruckList" ? (
                      item.brandDetails?.logo ? (
                        <FastImage
                          style={{
                            width: 25,
                            height: 25,
                            alignSelf: "center",
                            marginRight: 10
                          }}
                          source={
                            item.brandDetails?.logo
                              ? { uri: item.brandDetails?.logo }
                              : require("../assets/images/dodge.png")
                          }
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      ) : null
                    ) : null}

                    <Text
                      style={{
                        fontSize: 13,
                        marginLeft: isFrom === "TruckList" ? 0 : 0
                      }}
                    >
                      {isFrom === "TruckList" ? brandName : tons}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MyTruckListAndTrailerList;
