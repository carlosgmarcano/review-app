import React, { useRef } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RegisterForm from '../../components/Account/RegisterForm';
import Toast from 'react-native-easy-toast';

const Register = () => {

    const toastRef = useRef();

    return (
        <KeyboardAwareScrollView>
            <Image
                source={require('../../../assets/img/LogoAQP.png')}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewForm}>
                <RegisterForm toastRef={toastRef} />
            </View>
            <Toast
                ref={toastRef}
                position="center"
                opacity={0.9}
                useNativeDriver='false'
            />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20
    },
    viewForm: {
        marginHorizontal: 40
    }
})

export default Register