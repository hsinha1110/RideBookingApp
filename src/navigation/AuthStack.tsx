import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Screens from '@/screens/';
import { AuthStackParamList } from '@/screens/types';
const Stack = createNativeStackNavigator<AuthStackParamList>();
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Screens.Login} />
      <Stack.Screen name="Signup" component={Screens.Signup} />
      <Stack.Screen
        name="OTPVerification"
        component={Screens.OtpVerification}
      />
      <Stack.Screen name="OnBoarding" component={Screens.OnBoarding} />
    </Stack.Navigator>
  );
};
export default AuthStack;
