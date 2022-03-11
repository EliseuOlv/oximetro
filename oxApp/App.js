// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import React from 'react';
import api from './api';
import {
  LineChart,
  // BarChart,
  // PieChart,
  // ProgressChart,
  // ContributionGraph,
  // StackedBarChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";




export default function App() {

  const [bat, setBat] = React.useState([]);  
  const dados = []; 

  React.useEffect(() => {
    api.get("/batimentos").then((response) => {
      setBat(response.data)
      console.log(response.data, "dados")
    });
  }, []);

  const screenWidth = Dimensions.get("window").width - 30;

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90 ,100, 110, 120, 130, 140, 150],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
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
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.text}></Text>

      <LineChart
        data={data}
        width={screenWidth}
        height={256}
        verticalLabelRotation={30}
        chartConfig={chartConfig}
        bezier
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
