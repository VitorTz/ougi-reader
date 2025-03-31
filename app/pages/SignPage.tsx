import { SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import { AppStyle } from '@/style/AppStyles'
import TopBar from '@/components/TopBar'
import HomeButton from '@/components/HomeButton'
import SignInForm from '@/components/SignInForm'



const SignInPage = () => {
    
    return (
    <SafeAreaView style={AppStyle.safeArea} >
        <TopBar title='SignIn' >
            <HomeButton/>
        </TopBar>
        <SignInForm/>
    </SafeAreaView>
    )
}

export default SignInPage

const styles = StyleSheet.create({})