import React, { useState } from 'react';
import { SocialIcon } from 'react-native-elements';
import * as Firebase from 'firebase';
import * as Facebook from 'expo-facebook'
import { FacebookApi } from '../../utils/social';
import { useNavigation } from '@react-navigation/native';
import Loading from '../Loading';


const LoginFacebook = ({ toastRef }) => {

    const [loading, setLoading] = useState(false)

    const navigation = useNavigation();

    const Login = async () => {
        try {
            await Facebook.initializeAsync(FacebookApi.application_id);
            const { type, token } = await Facebook.logInWithReadPermissionsAsync({
                permissions: FacebookApi.permissions
            });
            if (type === "success") {
                setLoading(true)
                const credentials = firebase.auth.FacebookAuthProvider.credential(token)
                firebase
                    .auth()
                    .signInWithCredential(credentials)
                    .then(() => {
                        setLoading(false)
                        navigation.navigate("account-stack");
                    })
                    .catch(() => {
                        setLoading(false)
                        toastRef.current.show("Credenciales Incorrectas")
                    })
            } else if (type === "cancel") {
                toastRef.current.show('Inicio de Sesion Cancelado')
            } else {
                toastRef.current.show('Error Desconocido')
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <SocialIcon
                title="Iniciar sesion con Facebook"
                button
                type="facebook"
                onPress={Login}
            />
            <Loading isVisible={loading} text="Iniciando sesion" />
        </>
    )
}

export default LoginFacebook
