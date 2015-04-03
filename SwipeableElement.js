'use strict';
var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  PanResponder,
} = React;
var Dimensions = require('Dimensions');

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

var styles = StyleSheet.create({
  swipeableElementWrapper: {
    width: SCREEN_WIDTH,
    flexDirection:'row',
    justifyContent:'center',
  },
  swipeableMain: {
    width: SCREEN_WIDTH,
    padding:10,
    backgroundColor: '#F0F0F0',
  },
  swipeableLeft: {
    overflow: 'hidden',
    width: 0,
    backgroundColor: '#FF0000',
    alignItems: 'flex-start',
    //alignSelf: 'flex-start',
  },
  swipeableRight: {
    overflow: 'hidden',
    width: 0,
    alignItems: 'flex-end',
    //alignSelf: 'flex-end',
    backgroundColor: '#0000FF',
  }
});

var SwipeableElement = React.createClass({

  _panResponder: {},

  _handleStartShouldSetPanResponder: function() {
    return true;
  },

  _handleMoveShouldSetPanResponder: function() {
    return true;
  },

  _handlePanResponderGrant: function() {},

  _handlePanResponderMove: function(e, gestureState) {
    if (!this.mainElement) {
      return;
    }
    // The dx value where the gesture should "fire"
    var activationPoint = 75;
    var dx;
    var direction = gestureState.dx > 0 ? 'right' : 'left';
    if (gestureState.dx < -150) {
      dx = -150;
    } else if (gestureState.dx > 150) {
      dx = 150;
    } else {
      dx = gestureState.dx;
    }

    var absdx = dx > 0 ? dx : -dx;
    var opacity = (absdx / 75) * 1;

    this.mainElement.setNativeProps({ left: dx });
    if (gestureState.dx > 0) {
      this.leftElement.setNativeProps({ width: dx*2, left: dx, opacity });
    } else {
      this.rightElement.setNativeProps({ width: -dx*2, right: -dx, opacity });
    }

    this.setState({ dx });
  },

  _handlePanResponderEnd: function() {
    if (this.state.dx > 75) {
      if (this.props.onSwipeRight) {
        this.props.onSwipeRight.call();
      }
    } else if (this.state.dx < -75) {
      if (this.props.onSwipeLeft) {
        this.props.onSwipeLeft.call();
      }
    }
    this.setState({dx:0,});
    this.mainElement && this.mainElement.setNativeProps({ left: 0 });
    this.leftElement && this.leftElement.setNativeProps({ width: 0 });
    this.rightElement && this.rightElement.setNativeProps({ width: 0 });
  },

  componentWillMount: function() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this.mainElement = (null : ?React.Element);
    this.leftElement = (null : ?React.Element);
    this.rightElement = (null : ?React.Element);
    this.panX = 0;
  },

  render: function() {
    return (
      <View style={styles.swipeableElementWrapper}>
        <View ref={(element) => {
            this.leftElement = element;
          }} style={styles.swipeableRight}>
          <View style={{width:300,flexDirection:'row'}}>
            <View style={{flex:1,backgroundColor:'#0000FF',}}></View>
            <Text style={{color:'#FFFFFF'}}>{this.props.swipeRightTitle}</Text>
          </View>
        </View>
        <View ref={(element) => {
            this.mainElement = element;
          }} style={styles.swipeableMain} {...this._panResponder.panHandlers}>
          {this.props.component}
        </View>
        <View ref={(element) => {
            this.rightElement = element;
          }} style={styles.swipeableLeft}>
          <View style={{width:300,overflow:'hidden'}}>
            <Text style={{color:'#FFFFFF'}}>{this.props.swipeLeftTitle}</Text>
          </View>
        </View>
      </View>
    );
  }
});

module.exports = SwipeableElement;
