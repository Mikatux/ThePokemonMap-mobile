/**
 * Created by Mika on 7/21/16.
 */
'use strict';

import React, {Component} from 'react';

import StatusBar from '../components/StatusBar';
import ActionButton from '../components/ActionButton';
import {View} from 'react-native';
import MapView from 'react-native-maps' // fix for iOS : https://github.com/lelandrichardson/react-native-maps/issues/371#issuecomment-231585153
import styles from '../styles.js'

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  refresh() {

  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar title="The Pokemon App"/>
        <MapView
          style={styles.map}
        />
        <ActionButton onPress={this.refresh.bind(this)} title="Refresh"/>
      </View>
    );
  }
}

module.exports = HomePage;
