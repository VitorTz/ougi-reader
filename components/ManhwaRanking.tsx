import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { fetchManhwaRating, upsertManhwaRaring } from '@/lib/supabase'
import { Rating } from '@kolking/react-native-rating';
import { GlobalContext } from '@/helpers/context';
import { Manhwa } from '@/models/Manhwa';
import Toast from './Toast';
import { Colors } from '@/constants/Colors';


interface ManhwaRankingProps {
    manhwa: Manhwa
}


const ManhwaRating = ({manhwa}: ManhwaRankingProps) => {

    const context = useContext(GlobalContext)
    const [rating, setRating] = useState<number>(0.0)
    const [loading, setLoading] = useState(false)
    const manhwa_id = manhwa.manhwa_id

    const handleChange = useCallback(
        async (value: number) => {
            setRating(Math.round((context.manhwa_rating.get(manhwa_id)! + value) * 5) / 10)
            if (context.session == null) {
                Toast.show({title: 'Error', message: 'You are not logged', type: 'error'})
                return
            }
            setLoading(true)
            await upsertManhwaRaring(manhwa_id, value)
            setLoading(false)
        },
        [rating],
    );

    const init = async () => {  
        if (context.manhwa_rating.has(manhwa_id)) {
            setRating(context.manhwa_rating.get(manhwa_id)!)
            return
        }
        await fetchManhwaRating(manhwa_id)
            .then(value => {
                setRating(value)
                context.manhwa_rating.set(manhwa_id, value)
            })        
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (
        <View style={{width: '100%', alignItems: "flex-start"}} >
            {
                loading ? 
                <ActivityIndicator size={26} color={Colors.white} /> :
                <Rating touchColor={manhwa.color} size={26} rating={rating} onChange={handleChange} />
            }
        </View> 
    )
}

export default ManhwaRating

const styles = StyleSheet.create({})