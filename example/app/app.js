/* eslint react-native/no-color-literals: 0 */

import React from 'react'
import { StyleSheet, Text, View, FlatList, Button } from 'react-native'

import SearchBar from 'react-native-searchbar'

import { SiliconValleyCharacters } from './data'

/**
 * The data has the following shape:
 *
 *  data = [
 *    {
 *      name: 'Richard Hendricks',
 *      group: 'pied piper core'
 *    },
 *    ...
 *  ]
 */

const ShowOnLoad = false
export default class App extends React.Component {
  state = {
    results: [],
    searchBarActive: ShowOnLoad
  }

  handleHide = () => this.setState({ searchBarActive: false })

  handleResults = results => this.setState({ results })

  handleButtonPress = () => {
    const { searchBarActive } = this.state
    if (searchBarActive) {
      this.searchBar.hide()
    } else {
      this.searchBar.show()
    }
    this.setState({ searchBarActive: !searchBarActive })
  }

  render() {
    const { results, searchBarActive } = this.state
    const buttonText = searchBarActive ? 'Hide search bar' : 'Show search bar'
    const listPadding = searchBarActive ? 70 : 0
    return (
      <React.Fragment>
        <View style={Styles.container}>
          <FlatList
            style={{ paddingTop: listPadding }}
            data={results}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => (
              <Text style={Styles.result}>{item.name}</Text>
            )}
          />
        </View>
        <Button
          style={Styles.button}
          title={buttonText}
          color="black"
          onPress={this.handleButtonPress}
        />
        <SearchBar
          ref={ref => (this.searchBar = ref)}
          data={SiliconValleyCharacters}
          handleResults={this.handleResults}
          onHide={this.handleHide}
          showOnLoad={ShowOnLoad}
        />
      </React.Fragment>
    )
  }
}

const keyExtractor = (item, index) => index.toString()

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  result: {
    fontSize: 18,
    padding: 10,
    color: 'white'
  },
  button: {
    position: 'absolute'
  }
})
