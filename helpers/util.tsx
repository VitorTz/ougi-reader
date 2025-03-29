import { Dimensions } from "react-native";


export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const {
    width: deviceWidth, 
    height: deviceHeight
} = Dimensions.get('window');


export function wp(percentage: number) {
    const width = deviceWidth;
    return (percentage * width) / 100;
}


export function hp(percentage: number) {
    const height = deviceHeight;
    return (percentage * height) / 100;
}

export function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}