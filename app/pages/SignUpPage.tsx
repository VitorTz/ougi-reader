import { SafeAreaView, StyleSheet, View } from 'react-native'
import React from 'react'
import { AppStyle } from '@/style/AppStyles'
import TopBar from '@/components/TopBar'
import ReturnButton from '@/components/ReturnButton'
import HomeButton from '@/components/HomeButton'
import SignUpForm from '@/components/SignUpForm'


const SignUpPage = () => {    

    return (
    <SafeAreaView style={AppStyle.safeArea} >
        <TopBar title='SignUp' >
            <View style={{flexDirection: 'row', gap: 20, alignItems: "center", justifyContent: "center"}} >
                <HomeButton/>
                <ReturnButton/>
            </View>
        </TopBar>
        <SignUpForm/>
    </SafeAreaView>
    )
}

export default SignUpPage

const styles = StyleSheet.create({})