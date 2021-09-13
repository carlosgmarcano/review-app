import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, ScrollView, Text, View, Dimensions } from 'react-native';
import { Rating, ListItem } from 'react-native-elements';
import { map } from 'lodash'
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Loading from '../../components/Loading';
import CarouselImages from '../../components/Carousel';
import Map from '../../components/Map';
import ListReviews from '../../components/Restaurants/ListReviews';

const db = firebase.firestore(firebaseApp);

const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {

    const { navigation, route } = props;
    const { id, name } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: name
        });
    }, [navigation, name]);

    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
                .doc(id)
                .get()
                .then((response) => {
                    const data = response.data();
                    data.id = response.id;
                    setRestaurant(data);
                    setRating(data.rating)
                });
        }, [])
    );


    if (!restaurant) return <Loading isVisible={true} text="Cargando..." />

    return (
        <ScrollView vertical style={styles.viewBody}>
            <CarouselImages
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
            />
            <RestaurantInfo
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
            />
            <ListReviews
                navigation={navigation}
                idRestaurant={restaurant.id}
            />
        </ScrollView>
    )
}

function TitleRestaurant({ name, description, rating }) {
    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    )
}

function RestaurantInfo({ location, name, address }) {

    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action: null
        },
        {
            text: "225588",
            iconName: "phone",
            iconType: "material-community",
            action: null
        },
        {
            text: "correorestaurant@gmail.com",
            iconName: "at",
            iconType: "material-community",
            action: null
        }
    ]

    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>
                Informacion sobre el restaurant
            </Text>
            <Map location={location} name={name} height={100}
            />
            {map(listInfo, (item, index) => (
                <ListItem
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: "#00a680"
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestaurantTitle: {
        padding: 15
    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: "bold"
    },
    descriptionRestaurant: {
        marginTop: 5,
        color: "grey"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 25
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    containerListItem: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1
    }

})
