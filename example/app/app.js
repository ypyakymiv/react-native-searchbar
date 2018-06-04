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

const ShowOnLoad = true
export default class App extends React.Component {
  state = {
    results: [],
    searchBarActive: ShowOnLoad
  }

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
    const buttonText = searchBarActive ? 'Hide' : 'Show'
    return (
      <React.Fragment>
        <View style={Styles.container}>
          <FlatList
            data={results}
            renderItem={item => <Text style={Styles.result}>{item}</Text>}
          />
          <Button
            title={buttonText}
            color="white"
            onPress={this.handleButtonPress}
          />
        </View>
        <SearchBar
          ref={ref => (this.searchBar = ref)}
          data={SiliconValleyCharacters}
          handleResults={this.handleResults}
          showOnLoad={ShowOnLoad}
        />
      </React.Fragment>
    )
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingBottom: 20
  },
  result: {
    fontSize: 28,
    padding: 10,
    color: 'white'
  }
})
