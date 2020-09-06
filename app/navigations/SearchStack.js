import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Search from '../screens/Search';

const Stack = createStackNavigator();

const SearchStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="search-stack"
                component={Search}
                options={{
                    title: 'Busqueda'
                }}
            />
        </Stack.Navigator>
    )
}

export default SearchStack
