import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, TouchableNativeFeedback } from 'react-native';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../Text';
import theme from '../../style/theme';

const heartIcon = require('../../../assets/icons/love.png');

class VotePanel extends Component {
  @autobind
  getVotes() {
    const { votes } = this.props.item;
    const voteCount = parseInt(votes, 10);
    return voteCount > 0 ? voteCount : '';
  }

  @autobind
  voteThisItem(vote) {
    const { id } = this.props.item;

    if (this.props.isRegistrationInfoValid === false) {
      this.props.openRegistrationView();
    } else {
      this.props.voteFeedItem(id, vote);
    }
  }

  renderVoteButton(positive) {
    const { userVote } = this.props.item;
    const alreadyVotedThis = userVote > 0;

    return (
      <View style={styles.itemVoteButton}>
        <Image
          source={heartIcon}
          style={[styles.voteImage, { tintColor: alreadyVotedThis ? theme.blush : theme.grey }]}
        />
      </View>
    );
  }

  render() {
    const { userVote } = this.props.item;
    const value = userVote && userVote > 0 ? 0 : 1;

    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        delayPressIn={0}
        onPress={() => this.voteThisItem(value)}
      >
        <View style={styles.itemVoteWrapper}>
          {this.renderVoteButton(true)}
          <View>
            <Text style={styles.itemVoteValue}>{this.getVotes()}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  itemVoteWrapper: {
    flexDirection: 'row',
    padding: 5,
    paddingRight: 0,
    marginLeft: 10,
    minWidth: 50,
    minHeight: 42,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemVoteButton: {
    flex: 1,
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 0,
  },
  itemVoteValue: {
    minWidth: 20,
    textAlign: 'left',
    fontSize: 15,
    paddingVertical: 5,
    color: theme.grey,
  },
  voteImage: {
    height: 20,
    width: 20,
  },
});

export default VotePanel;
