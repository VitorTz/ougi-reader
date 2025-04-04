import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AppConstants } from '@/constants/AppConstants'
import { StyleSheet, SafeAreaView } from 'react-native'
import ReturnButton from '@/components/ReturnButton'
import { fetchManhwaByName } from '@/lib/supabase'
import ManhwaGrid from '@/components/ManhwaGrid'
import SearchBar from '@/components/SearchBar'
import { AppStyle } from '@/style/AppStyles'
import TopBar from '@/components/TopBar'
import { Manhwa } from '@/models/Manhwa'


const SearchManhwa = () => {
    
    const [hasResults, setHasResults] = useState(true)
    const [loading, setLoading] = useState(false)
    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const state = useRef<{page: number, searchTerm: string}>({page: 0, searchTerm: ''})    

    const init = async () => {
        state.current.page = 0
        state.current.searchTerm = ''
        await fetchManhwaByName('')
            .then(values => {
                setHasResults(values.length > 0)
                setManhwas([...values])
            })
    }

    const handleSearch = async (searchTerm: string | null, append: boolean = false) => {
        setLoading(true)
            console.log(searchTerm)
            state.current.searchTerm = searchTerm ? searchTerm.trim() : ''
            state.current.page = append ? state.current.page + 1 : 0
            await fetchManhwaByName(
                state.current.searchTerm, 
                state.current.page * AppConstants.MANHWAS_PER_PAGE,
                AppConstants.MANHWAS_PER_PAGE,
                3
            ).then(values => {
                    setHasResults(values.length > 0)
                    append ?
                        setManhwas(prev => [...prev, ...values]) :
                        setManhwas([...values])
                })
        setLoading(false)
    }

    const onEndReached = async () => {
        console.log("end")
        await handleSearch(state.current.searchTerm, true)
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )


    return (
        <SafeAreaView style={AppStyle.safeArea}>
            <TopBar title="Search">
                <ReturnButton/>
            </TopBar>

            <SearchBar handleSearch={handleSearch}/>
            
            <ManhwaGrid 
                manhwas={manhwas}
                shouldShowChapterDate={false} 
                loading={loading}
                hasResults={hasResults}
                numColumns={2}
                onEndReached={onEndReached} />

        </SafeAreaView>
    )
}

export default SearchManhwa

const styles = StyleSheet.create({})