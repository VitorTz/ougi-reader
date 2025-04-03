import { StyleSheet, TextInput, View } from 'react-native'
import React, { useCallback, useRef } from 'react'
import { debounce } from 'lodash'
import { Colors } from '@/constants/Colors'

interface SearchBarProps {
    handleSearch: (searchTerm: string) => void
}

const SearchBar = ({handleSearch}: SearchBarProps) => {

    const inpuRef = useRef<TextInput>()

    const debounceSearch = useCallback(
        debounce(handleSearch, 400),
        []
    )    

    return (
        <View style={{width: '100%', height: 42, marginBottom: 10}} >
            <TextInput                
                ref={inpuRef as any}
                placeholder='search'
                placeholderTextColor={Colors.white}
                style={styles.input}                
                onChangeText={debounceSearch}
            />
        </View>
    )
}

export default SearchBar

const styles = StyleSheet.create({
    input: {
        width: '100%', 
        height: '100%', 
        color: Colors.white,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.white
    }
})