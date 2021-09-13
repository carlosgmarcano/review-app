import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { map, size, filter } from 'lodash';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import uuid from 'random-uuid-v4';
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import Modal from '../Modal';

const db = firebase.firestore(firebaseApp);


const widthScreen = Dimensions.get("window").width;

const AddRestaurantForm = ({ toastRef, setIsLoading, navigation }) => {

    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null)


    const addRestaurant = () => {
        if (!restaurantName || !restaurantDescription || !restaurantAddress) {
            toastRef.current.show("Todos los campos son obligatorios");
        } else if (size(imageSelected) === 0) {
            toastRef.current.show("El restaurante debe tener al menos una foto")
        } else if (!locationRestaurant) {
            toastRef.current.show("Debe ingresar la ubicacion del restaurante en el mapa")
        } else {
            setIsLoading(true)
            uploadImageStorage().then((response) => {
                db.collection("restaurants")
                    .add({
                        name: restaurantName,
                        address: restaurantAddress,
                        description: restaurantDescription,
                        location: locationRestaurant,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid

                    })
                    .then(() => {
                        setIsLoading(false);
                        navigation.navigate("restaurants-stack");
                    }).catch(() => {
                        setIsLoading(false);
                        toastRef.current.show("Error al subir el restaurante, intentenlo mas tarde");
                    })
            });
        }
    }

    const uploadImageStorage = async () => {
        const imageBlob = [];

        await Promise.all(
            map(imageSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const name = uuid();
                const ref = firebase.storage().ref("restaurants").child(name);
                await ref.put(blob).then(async () => {
                    await firebase
                        .storage()
                        .ref(`restaurants/${name}`)
                        .getDownloadURL()
                        .then((photoUrl) => {
                            imageBlob.push(photoUrl);
                        });
                });
            })
        );
        return imageBlob;
    };

    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant
                imageRestaurant={imageSelected[0]}
            />
            <FormAdd
                setRestaurantName={setRestaurantName}
                setRestaurantDescription={setRestaurantDescription}
                setRestaurantAddress={setRestaurantAddress}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage
                toastRef={toastRef}
                imageSelected={imageSelected}
                setImageSelected={setImageSelected}
            />
            <Button
                title="Crear Restaurante"
                buttonStyle={styles.btnAddRestaurant}
                onPress={addRestaurant}
            />
            <Map
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function FormAdd({ setRestaurantName, setRestaurantDescription, setRestaurantAddress, setIsVisibleMap, locationRestaurant }) {
    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Dirección"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#00a680" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input
                placeholder="Descripción del restaurante"
                multiline={true}
                containerStyle={styles.textArea}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function ImageRestaurant({ imageRestaurant }) {
    return (
        <View style={styles.viewPhoto}>
            <Image
                source={
                    imageRestaurant
                        ? { uri: imageRestaurant }
                        : require("../../../assets/img/no-image.png")
                }
                style={{ width: widthScreen, height: 200 }}
            />
        </View>
    )
}

function UploadImage({ toastRef, imageSelected, setImageSelected }) {

    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );
        if (resultPermissions === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la galeria. Ir a ajustes y activarlos manualmente", 3000)
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });
            if (result.cancelled) {
                toastRef.current.show("Has cerrado la galeria sin seleccionar ninguna imagen", 2000)
            } else {
                setImageSelected([...imageSelected, result.uri])
            }
        }
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro que quieres eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImageSelected(filter(imageSelected, (imageURL) => imageURL !== image))
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return (
        <View style={styles.viewImages}>
            {size(imageSelected) < 4 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {map(imageSelected, (imageRestaurant, index) => (
                <Avatar
                    key={index}
                    style={styles.miniatureStyle}
                    source={{ uri: imageRestaurant }}
                    onPress={() => removeImage(imageRestaurant)}
                />
            ))}
        </View>
    )
}

function Map({ isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef }) {

    const [location, setLocation] = useState(null)

    useEffect(() => {
        //Funcion anonima auto-ejecutable
        (async () => {
            const resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
            const statusPermissions = resultPermissions.permissions.location.status;
            if (statusPermissions !== "granted") {
                toastRef.current.show("Debes aceptar los permisos de localización", 3000)
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localizacion guardada correctamente");
        setIsVisibleMap(false);
    }

    return (
        <Modal
            isVisible={isVisibleMap}
            setIsVisible={setIsVisibleMap}
        >
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View styles={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%"
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnAddRestaurant: {
        backgroundColor: "#00a680",
        margin: 20
    },
    viewImages: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 2
    },
    viewMapBtnCancel: {
        backgroundColor: "red",

    },
    viewMapBtnContainerSave: {
        paddingRight: 2
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }
})

export default AddRestaurantForm
