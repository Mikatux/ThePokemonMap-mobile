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
import Home from './scenes/Home';


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
