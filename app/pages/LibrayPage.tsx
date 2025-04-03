import ReadingStatusPicker from '@/components/ReadingStatusPicker'
import { AppConstants } from '@/constants/AppConstants'
import { useReadingStatusState } from '@/helpers/store'
import { SafeAreaView, StyleSheet } from 'react-native'
import ReturnButton from '@/components/ReturnButton'
import React, { useCallback, useEffect, useRef } from 'react'
import ManhwaGrid from '@/components/ManhwaGrid'
import { useFocusEffect } from 'expo-router'
import { AppStyle } from '@/style/AppStyles'
import TopBar from '@/components/TopBar'
import { Manhwa } from '@/models/Manhwa'
import { useState } from 'react'



const LibrayPage = () => {

    const { readingStatus } = useReadingStatusState()
    const [manhwas, setManhwas] = useState<Manhwa[]>([])    
    const statusRef = useRef('Reading')
    const manhwaByStatus = useRef<Map<string, Manhwa[]>>(new Map())

    const sortStates = () => {
        manhwaByStatus.current.clear()
        AppConstants.READING_STATUS.forEach(item => manhwaByStatus.current.set(item, []))
        readingStatus.forEach(
            (value, key) => {
                manhwaByStatus.current.get(value.status)!.push(value.manhwa)
            }
        )                
        setManhwas([...manhwaByStatus.current.get(statusRef.current)!])
    }

    const init = async () => {        
        console.log("init")
        sortStates()
    }

    useEffect(
        useCallback(() => {
            init()
        }, [readingStatus]),
        [readingStatus]
    )    

    const onChangeValue = (status: any) => {
        statusRef.current = status
        setManhwas([...manhwaByStatus.current.get(status)!])
    }

    return (

    <SafeAreaView style={[AppStyle.safeArea, {gap: 10}]} >
        <TopBar title='Library' >
            <ReturnButton/>
        </TopBar>

        <ReadingStatusPicker
            width={"100%"}
            onChangeValue={onChangeValue} />
        
        <ManhwaGrid
            manhwas={manhwas}
            numColumns={2}
            shouldShowChapterDate={false}
            showChaptersPreview={false}
            hasResults={true}/>    

    </SafeAreaView>
  )
}

export default LibrayPage

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 10
    }
})