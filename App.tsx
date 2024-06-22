import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import {RootStackParamList} from './src/types';

//defining the native stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Articles" component={HomeScreen} />
        <Stack.Screen
          name="WebView"
          component={WebViewScreen}
          options={({route}) => ({title: route.params.title})}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
