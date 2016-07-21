'use strict';

import React, {Component} from 'react';
import styles from '../styles.js';
import { StyleSheet, Text, View, TouchableHighlight} from 'react-native';


class ActionButton extends Component {
  render() {
    const constants = styles.constants;

    return (
      <View style={styles.action}>
        <TouchableHighlight
          underlayColor={constants.actionColor}
          onPress={this.props.onPress}>
          <Text style={styles.actionText}>{this.props.title}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = ActionButton;
