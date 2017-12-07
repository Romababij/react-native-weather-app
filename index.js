/**
 * Weather App
 */
'use strict'

import React, { Component } from "react";
import { AppRegistry, View } from "react-native";
import { Container, Content, Picker, Button, Text } from "native-base";

import App from "./app/index";

export default class WeatherApp extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }
  async componentWillMount() {
    // await Expo.Font.loadAsync({
    //   Roboto: require("native-base/Fonts/Roboto.ttf"),
    //   Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    //   Ionicons: require("native-base/Fonts/Ionicons.ttf")
    // });
    this.setState({ isReady: true });
  }
  render() {
    // if (!this.state.isReady) {
    //   return <Expo.AppLoading />;
    // }
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('SimpleWeather', () => WeatherApp);


