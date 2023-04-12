import React, { useState } from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { fontSizes } from "../styles/globalStyles";
const deviceHeight = Dimensions.get("window").height;
import LinearGradient from "react-native-linear-gradient";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

type Props = {
  cargoName: string;
  cargoDescription: string;
  cargoImage: string;
  isFrom: string;
  isSelected: string;
};

const CargoTypesLists: React.FC<Props> = ({
  cargoName,
  cargoDescription,
  cargoImage,
  isFrom,
  isSelected
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      {isFrom === "ProfileCargoTypes" ? (
        <View
          style={{
            backgroundColor: "white"
          }}
        >
          <View style={{ marginHorizontal: 15, marginVertical: deviceHeight / 50 }}>
            <View
              style={{
                flexDirection: "row"
              }}
            >
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <FastImage
                  onLoadStart={() => {
                    setLoading(true);
                  }}
                  onLoadEnd={() => {
                    setLoading(false);
                  }}
                  style={{ width: 70, height: 70, borderRadius: 10 }}
                  source={cargoImage}
                  resizeMode={FastImage.resizeMode.contain}
                ></FastImage>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ width: 70, height: 70, borderRadius: 10, position: "absolute" }}
                    LinearGradient={LinearGradient}
                  />
                ) : null}
              </View>

              <View style={{ flexDirection: "column", flex: 1, justifyContent: "center" }}>
                <Text
                  style={{ fontSize: fontSizes.regular, fontWeight: "600", paddingHorizontal: 15 }}
                >
                  {cargoName}
                </Text>
                {cargoDescription && cargoDescription.length ? (
                  <Text
                    numberOfLines={5}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: fontSizes.xSmall,
                      marginTop: 5,
                      color: "#888888",
                      opacity: 0.5,
                      paddingHorizontal: 15
                    }}
                  >
                    {cargoDescription}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: isSelected ? "#000000" : "#EDEDED",
            borderRadius: 10,
            marginVertical: 6,
            padding: 2,
            backgroundColor: "#F5F4F7"
          }}
        >
          <FastImage
            resizeMode={"contain"}
            source={
              isSelected
                ? require("../../app/assets/images/SelectedCircle.png")
                : require("../../app/assets/images/UnSelectedCircle.png")
            }
            style={{ height: 20, width: 20, margin: 8 }}
          />
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <FastImage
              onLoadStart={() => {
                setLoading(true);
              }}
              onLoadEnd={() => {
                setLoading(false);
              }}
              resizeMode={"contain"}
              source={cargoImage}
              style={{ width: 70, height: 70, borderRadius: 10, margin: 5 }}
            />
            {loading ? (
              <ShimmerPlaceHolder
                style={{ width: 70, height: 70, borderRadius: 10, position: "absolute" }}
                LinearGradient={LinearGradient}
              />
            ) : null}
          </View>
          <View style={{ flex: 1, padding: 10 }}>
            <Text
              style={{
                color: "#000000",
                opacity: isSelected ? 1 : 0.42,
                fontWeight: "bold"
              }}
            >
              {cargoName}
            </Text>
            {cargoDescription && cargoDescription.length ? (
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                style={{ color: "#888888", fontSize: fontSizes.xSmall, paddingTop: 3 }}
              >
                {cargoDescription}
              </Text>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
};

export default CargoTypesLists;
