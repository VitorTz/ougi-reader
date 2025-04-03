import { StyleSheet  } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Manhwa } from '@/models/Manhwa'
import { upsertManhwaReadingStatus } from '@/lib/supabase'
import { useReadingStatusState } from '@/helpers/store'
import ReadingStatusPicker from './ReadingStatusPicker'



const AddToLibrary = ({manhwa}: {manhwa: Manhwa}) => {

    const { readingStatus, addReadingStatus } = useReadingStatusState()
    const [status, setStatus] = useState('None')

    const init = async () => {
        if (readingStatus.has(manhwa.manhwa_id)) {            
            setStatus(readingStatus.get(manhwa.manhwa_id)!.status)
        } else {
            setStatus('None')
        }
    }
    
    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    const onChangeValue = async (status: any) => {
        upsertManhwaReadingStatus(manhwa.manhwa_id, status)
        addReadingStatus(manhwa, status)
    }

    return (
        <ReadingStatusPicker 
            onChangeValue={onChangeValue} 
            defaultStatus={status}/>
  )
}

export default AddToLibrary

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 10
    },
    addToLibraryButton: {
        width: '50%',
        height: 52,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center"        
    }
})