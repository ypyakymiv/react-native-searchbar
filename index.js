import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { filter, some, includes } from 'lodash/collection';
import { debounce } from 'lodash/function';

const INITIAL_TOP = Platform.OS === 'ios' ? -80 : -66;

export default class Search extends Component {

  static propTypes = {
    placeholder: PropTypes.string,
    data: PropTypes.array,
    handleSearch: PropTypes.func,
    handleResults: PropTypes.func,
    handleChangeText: PropTypes.func,
    onBack: PropTypes.func,
    showX: PropTypes.bool,
    onBlur: PropTypes.func,
    backgroundColor: PropTypes.string,
    iconColor: PropTypes.string,
    textColor: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    animate: PropTypes.bool,
    animationDuration: PropTypes.number,
    showOnLoad: PropTypes.bool,
  }

  static defaultProps = {
    placeholder: 'Search',
    showX: true,
    backgroundColor: 'white',
    iconColor: 'gray',
    textColor: 'gray',
    placeholderTextColor: 'lightgray',
    animate: true,
    animationDuration: 200,
    showOnLoad: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      data: props.data,
      results: [],
      show: props.showOnLoad,
      top: new Animated.Value(props.showOnLoad ? 0 : INITIAL_TOP),
    };

    this.hide = this.hide.bind(this);
    this._internalSearch = this._internalSearch.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
  }

  show() {
    const { animate, animationDuration } = this.props;
    this.setState({ show: true, input: '' });
    if (animate) {
      Animated.timing(
        this.state.top, {
            toValue: 0,
            duration: animationDuration,
        }
      ).start();
    }
  }

  hide() {
    const { animate, animationDuration } = this.props;
    if (animate) {
      Animated.timing(
        this.state.top, {
            toValue: INITIAL_TOP,
            duration: animationDuration,
        }
      ).start();
      setTimeout(() => {
        this.setState({ show: false });
      }, animationDuration)
    } else {
      this.setState({ show: false });
    }
  }

  _onChangeText(input) {
    const { handleChangeText, handleSearch, handleResults } = this.props;
    this.setState({ input });
    if (handleChangeText) {
      handleChangeText(input);
    }
    if (handleSearch) {
      handleSearch(input);
    } else {
      debounce(() => {
        // use internal search logic (depth first)!
        let results = this._internalSearch(input);
        this.setState({ results });;
        if (handleResults) {
          handleResults(results);
        }
        console.log('results: ', results);
      }, 500)();
    }
  }

  _internalSearch(input) {
    return filter(this.state.data, (item) => {
      return this._depthFirstSearch(item, input)
    });
  }

  _depthFirstSearch(collection, input) {
    // let's get recursive boi
    let type = typeof collection;
    // base case(s)
    if (type === 'string' || type === 'number' || type === 'boolean') {
      return includes(collection.toString().toLowerCase(), input.toString().toLowerCase());
    }
    return some(collection, (item) => this._depthFirstSearch(item, input));
  }

  render() {
    const { onBack, onBlur, placeholder, backgroundColor, iconColor, textColor, placeholderTextColor } = this.props;
    return (
      <Animated.View style={[styles.container, { top: this.state.top }]}>
        {
          this.state.show &&
          <View>
            { Platform.OS === 'ios' && <View style={{ backgroundColor, height: 20, zIndex: 10 }} elevation={3}/> }
            <View style={[styles.navWrapper, { backgroundColor }]} elevation={3}>
              <View style={styles.nav}>
                {
                  true &&
                  <TouchableOpacity onPress={onBack || this.hide}>
                    <Icon name='arrow-back' size={28} style={[styles.icon, { color: iconColor }]}/>
                  </TouchableOpacity>
                }
                <TextInput
                  ref={(ref) => this.textInput = ref}
                  onLayout={() => this.textInput.focus()}
                  style={[styles.input, { color: textColor, marginLeft: true ? 0 : 30 }]}
                  onChangeText={(input) => this._onChangeText(input)}
                  onBlur={() => this.hide()}
                  placeholder={placeholder}
                  placeholderTextColor={placeholderTextColor}
                  value={this.state.input}
                  underlineColorAndroid='transparent'
                  returnKeyType='search'
                />
              {
                true &&
                <TouchableOpacity onPress={() => this.setState({ input: '' })}>
                    <Icon name='close' size={28} style={[styles.icon, { color: iconColor }]}/>
                </TouchableOpacity>
              }
              </View>
            </View>
          </View>
        }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
  },
  navWrapper: {
    width: Dimensions.get('window').width,
    shadowRadius: 5,
    shadowOpacity: 0.7,
    position: 'absolute',
  },
  nav: {
    ...Platform.select({
        ios: { height: 52 },
        android: { height: 66 },
    }),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    height: 30,
    width: Dimensions.get('window').width - 120,
    marginTop: 11,
    fontSize: 20,
  },
  icon: {
    padding: 10
  }
});
