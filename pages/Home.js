/**
 * Created by Mika on 7/21/16.
 */
'use strict';

import React, {Component} from 'react';

import StatusBar from '../components/StatusBar';
import ActionButton from '../components/ActionButton';
import {View, Linking, Image, Text} from 'react-native';
import MapView from 'react-native-maps' // fix for iOS : https://github.com/lelandrichardson/react-native-maps/issues/371#issuecomment-231585153
import styles from '../styles.js'
import firebase from 'firebase'

//import Pokeio from 'pokemon-go-node-api';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {nearPokemons: [], currentPosition: {latitude: 48.8566, longitude: 2.3522}};
    /*
     navigator.geolocation.getCurrentPosition(
     (position) => {
     this.setState({currentPosition: position.coords});
     },
     (error) => {
     console.log(JSON.stringify(error));
     },
     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
     );
     */
  }

  componentDidMount() {
    const self = this;
    firebase.database().ref('map').child('pokemons').on('value', function (snapshot) {
      const pokemonsTab = [];

      Object.keys(snapshot.val()).map((key)=> {
        const currentPokemon = snapshot.val()[key];
        currentPokemon.key = key
        currentPokemon.name = 'pokemonName';
        pokemonsTab.push(currentPokemon);
        //console.log(currentPokemon)
      });
      self.setState({nearPokemons: pokemonsTab})
    });
    /*
     navigator.geolocation.watchPosition((position) => {
     this.setState({currentPosition: position.coords});
     });
     */
  }

  refresh() {

  }

  render() {
    const region = this.state.currentPosition;
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
              key={pokemon.key}>
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
    this.state = {timeLeft: 1}
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
      this.setState({timeLeft: (this.props.pokemon.disappearTime - new Date().getTime()) / 1000})
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
        <Image source={{uri: this.getImgUrlFromPokemonNumber(this.props.pokemon.pokedexNumber)}}
               style={{width: 40, height: 40}}/>
        {timeoutText}
      </View>
    );
  }
}

module.exports = HomePage;
