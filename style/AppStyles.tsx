import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { wp } from "@/helpers/util";


export const AppStyle = StyleSheet.create({
    textRegular: {
        fontSize: 16,
        color: Colors.black
    },
    textHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.black
    },
    textLink: {
        fontSize: 14,
        color: "#1e1e1e",
        textDecorationLine: "underline"
    },
    safeArea: {
        width: '100%', 
        flex: 1, 
        padding: wp(5), 
        backgroundColor: Colors.backgroundColor
    }
})