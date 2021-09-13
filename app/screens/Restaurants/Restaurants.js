import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { firebaseApp } from '../../utils/firebase';
import firebase from "firebase/app";
import ListRestaurants from '../../components/Restaurants/ListRestaurants';
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

const Restaurants = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurant, setTotalRestaurant] = useState(0);
    const [startRestaurants, setStartRestaurants] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const limitRestaurant = 10

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo)
        })
    }, []);

    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
                .get()
                .then((snap) => {
                    setTotalRestaurant(snap.size);
                });

            const resultRestaurant = [];

            db.collection("restaurants")
                .orderBy("createAt", "desc")
                .limit(limitRestaurant)
                .get()
                .then((response) => {
                    setStartRestaurants(response.docs[response.docs.length - 1]);
                    response.forEach((doc) => {
                        const restaurant = doc.data();
                        restaurant.id = doc.id;
                        resultRestaurant.push(restaurant);
                    });
                    setRestaurants(resultRestaurant);
                });
        }, [])
    );

    const handleLoadMore = () => {
        const resultRestaurants = [];
        restaurants.length < totalRestaurant && setIsLoading(true);
        db.collection("restaurants")
            .orderBy("createAt", "desc")
            .startAfter(startRestaurants.data().createAt)
            .limit(limitRestaurant)
            .get()
            .then(response => {
                if (response.docs.length > 0) {
                    setStartRestaurants(response.docs[response.docs.length - 1]);
                } else {
                    setIsLoading(false)
                }
                response.forEach((doc) => {
                    const restaurant = doc.data();
                    restaurant.id = doc.id;
                    resultRestaurants.push(restaurant)
                });
                setRestaurants([...restaurants, ...resultRestaurants]);
            })
    }
    return (
        <View style={styles.viewBody}>
            <ListRestaurants
                restaurants={restaurants}
                handleLoadMore={handleLoadMore}
                isLoading={isLoading}
            />
            {user && (
                <Icon
                    reverse
                    type="material-community"
                    name="plus"
                    color="#00a680"
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate("add-restaurant")}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2
    }
})

export default Restaurants;
