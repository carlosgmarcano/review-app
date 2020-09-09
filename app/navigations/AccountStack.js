import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../screens/Account/Account';
import Login from '../screens/Account/Login';
import Register from '../screens/Account/Register';

const Stack = createStackNavigator();

const AccountStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="account-stack"
                component={Account}
                options={{
                    title: 'Cuenta'
                }}
            />
            <Stack.Screen
                name="login-stack"
                component={Login}
                options={{
                    title: 'Iniciar Sesion'
                }}
            />
            <Stack.Screen
                name="register-stack"
                component={Register}
                options={{
                    title: 'Registro'
                }}
            />
        </Stack.Navigator>
    )
}

export default AccountStack
