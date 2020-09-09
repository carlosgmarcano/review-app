import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';
import { size, isEmpty } from 'lodash'
import { validateEmail } from '../../utils/validations';

const RegisterForm = ({ toastRef }) => {



    const [visiblePass, setVisiblePass] = useState(true)
    const [repitePass, setRepitePass] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        repeatPassword: ''
    })

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword)) {
            toastRef.current.show('Todos los campos son obligatorios')
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show('Email incorrecto')
        } else if (formData.password !== formData.repeatPassword) {
            toastRef.current.show('Las contraseñas deben ser iguales')
        } else if (size(formData.password) < 6) {
            toastRef.current.show('la contraseña debe ser minimo 6 caracteres')
        }
        else {
            toastRef.current.show('Todo Correcto')
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