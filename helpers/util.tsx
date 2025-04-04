import { Dimensions } from "react-native";
import { ManhwaComment } from "./types";
import * as ImagePicker from 'expo-image-picker';
import { Alert } from "react-native";



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


export function getItemGridDimensions(
    horizontalPadding: number,
    gap: number,
    columns: number,
    originalWidth: number,
    originalHeight: number
): {width: number, height: number} {
    const width = (wp(100) - (horizontalPadding * 2) - ((columns * gap) - gap)) / columns
    const height = width * (originalHeight / originalWidth)
    return {width, height}
}


export function formatTimestamp(timestamp: string): string {    
    const date = new Date(timestamp);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };    
    return date.toLocaleDateString('en-US', options as any);
}

export function organizeComments(comments: ManhwaComment[]): ManhwaComment[] {
    const commentMap = new Map<number, ManhwaComment>();
    const topLevelComments: ManhwaComment[] = [];

    // Primeiro, mapeamos os comentários por comment_id
    comments.forEach(comment => {
        comment.thread = []; // Garante que a thread está vazia antes de organizar
        commentMap.set(comment.comment_id, comment);
    });

    // Agora, organizamos os comentários dentro de suas respectivas threads
    comments.forEach(comment => {
        if (comment.parent_comment_id) {
            const parent = commentMap.get(comment.parent_comment_id);
            if (parent) {
                parent.thread.push(comment);
            }
        } else {
            topLevelComments.push(comment);
        }
    });

    return topLevelComments;
}


export const checkForCameraRollPermission = async() => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert("Please grant camera roll permissions inside your system's settings")
    } else{
        console.log('Media Permissions are granted')
    }
}
