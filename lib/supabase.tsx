import { createClient, PostgrestError, Session } from '@supabase/supabase-js'
import { Manhwa } from '@/models/Manhwa'
import { Chapter } from '@/models/Chapter'
import { ChapterImage } from '@/models/Image'
import { AppState } from 'react-native'
import { ManhwaAuthor } from '@/models/ManhwaAuthor'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ManhwaComment } from '@/helpers/types'


const supabaseUrl = 'https://wevyvylwsfcxgbuqawuu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indldnl2eWx3c2ZjeGdidXFhd3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTUyMDMsImV4cCI6MjA1ODU5MTIwM30.EXGkpsPue5o2OD5WOpu4IfOZEgqo3FYKV2QDLNW7P6g'


export const supabase = createClient(supabaseUrl, supabaseKey as any, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
});


AppState.addEventListener(
'change', (state) => {  
    if (state === 'active') {    
        supabase.auth.startAutoRefresh()  
    } else {    
        supabase.auth.stopAutoRefresh()
    }
}
)


export async function getSession(): Promise<Session | null> {
    const {data: {session}} = await supabase.auth.getSession()    
    return session
}

export async function fetchUser(): Promise<{username: string | null, image_url: string | null}> {
    const session = await getSession()

    if (!session) {
        return {username: null, image_url: null}
    }
    const {data, error } = await supabase
        .from("users")
        .select("username, image_url")
        .eq("user_id", session.user.id)
        .single()

    if (error) {
        console.log(error)
        return {username: null, image_url: null}
    }

    return { username: data.username, image_url: data.image_url }
}

export async function fetchUserBookmarks(): Promise<Map<number, Manhwa>> {
    const m = new Map()
    const session = await getSession()
    if (!session) { return m }

    const { data, error } = await supabase
        .rpc('get_user_bookmarked_manhwas', { p_user_id: session.user.id });
    
    if (error) {
        console.log(error)
        return m
    }

    data.forEach((item: Manhwa) => m.set(item.manhwa_id, item))
    return m
}

export async function fetchUserReadingHistory(): Promise<Set<number>> {
    
    const m = new Set<number>()
    const session = await getSession()

    if (!session) { return m }
    
    const { data, error } = await supabase
        .from("reading_history")
        .select("chapter_id")
        .eq("user_id", session.user.id)

    if (error) {
        console.log("erro fetch reading history", error)
        return m
    }

    data.forEach(item => m.add(item.chapter_id))
    return m
}

export async function fetchUserManhwaReadingStatus(): Promise<Map<number, {manhwa: Manhwa, status: string}>> {
    const m = new Map<number, {manhwa: Manhwa, status: string}>()
    const session = await getSession()
    if (!session) { return m }
    const {data, error} = await supabase
        .from("reading_status")
        .select("status, manhwas (manhwa_id, title, descr, cover_image_url, status, created_at, updated_at, color)")
        .eq("user_id", session.user.id)
    
    if (error) {
        console.log(error)
        return m
    }
    data.forEach(item => m.set((item.manhwas as any).manhwa_id, {manhwa: item.manhwas as any, status: item.status}))
    return m
}


export async function fetchUserCompleteReadingHistory(): Promise<Manhwa[]> {
    const session = await getSession()
    if (!session) { return [] }
    const { data, error } = await supabase
        .rpc('get_user_manhwa_chapters', { p_user_id: session.user.id });
    
    if (error) {
        console.log("error update user reading history", error)
        return []
    }

    return data
}


export async function updateUserReadingHistory(
    p_chapter_id: number, 
    p_manhwa_id: number    
): Promise<boolean> {
    const session = await getSession()
    if (!session) { return false }

    const { error } = await supabase
        .rpc('upsert_reading_history', { p_user_id: session.user.id, p_chapter_id, p_manhwa_id });
    
    if (error) {
        console.log("error update user reading history", error)
        return false
    }
    
    return true
}

export async function fetchManhwaRating(p_manhwa_id: number): Promise<{rating: number, totalRatings: number}> {    
    const session = await getSession()
    if (!session) { return  {rating: 0.0, totalRatings: 0.0 } }

    const { data, error } = await supabase
        .from("materialized_ratings")
        .select("rating, total_ratings")
        .eq("manhwa_id", p_manhwa_id)
        .single()
    
    if (error) {
        if (error.code != "PGRST116") {
            console.log("error fecthing materialized rating", p_manhwa_id, error)
        }
        return  {rating: 0.0, totalRatings: 0.0 }
    }

    return {rating: data.rating, totalRatings: data.total_ratings }
    
}


export async function fetchManhwaComments(p_manhwa_id: number): Promise<ManhwaComment[]> {
    const { data, error } = await supabase
        .rpc('get_comments_by_manhwa', { p_manhwa_id })
    
    if (error) {
        console.log(error)
        return []
    }

    return data
}


export async function insertComment(manhwa_id: number, user_id: string, comment: string): Promise<number | null> {
    const { data, error } = await supabase
        .from("comments")
        .insert({comment, manhwa_id, user_id})
        .select("comment_id")
        .single()
    
    if (error) {
        console.log(error)
        return null
    }

    return data.comment_id
}

export async function fetchManhwaRatingExcludingUser(
    p_manhwa_id: number
): Promise<{rating: number, totalRatings: number}> {    
    const session = await getSession()
    if (!session) { return {rating: 0.0, totalRatings: 0} }
    const { data, error } = await supabase
        .rpc('get_average_rating_excluding_user', { p_manhwa_id, p_exclude_user_id: session.user.id });
    
    if (error) {
        console.log("error fetch manhwa rating", p_manhwa_id, error)
        return {rating: 0.0, totalRatings: 0}
    }
    
    return {rating: data.avg_rating, totalRatings: data.total_ratings}
}


export async function upsertManhwaRating(p_manhwa_id: number, p_rating: number) {
    const session = await getSession()
    if (!session) { return false }    

    const { data, error } = await supabase
        .rpc('upsert_manhwa_rating', { p_manhwa_id, p_rating, p_user_id: session.user.id });
    
    if (error) {
        console.log("error update manhwa rating", p_manhwa_id, error)
        return 0.0
    }
    
    return data
}

export async function fetchUserManhwaRating(manhwa_id: number): Promise<number | null> {
    const session = await getSession()
    if (!session) { return null }
    
    const { data, error } = await supabase
        .from("manhwa_ratings")
        .select("rating")
        .eq("manhwa_id", manhwa_id)
        .eq("user_id", session.user.id)
        .single()
    
    if (error) {
        if (error.code == 'PGRST116') { return null }
        console.log("fetch user manhwa rating error", error)
        return null
    }

    return data.rating
}


export async function fetchManhwaReadingStatus(manhwa_id: number): Promise<string | null> {
    const session = await getSession()
    if (!session) { return null }
    const { data, error } = await supabase
        .from("reading_status")
        .select("status")
        .eq("manhwa_id", manhwa_id)
        .eq("user_id", session.user.id)
        .single()
    
    if (error) {
        console.log("fetch manhwa status error", error)
        return null
    }
    return data.status
}


export async function upsertManhwaReadingStatus(p_manhwa_id: number, p_status: string) {    
    const session = await getSession()
    if (!session) { return }

    const { error } = await supabase
        .rpc('upsert_reading_status', { p_user_id: session.user.id, p_manhwa_id, p_status });
    
    if (error) {
        console.log(error)
    }
}


export async function fetchLastUpdatedManhwas(
    p_offset: number = 0, 
    p_limit: number = 30, 
    p_num_chapters: number = 3
): Promise<Manhwa[]> {
    const { data, error } = await supabase
        .rpc('get_manhwas_ordered_by_update', { p_offset, p_limit, p_num_chapters });
    
    if (error) {
        console.log(error)
        return []
    }    
    return data    
}

export async function fetchMostViewedManhwas(
    p_offset: number = 0, 
    p_limit: number = 30, 
    p_num_chapters: number = 3
): Promise<Manhwa[]> {
    const { data, error } = await supabase
        .rpc('get_manhwas_ordered_by_views', { p_offset, p_limit, p_num_chapters });
    
    if (error) {
        console.log(error)
        return []
    }    
    return data
}

export async function fetchManhwaGenres(manhwa_id: number): Promise<string[]> {
    const { data, error } = await supabase
        .from("manhwa_genres")
        .select("genre")
        .eq("manhwa_id", manhwa_id)
        .order("genre", {ascending: true})
    
    if (error) {
        console.log(error)
        return []
    }

    return data.map(item => item.genre)
}


export async function fetchManhwaByGenre(
    p_genre: string,
    p_offset: number = 0, 
    p_limit: number = 30, 
    p_num_chapters: number = 3
): Promise<Manhwa[]> {
    const { data, error } = await supabase
        .rpc('get_manhwas_by_genre', { p_genre, p_offset, p_limit, p_num_chapters });
    
    if (error) {
        console.log(error)
        return []
    }    

    return data
}

export async function fetchRandomManhwa(
    p_offset: number = 0,
    p_limit: number = 30, 
    p_num_chapters: number = 3
): Promise<Manhwa[]> {
    const { data, error } = await supabase
        .rpc('get_random_manhwas', { p_offset, p_limit, p_num_chapters });

    if (error) {
        console.log(error)
        return []
    }

    return data
}

export async function fetchManhwaByName(
    p_name_manhwa: string,
    p_offset: number = 0,
    p_limit: number = 30,
    p_num_chapters: number = 3
): Promise<Manhwa[]> {
    p_name_manhwa = p_name_manhwa.trim()
    
    const { data, error } = await supabase
        .rpc('get_manhwas_by_name', { p_offset, p_limit, p_num_chapters, p_name_manhwa });

    if (error) {
        console.log(error)
        return []
    }
    
    return data
}

export async function fetchManhwaByAuthor(
    p_author_id: number,
    p_offset: number = 0,
    p_limit: number = 30,
    p_num_chapters: number = 3
): Promise<Manhwa[]> {
    const { data, error } = await supabase
        .rpc('get_manhwas_by_author', { p_offset, p_limit, p_num_chapters, p_author_id });

    if (error) {
        console.log(error)
        return []
    }
        
    return data
}



export async function fetchManhwaAuthors(manhwa_id: number): Promise<ManhwaAuthor[]> {
    const { data, error } = await supabase
        .from("manhwa_authors")
        .select("authors (author_id, name, role)")
        .eq("manhwa_id", manhwa_id)

    if (error) {
        console.log(error)
        return []
    }

    return data.map(item => item.authors) as any
}


export async function fetchManhwaChapterList(manhwa_id: number): Promise<Chapter[]> {
    const { data, error } = await supabase
        .from("chapters")
        .select("chapter_id, manhwa_id, chapter_num, created_at")
        .eq("manhwa_id", manhwa_id)
        .order("chapter_num", {ascending: true})        
        .overrideTypes<Chapter[]>()    

    if (error) {
        console.log(error)
        return []
    }

    return data
}

export async function fetchChapterImages(chapter_id: number): Promise<ChapterImage[]> {
    const { data, error } = await supabase
        .from("chapter_images")
        .select("image_url, width, height")
        .eq("chapter_id", chapter_id)
        .order("index", {ascending: true})

    if (error) {
        console.log(error)
        return []
    }

    return data
}


export async function updateManhwaViews(p_manhwa_id: number) {    
    console.log("increment", p_manhwa_id)
    const { error } = await supabase
        .rpc('increment_manhwa_views', { p_manhwa_id  });

    if (error) {
        console.error('Error incrementing views:', error);
        return null;
    }  
}


export async function fetchGenres(): Promise<string[]> {
    const { data, error } = await supabase
        .rpc('get_genres');

    if (error) {
        console.error('Error fetching enum values:', error);
        return [];
    }

    return data.map((item: {genre: string}) => item.genre)
}