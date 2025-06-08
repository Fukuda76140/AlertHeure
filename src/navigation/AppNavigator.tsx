import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ConfigScreen from '../screens/ConfigScreen';
import TimerScreen from '../screens/TimerScreen';

export type RootStackParamList = {
  Config: undefined;
  Timer: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Config">
        <Stack.Screen
          name="Config"
          component={ConfigScreen}
          options={{title: 'Configuration'}}
        />
        <Stack.Screen
          name="Timer"
          component={TimerScreen}
          options={{title: 'Horaires'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;