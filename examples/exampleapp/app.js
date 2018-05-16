/* eslint react-native/no-color-literals: 0 */

import React from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'

import SearchBar from 'react-native-searchbar'

export default class App extends React.Component {
  state = {
    results: []
  }

  handleResults = results => this.setState({ results })

  render() {
    const { results } = this.state
    return (
      <React.Fragment>
        <View style={Styles.container}>
          <FlatList
            data={results}
            renderItem={item => <Text style={Styles.result}>{item}</Text>}
          />
        </View>
        <SearchBar
          ref={ref => (this.searchBar = ref)}
          data={SiliconValleyCharacters}
          onResults={this.handleResults}
          showOnLoad
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
    backgroundColor: 'white'
  },
  result: {
    fontSize: 28,
    padding: 10
  }
})

const SiliconValleyCharacters = [
  {
    name: 'Richard Hendricks',
    group: 'pied piper core'
  },
  {
    name: 'Erlich Bachmann',
    group: 'pied piper core'
  },
  {
    name: 'Bertram Gilfoyle',
    group: 'pied piper core'
  },
  {
    name: 'Dinesh Chugtai',
    group: 'pied piper core'
  },
  {
    name: 'Jared Dunn',
    group: 'pied piper core'
  },
  {
    name: 'Jian Yang',
    group: 'pied piper associate'
  },
  {
    name: 'Peter Gregory',
    group: 'pied piper associate'
  },
  {
    name: 'Laurie Bream',
    group: 'pied piper associate'
  },
  {
    name: 'Monica Hall',
    group: 'pied piper associate'
  },
  {
    name: 'Carla Walton',
    group: 'pied piper associate'
  },
  {
    name: 'Russ Hanneman',
    group: 'pied piper associate'
  },
  {
    name: 'Jack Barker',
    group: 'pied piper associate'
  },
  {
    name: 'Gavin Belson',
    group: 'hooli'
  },
  {
    name: 'Big Head',
    group: 'hooli'
  },
  {
    name: 'Aly and Jason',
    group: 'hooli'
  },
  {
    name: 'Patrice',
    group: 'hooli'
  },
  {
    name: 'Hoover',
    group: 'hooli'
  }
]
