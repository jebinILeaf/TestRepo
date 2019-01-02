/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, ToastAndroid } from "react-native";

import BackgroundGeolocation from "react-native-background-geolocation";

type Props = {};
export default class App extends Component<Props> {
  constructor(Props) {
    super(Props);

    this.state = {
      latitude: 0.0,
      longitude: 0.0,
      locationsArray: []
    };

    this.onLocation = this.onLocation.bind(this);
  }

  componentWillMount() {
    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.onLocation(this.onLocation, this.onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(this.onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(this.onActivityChange);

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(this.onProviderChange);

    // 2.  Execute #ready method (required)

    BackgroundGeolocation.ready(
      {
        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        // Activity Recognition
        stopTimeout: 1,
        // Application config
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
        // HTTP / SQLite config
        url: "http://yourserver.com/locations",
        batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
        headers: {
          // <-- Optional HTTP headers
          "X-FOO": "bar"
        },
        params: {
          // <-- Optional HTTP params
          auth_token: "maybe_your_server_authenticates_via_token_YES?"
        }
      },
      state => {
        console.warn(
          "- BackgroundGeolocation is configured and ready: ",
          state.enabled
        );

        if (!state.enabled) {
          ////
          // 3. Start tracking!
          //
          BackgroundGeolocation.start(function() {
            console.warn("- Start success");
          });
        }
      }
    );
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }

  onLocation(location) {
    console.warn("[location] -", location);
    ToastAndroid.show(
      "LOCATION!!!-" + JSON.stringify(location),
      ToastAndroid.LONG
    );

    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;

    var isFound = false;
    for (let i = 0; i < this.state.locationsArray.length; i++) {
      let location = this.state.locationsArray[i];
      if (location.latitude == latitude && location.longitude == longitude) {
        isFound = true;
        break;
      }
    }

    if (!isFound && this.state.locationsArray.length > 1) {
      var tempArray = this.state.locationsArray;
      var dict = {
        latitude: latitude,
        longitude: longitude
      };
      tempArray.push(dict);
    }

    this.setState({
      latitude: latitude,
      longitude: longitude
    });
  }
  onError(error) {
    console.warn("[location] ERROR -", error);
    ToastAndroid.show("ERROR!!!-" + error, ToastAndroid.LONG);
  }
  onActivityChange(event) {
    console.warn("[activitychange] -", event); // eg: 'on_foot', 'still', 'in_vehicle'
    ToastAndroid.show(
      "ACTIVITY CHANGE-" + JSON.stringify(event),
      ToastAndroid.LONG
    );
  }
  onProviderChange(provider) {
    console.warn("[providerchange] -", provider.enabled, provider.status);
    ToastAndroid.show(
      "PROVIDER CHANGE-" + provider.enabled + "-" + provider.status,
      ToastAndroid.LONG
    );
  }
  onMotionChange(event) {
    console.warn("[motionchange] -", event.isMoving, event.location);
    ToastAndroid.show(
      "MOTION CHANGE-" + event.isMoving + "-" + event.location,
      ToastAndroid.LONG
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{"Latitude: " + this.state.latitude}</Text>
        <Text>{"Longitude: " + this.state.longitude}</Text>
        {this.state.locationsArray.map(data => {
          return (
            <View>
              <Text>{"Latitude: " + data.latitude}</Text>
              <Text>{"Longitude: " + data.longitude}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "powderblue"
  }
});
