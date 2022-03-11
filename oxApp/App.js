import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import React from 'react';
import api from './api';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';


export default function App() {

  const [bat, setBat] = React.useState([]);  
  var [dados] = React.useState([]);

  React.useEffect(() => {
    api.get("/batimentos").then((response) => {
      setBat(response.data)
      console.log(response.data)
      dados = response.data
      console.log(dados)
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>asd</Text>
    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: '#fff'
  },  
});
