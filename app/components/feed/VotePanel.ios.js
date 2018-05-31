import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

    const value = userVote && userVote > 0 ? 0 : 1;
    const alreadyVotedThis = userVote > 0;

    return (
      <View style={styles.itemVoteButtonWrap}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.itemVoteButton}
          onPress={() => this.voteThisItem(value)}
        >
          <View style={styles.itemVoteButton}>
            <Image
              source={heartIcon}
              style={[styles.voteImage, { tintColor: alreadyVotedThis ? theme.blush : theme.grey }]}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.itemVoteWrapper}>
        {this.renderVoteButton(true)}
        <View>
          <Text style={styles.itemVoteValue}>{this.getVotes()}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemVoteWrapper: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingLeft: 16,
    marginLeft: 8,
    minWidth: 45,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  itemVoteButtonWrap: {
    flex: 1,
    width: 40,
    height: 28,
    top: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  itemVoteButton: {
    flex: 1,
    width: 40,
    height: 28,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 0,
  },
  itemVoteValue: {
    minWidth: 15,
    textAlign: 'left',
    fontSize: 15,
    paddingVertical: 5,
    top: 4,
    left: -3,
    color: theme.grey,
  },
  voteImage: {
    height: 20,
    width: 20,
  },
});

export default VotePanel;
