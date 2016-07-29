/**
 * Created by Mika on 7/28/16.
 */
'use strict';

import React, {Component} from 'react';
import PokemonDetails from '../components/PokemonDetails';
import {View, Linking, Image, Text} from 'react-native';
import styles from '../styles.js'; // fix for iOS : https://github.com/lelandrichardson/react-native-maps/issues/371#issuecomment-231585153


class PokemonInfos extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{uri: this.props.pokemonInfos.imgUri}}
               style={{width: 200, height: 200}} />
       <PokemonDetails infos={this.props.pokemonInfos.infos}/>
      </View>
    );
  }
}


module.exports = PokemonInfos;
