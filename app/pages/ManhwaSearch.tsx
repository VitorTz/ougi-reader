import { StyleSheet, SafeAreaView, Text, View } from 'react-native'
import ReturnButton from '@/components/ReturnButton'
import { Colors } from '@/constants/Colors'
import TopBar from '@/components/TopBar'
import { wp } from '@/helpers/util'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import SearchBar from '@/components/SearchBar'
import { Manhwa } from '@/models/Manhwa'
import { fetchManhwaByName, fetchManhwasMostView } from '@/lib/supabase'
import { GlobalContext } from '@/helpers/context'
import { AppStyle } from '@/style/AppStyles'
import ManhwaGrid from '@/components/ManhwaGrid'


const SearchManhwa = () => {

    const context = useContext(GlobalContext)
    const [manhwas, setManhwas] = useState<Manhwa[]>([])
    const [hasResults, setHasResults] = useState(true)

    const init = async () => {
        await fetchManhwasMostView(0)
            .then(values => {
                setHasResults(values.length > 0)
                setManhwas([...values])
            })
    }

    const handleSearch = async (searchTerm: string) => {
        if (searchTerm == '') { await init(); return }        
        await fetchManhwaByName(searchTerm, context.manhwa_queries)
            .then(values => {
                setHasResults(values.length > 0)
                setManhwas([...values])
            })
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )


    return (
        <SafeAreaView style={AppStyle.safeArea}>
            <TopBar title="Manhwa Search">
                <ReturnButton/>
            </TopBar>
            <SearchBar handleSearch={handleSearch}/>
            {
                !hasResults ?
                <Text style={AppStyle.textHeader}>No results</Text> :
                <ManhwaGrid manhwas={manhwas} gap={10} paddingHorizontal={wp(5)} />
            }
        </SafeAreaView>
    )
}

export default SearchManhwa

const styles = StyleSheet.create({})