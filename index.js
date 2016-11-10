import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { filter, some, includes } from 'lodash/collection';
import { debounce } from 'lodash/function';

const INITIAL_TOP = Platform.OS === 'ios' ? -80 : -60;

export default class Search extends Component {

  static propTypes = {
    data: PropTypes.array,
    placeholder: PropTypes.string,
    handleChangeText: PropTypes.func,
    handleSearch: PropTypes.func,
    handleResults: PropTypes.func,
    onHide: PropTypes.func,
    onBack: PropTypes.func,
    heightAdjust: PropTypes.number,
    backgroundColor: PropTypes.string,
    iconColor: PropTypes.string,
    textColor: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    animate: PropTypes.bool,
    animationDuration: PropTypes.number,
    showOnLoad: PropTypes.bool,
    hideBack: PropTypes.bool,
    hideX: PropTypes.bool,
    filter: PropTypes.bool,
  }

  static defaultProps = {
    data: [],
    placeholder: 'Search',
    heightAdjust: 0,
    backgroundColor: 'white',
    iconColor: 'gray',
    textColor: 'gray',
    placeholderTextColor: 'lightgray',
    animate: true,
    animationDuration: 200,
    showOnLoad: false,
    hideBack: false,
    hideX: false,
    filter: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      data: props.data,
      results: [],
      show: props.showOnLoad,
      top: new Animated.Value(props.showOnLoad ? 0 : INITIAL_TOP + props.heightAdjust),
    };

    this.hide = this.hide.bind(this);
    this._doHide = this._doHide.bind(this);
    this._clearInput = this._clearInput.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
    this._internalSearch = this._internalSearch.bind(this);
  }

  show() {
    const { animate, animationDuration } = this.props;
    this.setState({ show: true });
    this._clearInput();
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
    const { animate, animationDuration, onHide } = this.props;
    if (animate) {
      Animated.timing(
        this.state.top, {
            toValue: INITIAL_TOP,
            duration: animationDuration,
        }
      ).start();
      setTimeout(() => {
        this._doHide();
      }, animationDuration)
    } else {
      this._doHide()
    }
  }

  _doHide() {
    const { onHide } = this.props;
    if (onHide) {
      onHide(this.state.input);
    }
    this.setState({ show: false });
    this._clearInput();
  }

  _clearInput() {
    this.setState({ input: '' });
    this._onChangeText('');
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
        console.log(results);
      }, 500)();
    }
  }

  _internalSearch(input) {
    if (input === '') {
      return filter ? this.state.data : [];
    }
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
    const { placeholder, heightAdjust, backgroundColor, iconColor, textColor, placeholderTextColor, onBack, hideBack, hideX } = this.props;
    return (
      <Animated.View style={[styles.container, { top: this.state.top }]}>
        {
          this.state.show &&
          <View style={[styles.navWrapper, { backgroundColor }]} >
            { Platform.OS === 'ios' && <View style={{ height: 20 }} /> }
            <View style={[styles.nav, { height: (Platform.OS === 'ios' ? 52 : 62) + heightAdjust }]}>
              {
                !hideBack &&
                <TouchableOpacity onPress={onBack || this.hide}>
                  <Icon name='arrow-back' size={28} style={[styles.icon, { color: iconColor }]}/>
                </TouchableOpacity>
              }
              <TextInput
                ref={(ref) => this.textInput = ref}
                onLayout={() => this.textInput.focus()}
                style={[
                  styles.input,
                  {
                    color: textColor, marginLeft: hideBack ? 30 : 0,
                    marginTop: (Platform.OS === 'ios' ? heightAdjust / 2 + 10 : 0)
                  }
                ]}
                onChangeText={(input) => this._onChangeText(input)}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                value={this.state.input}
                underlineColorAndroid='transparent'
                returnKeyType='search'
              />
            {
              !hideX &&
              <TouchableOpacity onPress={this._clearInput}>
                  <Icon name='close' size={28} style={[styles.icon, { color: iconColor }]}/>
              </TouchableOpacity>
            }
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
    position: 'absolute',
    shadowRadius: 5,
    shadowOpacity: 0.7,
  },
  navWrapper: {
    width: Dimensions.get('window').width,
  },
  nav: {
    ...Platform.select({
        android: {
          borderBottomColor: 'lightgray',
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
    }),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    ...Platform.select({
        ios: { height: 30 },
        android: { height: 50 },
    }),
    width: Dimensions.get('window').width - 120,
    fontSize: 20,
  },
  icon: {
    padding: 10
  }
});
