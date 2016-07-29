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
  View,
  Navigator
} from 'react-native';
import Home from './scenes/Home';
import PokemonInfos from './scenes/PokemonInfos';


class ThePokemonMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderScene(route, navigator) {
    if (route.name == 'PokeInfos') {
      return <PokemonInfos pokemonInfos={route.pokemonInfos} navigator={navigator}/>

    }
    if (route.name == 'Home') {
      return <Home navigator={navigator}/>
    }
  }

  render() {
    return (
      <Navigator
        style={{flex: 1}}
        initialRoute={{name: 'Home'}}
        renderScene={ this.renderScene.bind(this) }/>
    );
  }
}
AppRegistry.registerComponent('ThePokemonMap', () => ThePokemonMap);
