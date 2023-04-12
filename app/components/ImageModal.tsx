/*************************************************
 * FreightRunner
 * @exports
 * @function ImageModal.tsx
 * @extends Component
 * Created by Naveen E on 12/09/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { FC } from "react";
import { Dimensions, Modal, Platform, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import Text from "./Text";
import View from "./View";
import colors from "../styles/colors";
import { DEVICE_WIDTH, STANDARD_BORDER_RADIUS, STANDARD_PADDING } from "../styles/globalStyles";
import FastImage from "react-native-fast-image";
import ImageZoom from "react-native-image-pan-zoom";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

type Props = {
  handleClose: () => void;
  visible: boolean;
  image: string;
};
/**
 * It will render the image on the screen with close button enabled
 */
const ImageModal: FC<Props> = ({ handleClose, visible, image }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ backgroundColor: colors.black }}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: Platform.OS === "android" ? 10 : 50,
            right: 10,
            zIndex: 1
          }}
          onPress={handleClose}
        >
          <FastImage
            resizeMode="cover"
            tintColor={"gray"}
            source={require("../../app/assets/images/close.png")}
            style={{
              height: 45,
              width: 45
            }}
          />
        </TouchableOpacity>
        {/* <FastImage
          style={{
            width: deviceWidth,

            height: deviceHeight
          }}
          source={{
            uri: image
            // priority: FastImage.priority.high
          }}
          resizeMode="contain"
        /> */}
        <ImageZoom
          cropWidth={deviceWidth}
          cropHeight={deviceHeight}
          imageWidth={deviceWidth}
          imageHeight={deviceHeight}
        >
          <FastImage
            style={{
              width: deviceWidth,

              height: deviceHeight
            }}
            source={{
              uri: image
              // priority: FastImage.priority.high
            }}
            resizeMode="contain"
          />
        </ImageZoom>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});

export default ImageModal;
