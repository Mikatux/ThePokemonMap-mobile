/**
 * Created by Mika on 7/21/16.
 */
'use strict';

import React, { Component } from 'react';
import StatusBar from '../components/StatusBar';
import ActionButton from '../components/ActionButton';
import { View, Linking, Image, Text } from 'react-native';
import MapView from 'react-native-maps';
import styles from '../styles.js'; // fix for iOS : https://github.com/lelandrichardson/react-native-maps/issues/371#issuecomment-231585153

//import Pokeio from 'pokemon-go-node-api';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = { nearPokemons: [], currentPosition: { latitude: 48.8566, longitude: 2.3522 } };
  }

  getNearPokemonAsync() {
    const self = this;
    const currentPos = this.state.currentPosition;
    fetch(`https://pokevision.com/map/data/${currentPos.latitude}/${currentPos.longitude}`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 'success') {
          self.setState({ nearPokemons: responseJson.pokemon })
          console.log(JSON.stringify(responseJson))
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    const self = this;
    this.getNearPokemonAsync();
 

    navigator.geolocation.watchPosition((position) => {
      this.setState({ currentPosition: position.coords });

      console.log('watch');
      console.log(position.coords);
      this.getNearPokemonAsync();
    });

  }

  refresh() {
    const currentPos = this.state.currentPosition;
    fetch(`https://pokevision.com/map/scan/${currentPos.latitude}/${currentPos.longitude}`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 'success') {
          console.log('ok scan');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const region = { latitude: 48.8566, longitude: 2.3522 };
    region.latitudeDelta = 0.1;
    region.longitudeDelta = 0.1;
    return (
      <View style={styles.container}>
        <StatusBar title="The Pokemon Map"/>
        <MapView style={styles.map}
                 region={region}
        >
          {this.state.nearPokemons.map(pokemon => (

            <MapView.Marker
              coordinate={pokemon.coordinates}
              key={pokemon.uid}>
              <PokemonMarker pokemon={pokemon} showTimeout={true}/>
            </MapView.Marker>
          ))}
        </MapView>
        <ActionButton onPress={this.refresh.bind(this)} title="Refresh"/>
      </View>
    );
  }
}

class PokemonMarker extends Component {
  constructor(props) {
    super(props);
    this.state = { timeLeft: 1 }
  }

  getImgUrlFromPokemonNumber(pokemonNumber) {
    let fullNumber = '000';
    if (pokemonNumber < 10)
      fullNumber = '00' + pokemonNumber;
    else if (pokemonNumber < 100)
      fullNumber = '0' + pokemonNumber;
    else
      fullNumber = pokemonNumber;
    return `http://www.serebii.net/pokemongo/pokemon/${fullNumber}.png`;
  }

  componentDidMount() {
    setInterval(()=> {
      this.setState({ timeLeft: (this.props.pokemon.expiration_time - new Date().getTime()) / 1000 })
    }, 1000)
  }

  secToString(seconds) {
    if (seconds < 0)
      return '0:0';
    const minutesLeft = parseInt(seconds / 60);

    seconds %= 60;
    return `${minutesLeft}:${parseInt(seconds)}`;
  }

  render() {
    var timeoutText;
    if (this.props.showTimeout) {
      timeoutText = <Text style={styles.markerText}>{this.secToString(this.state.timeLeft)} </Text>;
    }
    return (
      <View>
        <Image source={{ uri: this.getImgUrlFromPokemonNumber(this.props.pokemon.pokemonId) }}
               style={{ width: 40, height: 40 }}/>
        {timeoutText}
      </View>
    );
  }
}

module.exports = HomePage;
