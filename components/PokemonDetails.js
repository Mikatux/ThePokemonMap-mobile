/**
 * Created by Mika on 7/28/16.
 */

'use strict';

import React, {Component} from 'react';
import {View, Linking, Image, Text,ListView} from 'react-native';
import MapView from 'react-native-maps';
import styles from '../styles.js'; // fix for iOS : https://github.com/lelandrichardson/react-native-maps/issues/371#issuecomment-231585153

//import Pokeio from 'pokemon-go-node-api';

class PokemonDetails extends Component {
  constructor(props) {
    super(props);
    this.ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    console.log(this.props.infos);
    this.state = {
      dataSource: this.ds.cloneWithRows(this.props.infos),
    }
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    );
  }
}

module.exports = PokemonDetails;
