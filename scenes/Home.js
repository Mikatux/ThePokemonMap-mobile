/**
 * Created by Mika on 7/21/16.
 */
'use strict';

import React, {Component} from 'react';
import StatusBar from '../components/StatusBar';
import ActionButton from '../components/ActionButton';
import {View, Linking, Image, Text} from 'react-native';
import MapView from 'react-native-maps';  // fix for iOS : https://github.com/lelandrichardson/react-native-maps/issues/371#issuecomment-231585153
import styles from '../styles.js';

//import Pokeio from 'pokemon-go-node-api';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {nearPokemons: [], currentPosition: {latitude: 48.8566, longitude: 2.3522}};
  }

  getNearPokemonAsync() {
    const self = this;
    const currentPos = this.state.currentPosition;
    fetch(`https://pokevision.com/map/data/${currentPos.latitude}/${currentPos.longitude}`)
      .then((response) => {
        let jsonresponse = {};
        try {
          jsonresponse = response.json();
        }
        catch (err) {
          console.log('response is not json')
        }
        return jsonresponse
      })
      .then((responseJson) => {
        if (responseJson.status == 'success') {
          console.log('find :' + responseJson.pokemon.length + ' pokemons')
          self.setState({nearPokemons: responseJson.pokemon})
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setPokemon() {
    const pokemonInfos ={imgUri:'http://www.serebii.net/pokemongo/pokemon/005.png',infos:['a','b']}
    this.props.navigator.push({
      name: 'PokeInfos',
      pokemonInfos
    })
  }

  componentDidMount() {
    const self = this;
    this.getNearPokemonAsync();


    navigator.geolocation.watchPosition((position) => {
      self.setState({currentPosition: position.coords});

      self.getNearPokemonAsync();
      //self.refresh();
    });

  }

  refresh() {
    const currentPos = this.state.currentPosition;
    fetch(`https://pokevision.com/map/scan/${currentPos.latitude}/${currentPos.longitude}`)
      .then((response) => {
        let jsonresponse = {};
        try {
          jsonresponse = response.json();
        }
        catch (err) {
          console.log('response is not json')
        }
        return jsonresponse
      })
      .then((responseJson) => {
        if (responseJson.status == 'success') {
          console.log('ok scan');
        }
        else
          console.log('not ok scan');

      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    let region = {latitude: 48.8566, longitude: 2.3522};
    if (this.state.currentPosition && this.state.currentPosition.latitude && this.state.currentPosition.longitude)
      region = this.state.currentPosition;

    return (
      <View style={styles.container}>
        <StatusBar title="The Pokemon Map"/>
        <MapView style={styles.map}
                 region={region}
        >
          <MapView.Marker coordinate={region}/>
          {this.state.nearPokemons.map(pokemon => (

            <MapView.Marker onPress={this.setPokemon.bind(this)}
              coordinate={{latitude: pokemon.latitude, longitude: pokemon.longitude}}
              key={pokemon.id}>
              <PokemonMarker pokemon={pokemon} showTimeout={false}/>
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
    this.state = {timeLeft: 1, interval: null}
  }

  getImgUrlFromPokemonNumber() {
    const pokemonNumber=this.props.pokemon.pokemonId;
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
    if (this.props.showTimeout) {

      const interval = setInterval(()=> {
        //console.log(this.props.pokemon.expiration_time)
        this.setState({timeLeft: (this.props.pokemon.expiration_time * 1000 - new Date().getTime()) / 1000})
      }, 1000)
      this.setState({interval});
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
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
      <View >
        <Image source={{uri: this.getImgUrlFromPokemonNumber()}}
               style={{width: 40, height: 40}}/>
        {timeoutText}
      </View>
    );
  }
}

module.exports = HomePage;
