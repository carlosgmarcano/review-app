import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { size } from 'lodash';
import * as firebase from "firebase";
import { reauthenticate } from '../../utils/api';

const ChangePasswordForm = ({ setShowModal, toastRef }) => {

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState(defaultValue());

    const [error, setError] = useState({})

    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = async () => {
        let isSetError = true;
        let errosTemp = {};
        setError({})
        if (!formData.password || !formData.newPassword || !formData.repeatNewPassword) {
            errosTemp = {
                password: !formData.password ? "La contraseña no puede estar vacia" : "",
                newPassword: !formData.newPassword ? "La contraseña no puede estar vacia" : "",
                repeatNewPassword: !formData.repeatNewPassword ? "La contraseña no puede estar vacia" : ""
            }
        } else if (formData.newPassword !== formData.repeatNewPassword) {
            errosTemp = {
                newPassword: "Las contraseñas no son iguales",
                repeatNewPassword: "Las contraseñas no son iguales"
            }
        } else if (size(formData.newPassword) < 6) {
            errosTemp = {
                newPassword: "La contraseña tiene que ser mayor a 5 caracteres",
                repeatNewPassword: "La contraseña tiene que ser mayor a 5 caracteres",
            }
        } else {
            setIsLoading(true)
            await reauthenticate(formData.password).then(async () => {
                await firebase.auth().currentUser.updatePassword(formData.repeatNewPassword).then(() => {
                    isSetError = false;
                    setIsLoading(false);
                    setShowModal(false);
                    firebase.auth().signOut();
                }).catch(() => {
                    errosTemp = {
                        other: "Error al actualizar la contraeña"
                    };
                    setIsLoading(false);
                })
            }).catch(() => {
                errosTemp = {
                    password: "La contraseña no es correcta"
                };
                setIsLoading(false)
            })
        }
        isSetError && setError(errosTemp)
    };

    return (
        <View style={styles.view} >
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "password")}
                errorMessage={error.password}
            />
            <Input
                placeholder="Nueva Contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "newPassword")}
                errorMessage={error.newPassword}
            />
            <Input
                placeholder="Repetir Contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "repeatNewPassword")}
                errorMessage={error.repeatNewPassword}
            />
            <Button
                title="Cambiar Contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{error.other}</Text>
        </View>
    );
}

function defaultValue() {
    return {
        password: "",
        newPassword: "",
        repeatNewPassword: ""
    }
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
})
export default ChangePasswordForm;