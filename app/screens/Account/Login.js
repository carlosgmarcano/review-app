import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import { Divider } from 'react-native-elements'

const Login = () => {

    const navigation = useNavigation();

    return (
        <ScrollView>
            <Image
                source={require('../../../assets/img/LogoAQP.png')}
                resizeMode='contain'
                style={styles.logo}
            />
            <View style={styles.viewContainer}>
                <Text>Login Form</Text>
                <Text
                    style={styles.textRegister}
                >
                    ¿Aun no tienes una cuenta? {' '}
                    <Text
                        style={styles.btnRegister}
                        onPress={() => navigation.navigate('register-stack')}
                    >
                        Registrate
                </Text>
                </Text>
            </View>
            <Divider
                style={styles.divider}
            />
            <Text>Social Login</Text>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    logo: {
        width: '100%',
        height: 200,
        marginTop: 20
    },
    viewContainer: {
        marginHorizontal: 40
    },
    divider: {
        backgroundColor: '#00a680',
        margin: 40
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10
    },
    btnRegister: {
        color: '#00a680',
        fontWeight: 'bold'
    }
})

export default Login


