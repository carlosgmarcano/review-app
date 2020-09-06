import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TopRestaurant from '../screens/TopRestaurant';

const Stack = createStackNavigator();

const TopRestaurantStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="toprestaurant-stack"
                component={TopRestaurant}
                options={{
                    title: 'Top Restaurantes'
                }}
            />
        </Stack.Navigator>
    )
}

export default TopRestaurantStack
