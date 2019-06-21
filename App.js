import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";
import ListScreen from './screens/ListScreen';
import ProgressScreen from "./screens/ProgressScreen";
import HomeScreen from "./screens/HomeScreen";
import ProgressSettingsScreen from "./screens/ProgressSettingsScreen";

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  List: {
    screen: ListScreen
  },
  Progress: {
    screen: ProgressScreen
  },
  ProgressSettings: {
    screen: ProgressSettingsScreen
  }
}, {
  initialRouteName: 'Home',
});

export default createAppContainer(AppNavigator);

