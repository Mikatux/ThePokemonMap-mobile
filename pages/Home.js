/**
 * Created by Mika on 7/21/16.
 */
'use strict';

import React, {Component} from 'react';

import StatusBar from '../components/StatusBar';
import ActionButton from '../components/ActionButton';
import {View, Linking} from 'react-native';
import MapView from 'react-native-maps' // fix for iOS : https://github.com/lelandrichardson/react-native-maps/issues/371#issuecomment-231585153
import styles from '../styles.js'
import firebase from 'firebase'

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {nearPokemons: [], currentPosition: {latitude: 48.8566, longitude: 2.3522}};

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({currentPosition: position.coords});
      },
      (error) => {
        console.log(JSON.stringify(error));
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  componentDidMount() {
    const self = this;
    firebase.database().ref('map').child('pokemons').on('value', function (snapshot) {
      const pokemonsTab = [];

      Object.keys(snapshot.val()).map((key)=> {
        const currentPokemon = snapshot.val()[key];
        currentPokemon.key = key
        currentPokemon.name = 'pokemonName';
        currentPokemon.image = 'http://www.serebii.net/pokemongo/pokemon/005.png';
        pokemonsTab.push(currentPokemon);
        //console.log(currentPokemon)
      });
      self.setState({nearPokemons: pokemonsTab})
    });

    navigator.geolocation.watchPosition((position) => {
      this.setState({currentPosition: position.coords});
    });
  }

  refresh() {

  }

  onRegionChange(region) {
    this.setState({region});
  }

  render() {
    const region = this.state.currentPosition;
    region.latitudeDelta = 0.1;
    region.longitudeDelta = 0.1;
    return (
      <View style={styles.container}>
        <StatusBar title="The Pokemon App"/>
        <MapView style={styles.map}
                 region={region}
        >
          {this.state.nearPokemons.map(pokemon => (
            <MapView.Marker
              coordinate={pokemon.coordinates}
              title={pokemon.name}
              image={pokemon.image}
              key={pokemon.key}

            />
          ))}
        </MapView>
        <ActionButton onPress={this.refresh.bind(this)} title="Refresh"/>
      </View>
    );
  }
}

module.exports = HomePage;
