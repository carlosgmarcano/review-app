import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import { Button } from 'react-native-elements'

const UserGuest = () => {

    const navigation = useNavigation();

    return (
        <ScrollView centerContent={true} style={styles.viewBody}>
            <Image
                source={require('../../../assets/img/user-guest.jpg')}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu Perfil</Text>
            <Text style={styles.description}>
                `¿Como describirias el mejor restaurante? Busca y visualiza los mejores
                restaurantes de una forma sencilla, vota cual te ha gustado mas y
                comenta como ha sido tu experiencia`
            </Text>
            <View style={styles.viewBtn}>
                <Button
                    buttonStyle={styles.btn}
                    containerStyle={styles.btnContainer}
                    title="Ver tu Perfil"
                    onPress={() => navigation.navigate('login-stack')}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30
    },
    image: {
        height: 300,
        width: '100%',
        marginBottom: 40
    },
    title: {
        fontWeight: 'bold',
        fontSize: 19,
        marginBottom: 10,
        textAlign: 'center'
    },
    description: {
        textAlign: 'center',
        marginBottom: 20

    },
    viewBtn: {
        flex: 1,
        alignItems: 'center'
    },
    btn: {
        backgroundColor: '#00a680'
    },
    btnContainer: {
        width: '70%'
    },
})

export default UserGuest
