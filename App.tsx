import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';

//defining the native stack navigator
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Articles" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
