import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Avatar, Rating } from 'react-native-elements';
import { map } from 'lodash';
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function ListReviews({ navigation, idRestaurant }) {

    const [userLogged, setUserLogged] = useState(false);
    const [reviews, setReviews] = useState([])

    console.log(reviews);

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useEffect(() => {
        db.collection("reviews")
            .where("idRestaurant", "==", idRestaurant)
            .get()
            .then((response) => {
                const resultReview = [];
                response.forEach(doc => {
                    const data = doc.data()
                    data.id = doc.id;
                    resultReview.push(data);
                });
                setReviews(resultReview);
            })
    }, [])

    return (
        <View>
            {userLogged ? (
                <Button
                    title="Escribe una opinión"
                    buttonStyle={styles.btnAddReview}
                    titleStyle={styles.btnTitleReview}
                    icon={{
                        type: "material-community",
                        name: "square-edit-outline",
                        color: "#00a680"
                    }}
                    onPress={() => navigation.navigate("add-review-restaurant", {
                        idRestaurant: idRestaurant
                    })}
                />
            ) : (
                <View>
                    <Text
                        style={{ textAlign: "center", color: "#00a680", padding: 20 }}
                        onPress={() => navigation.navigate('login-stack')}
                    >
                        Para escribir un comentario debe estar logeado{" "}
                        <Text style={{ fontWeight: "bold" }}>
                            pulsa aqui para iniciar sesión
                        </Text>
                    </Text>
                </View>
            )}
            {map(reviews, (itemReview, index) => (
                <Review key={index} itemReview={itemReview} />
            ))}
        </View>
    )
}

function Review({ itemReview }) {
    const { title, review, rating, createAt, avatarUser } = itemReview
    const createReview = new Date(createAt.seconds * 1000);
    return (
        <View style={styles.viewReview}>
            <View style={styles.viewImageAvatar}>
                <Avatar
                    size="large"
                    rounded
                    containerStyle={styles.imageAvatarUser}
                    source={avatarUser ? { uri: avatarUser } : require("../../../assets/img/avatar-default.jpg")}
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating
                    imageSize={15}
                    startingValue={rating}
                    readonly
                />
                <Text style={styles.reviewDate}>
                    {createReview.getDate()}/
                    {createReview.getMonth() + 1}/
                    {createReview.getFullYear() + " "}
                    {createReview.getHours()}:
                    {createReview.getMinutes() < 10 ? "0" : ""}
                    {createReview.getMinutes()}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent"
    },
    btnTitleReview: {
        color: "#00a680"
    },
    viewReview: {
        flexDirection: "row",
        padding: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    viewImageAvatar: {
        marginRight: 15
    },
    imageAvatarUser: {
        width: 50,
        height: 50
    },
    viewInfo: {
        flex: 1,
        alignItems: "flex-start"
    },
    reviewTitle: {
        fontWeight: "bold"
    },
    reviewText: {
        paddingTop: 2,
        color: "grey",
        marginBottom: 5
    },
    reviewDate: {
        marginTop: 5,
        color: "grey",
        fontSize: 12,
        position: "absolute",
        right: 0,
        bottom: 0
    }
})
