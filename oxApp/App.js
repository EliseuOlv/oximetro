// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import React from 'react';
import api from './api';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";




export default function App() {

  const [bat, setBat] = React.useState([]);  
  // const dados = JSON.parse(); 

  React.useEffect(() => {
    api.get("/batimentos").then((response) => {
      setBat(response.data)
      // console.log(response.data, "dados");
    });
  }, []);

  const screenWidth = Dimensions.get("window").width - 30;

  const dataArrayDados = [];

  // bat.map(bats => bats.O2);

  const responseData =  [];
  dataArrayDados.push(bat.map(bats => bats.O2)); 
  console.log(responseData, "Linda");
  console.log(dataArrayDados, 'Elias');
  
  dataArrayDados[0].forEach(function(cor) {
    responseData.push(parseInt(cor))
  });

  console.log(responseData, "Agora Vai")


  // Object.keys(dataArrayDados).forEach(function(item){
  //   console.log(O2[item]);
  //  });

  // for (const item in dataArrayDados[0]){
    // console.log(item, "tentando mostrar valor")
  // }
  // function filtradado(value){
  //   for(repon)
  // }


  const data = {
    labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",],
    datasets: [
      {
        data: [1,2,3,4,5,5,4,3,2,3,2,3],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 5 // optional
      }
    ],
    legend: ["Quantidade de O2"] // optional
  };

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}></Text>

      <LineChart
        data={data}
        width={screenWidth}
        height={350}
        chartConfig={chartConfig}
      />
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


