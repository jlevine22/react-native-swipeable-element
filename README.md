## Swipeable Element for React Native
Experimental element that can be swiped left or right to perform different actions.

### Usage
```
var React = require('react-native');
var {
  View,
} = React;
var SwipeableElement = require('react-native-swipeable-element');

var MyComponent = React.createClass({
  render: function() {
    return (
      <ScrollView style={{flex: 1,}}>
        <SwipeableElement
          compnent={<Text>{'Some Text'}</Text>}
          swipeRightTitle={'Delete'}
          swipeLeftTitle={'Archive'}
          onSwipeRight={() => {
            // Handle swipe
          }}
          onSwipeLeft={() => {
            // Swipe left
          }} />
      </ScrollView>
    );
  }
});

```