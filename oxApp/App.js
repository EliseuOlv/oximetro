import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import React from 'react';
import { FlatList } from 'react-native-web';


export default function App() {
  constructor(props)
  {
    super(props);
    this.state = {
      data: []
    }
  }
  
  
  loadUsers = () => {
    fetch("http://localhost:4002/batimentos")
    .then( res => res.json())
    .then( res => {
      this.setstate ({
        data: res.O2 || []
      })
    })
  }


  componentDidMount()
  {
    this.loadUsers
  }


  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <FlatList 
        data={this.state.data}
        renderItem={({item}) => (
          <Text source={{ uri: item.O2}}></Text>
        )}
      />
    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
