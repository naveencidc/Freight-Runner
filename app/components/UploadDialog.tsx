/*************************************************
 * FreightRunner
 * @exports
 * @function uploadS3Service.ts
 * @extends Component
 * Created by Naveen E on 23/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import React, { FC, useContext, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  Modal,
  ActivityIndicator,
} from "react-native";
import { View } from ".";
import colors from "../styles/colors";
import Spinner from "react-native-spinkit";
import { MyContext } from "../../app/context/MyContextProvider";
import * as Progress from "react-native-progress";
import { fontSizes } from "../styles/globalStyles";
import FastImage from "react-native-fast-image";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

type Props = {
  title: string;
  titleColor: string;
  backgroundColor: string;
  borderColor: string;
  onPress(): void;
  btnLoading: boolean;
};
const _renderContent = (global: any) => {
  let uploadStatus = global.myState.uploadStatus;
  let progress = global.myState.progress;
  let activeCount = global.myState.activeCount;
  let totalCount = global.myState.totalCount;
  if (uploadStatus === 0) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ActivityIndicator color={colors.background} size="large" />
        <Text
          style={{
            color: colors.background,
            fontSize: fontSizes.xSmall,
            marginLeft: 10,
          }}
        >
          Initializing...
        </Text>
      </View>
    );
  } else if (uploadStatus === 1) {
    return (
      <View>
        {totalCount ? (
          <Text
            style={{
              color: colors.background,
              fontSize: 14,
              marginBottom: 10,
            }}
          >
            Uploading {activeCount} of {totalCount}
          </Text>
        ) : (
          <Text
            style={{
              color: colors.background,
              fontSize: 14,
              marginBottom: 10,
            }}
          >
            Uploading
          </Text>
        )}

        <Text
          style={{
            color: colors.background,
            fontSize: 12,
            marginBottom: 15,
          }}
        >
          {progress}% completed..
        </Text>
        <Progress.Bar
          unfilledColor={"white"}
          borderColor={colors.background}
          color={colors.background}
          progress={progress / 100}
          height={10}
          width={deviceWidth - 80}
        />
      </View>
    );
  } else if (uploadStatus === 2) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ActivityIndicator color={colors.background} size="large" />
        <Text
          style={{
            color: colors.background,
            fontSize: fontSizes.small,
            marginLeft: 10,
          }}
        >
          Verifiying upload...
        </Text>
      </View>
    );
  } else if (uploadStatus === 3) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: colors.background,
            fontSize: fontSizes.medium,
            marginRight: 10,
          }}
        >
          Upload completed
        </Text>
        <FastImage
          style={{
            width: 25,
            height: 25,
          }}
          source={require("../assets/images/greenTick.png")}
        />
      </View>
    );
  }
};

const UploadDialog: React.FC<Props> = ({
  title,
  titleColor,
  backgroundColor,
  borderColor,
  onPress,
  btnLoading,
}) => {
  const global = useContext(MyContext);
  let isModalVisible = global.myState.isModalVisible;
  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      // visible={this.props.isModalVisible}
      visible={isModalVisible}
      onRequestClose={() => {
        //   this.props.closeDateFilterPopUp();
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.60)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{}}>
          <View
            style={{
              width: deviceWidth - 40,
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
            }}
          >
            {_renderContent(global)}
            {/* <View style={{ height: 20 }} /> */}
            {/* {this._renderActionButton()} */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

type Styles = {
  titleText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  titleText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default UploadDialog;
