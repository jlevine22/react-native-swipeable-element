'use strict';
var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  PanResponder,
  LayoutAnimation,
} = React;
var Dimensions = require('Dimensions');

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

var SWIPE_RELEASE_POINT = 70;

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
    justifyContent:'center',
    //alignSelf: 'flex-start',
  },
  swipeableRight: {
    overflow: 'hidden',
    width: 0,
    alignItems: 'flex-end',
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
    var opacity = (absdx / SWIPE_RELEASE_POINT) * 1;
    var fontSize = 6 + ((opacity > 1 ? 1 : opacity) * 8);
    var paddingTop = 15 - ((opacity > 1 ? 1 : opacity) * 5);
    var text;
    var element;

    var props = { width: absdx*2, opacity, };

    this.mainElement.setNativeProps({ left: dx });
    if (dx > 0) {
      element = this.leftElement;
      props.left = absdx;
      text = this.refs.textLeft;
    } else {
      element = this.rightElement;
      props.right = absdx;
      text = this.refs.textRight;
    }
    text.setNativeProps({ fontSize, paddingTop });
    element.setNativeProps(props);

    this.setState({ dx });
  },

  _handlePanResponderEnd: function() {
    if (this.state.dx > SWIPE_RELEASE_POINT) {
      if (this.props.onSwipeRight) {
        this.props.onSwipeRight.call();
      }
    } else if (this.state.dx < -SWIPE_RELEASE_POINT) {
      if (this.props.onSwipeLeft) {
        this.props.onSwipeLeft.call();
      }
    }
    var animations = require('../../TaskList/animations');
    LayoutAnimation.configureNext(animations.easeInEaseOut);
    this.setState({dx:0,});
    this.mainElement && this.mainElement.setNativeProps({ left: 0 });
    this.leftElement && this.leftElement.setNativeProps({ width: 0, left: 0, });
    this.rightElement && this.rightElement.setNativeProps({ width: 0, right: 0,});
    setTimeout(() => {
      this.leftElement && this.leftElement.setNativeProps({ left: null });
      this.rightElement && this.rightElement.setNativeProps({ right: null });
    }, 300);
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

  getInitialState: function() {
    return { dx: 0, };
  },

  render: function() {
    var pullOrRelease = (this.state.dx > SWIPE_RELEASE_POINT || this.state.dx < -SWIPE_RELEASE_POINT) ?
      'Release' :
      'Pull';

    return (
      <View style={styles.swipeableElementWrapper}>
        <View ref={(element) => {
            this.leftElement = element;
          }} style={styles.swipeableRight}>
          <View style={{width:300,flexDirection:'row',}}>
            <View style={{flex:1,}}></View>
            <Text ref={'textLeft'} style={{color:'#FFFFFF',padding:10,alignSelf:'center',}}>
              {pullOrRelease} to {this.props.swipeRightTitle}
            </Text>
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
            <Text ref={'textRight'} style={{color:'#FFFFFF',padding:10,}}>{pullOrRelease} to {this.props.swipeLeftTitle}</Text>
          </View>
        </View>
      </View>
    );
  }
});

module.exports = SwipeableElement;
