import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements'
import { isEmpty } from "lodash";
import { validateEmail } from "../../utils/validations";
import * as firebase from "firebase"
import { useNavigation } from '@react-navigation/native';
import Loading from '../Loading';

const LoginForm = ({ toastRef }) => {

    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)

    const [visiblePass, setVisiblePass] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const { email, password } = formData

    const onChangeText = (e, type) => {
        setFormData({
            ...formData,
            [type]: e.nativeEvent.text
        })
    }

    const onSubmit = () => {
        if (isEmpty(email) || isEmpty(password)) {
            toastRef.current.show("Todos los campos son obligatorios")
        } else if (!validateEmail(email)) {
            toastRef.current.show("Ingrese un email correcto")
        } else {
            setLoading(true)
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    setLoading(false);
                    navigation.navigate("account-stack");
                })
                .catch(() => {
                    setLoading(false);
                    toastRef.current.show("Email o Contraseña Incorrecto")
                })
        }
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo Electronico"
                containerStyle={styles.inputForm}
                onChange={(e) => onChangeText(e, "email")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={visiblePass}
                onChange={(e) => onChangeText(e, "password")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={visiblePass ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setVisiblePass(!visiblePass)}
                    />
                }
            />
            <Button
                title="Iniciar Sesion"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={onSubmit}
            />
            <Loading
                isVisible={loading}
                text="Iniciando Sesion"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%",
    },
    btnLogin: {
        backgroundColor: "#00a680"
    },
    iconRight: {
        color: '#c1c1c1'
    }
})

export default LoginForm
