import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";



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
        fontSize: 16,
        color: Colors.black,
        textDecorationLine: "underline"
    }
})