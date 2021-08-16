import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, Input, Button } from 'react-native-elements';
import { size, isEmpty } from 'lodash'
import * as firebase from 'firebase';
import { validateEmail } from '../../utils/validations';
import Loading from '../Loading';




const RegisterForm = ({ toastRef }) => {

    const navigation = useNavigation();

    const [visiblePass, setVisiblePass] = useState(true)
    const [repitePass, setRepitePass] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        repeatPassword: ''
    })

    const { email, password, repeatPassword } = formData;

    const [loading, setLoading] = useState(false)

    const onSubmit = () => {
        if (isEmpty(email) || isEmpty(password) || isEmpty(repeatPassword)) {
            toastRef.current.show('Todos los campos son obligatorios')
        } else if (!validateEmail(email)) {
            toastRef.current.show('Email incorrecto')
        } else if (password !== repeatPassword) {
            toastRef.current.show('Las contraseñas deben ser iguales')
        } else if (size(password) < 6) {
            toastRef.current.show('la contraseña debe ser minimo 6 caracteres')
        }
        else {
            setLoading(true);
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    setLoading(false);
                    navigation.navigate("account-stack");
                })
                .catch(() => {
                    setLoading(false);
                    toastRef.current.show('Este email ya se encuentra registrado')
                });
        }

    }

    const handelInput = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo Electronico"
                containerStyle={styles.inputForm}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="email-outline"
                        iconStyle={styles.iconRight}
                    />
                }
                onChange={e => handelInput(e, 'email')}
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={visiblePass}
                onChange={e => handelInput(e, 'password')}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={visiblePass ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setVisiblePass(!visiblePass)}
                    />
                }
            />
            <Input
                placeholder="Repetir Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={repitePass}
                onChange={e => handelInput(e, 'repeatPassword')}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={repitePass ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setRepitePass(!repitePass)}
                    />
                }
            />
            <Button
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Creando Cuenta..." />
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    inputForm: {
        width: '100%',
        //marginTop: 10
    },
    btnContainerRegister: {
        marginTop: 20,
        width: '95%'
    },
    btnRegister: {
        backgroundColor: '#00a680'
    },
    iconRight: {
        color: '#c1c1c1'
    }
})

export default RegisterForm