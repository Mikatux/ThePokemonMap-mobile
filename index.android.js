/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import firebase from 'firebase';
import Home from './pages/Home';

var config = {
  apiKey: "AIzaSyBqYjdbhWjPH65E1OP1qSPnPSgCdA5qH6Q",
  authDomain: "the-pokemon-map.firebaseapp.com",
  databaseURL: "https://the-pokemon-map.firebaseio.com",
  storageBucket: "the-pokemon-map.appspot.com",
};
firebase.initializeApp(config);

class ThePokemonMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Home/>
    );
  }
}
AppRegistry.registerComponent('ThePokemonMap', () => ThePokemonMap);
