import { createClient, Session } from '@supabase/supabase-js'
import { Manhwa } from '@/models/Manhwa'
import { Chapter } from '@/models/Chapter'
import { ChapterImage } from '@/models/Image'
import { AppState } from 'react-native'
import { ManhwaAuthor } from '@/models/ManhwaAuthor'
import AsyncStorage from "@react-native-async-storage/async-storage";


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

export async function fetchUser(): Promise<{username: string, image_url: string | null} | null> {
    const session = await getSession()

    if (!session) {
        return null
    }
    const {data, error } = await supabase
        .from("users")
        .select("username, image_url")
        .eq("user_id", session.user.id)
        .single()

    return data
}


export async function fetchBookmarkStatus(p_manhwa_id: number): Promise<boolean | null> {    

    const session = await getSession()
    if (!session) { return null }

    const { data, error } = await supabase
        .rpc('toggle_user_bookmark', { p_user_id: session.user.id, p_manhwa_id });
    
    if (error) {
        console.log(error)
        return false
    }    
    return data
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

export async function fetchManhwaGenres(manhwa_id: number, genreMap: Map<number, string[]>): Promise<string[]> {
    if (genreMap.has(manhwa_id)) {
        const g = genreMap.get(manhwa_id)
        if (g && g.length > 0) {
            return g!
        }
    }

    const { data, error } = await supabase
        .from("manhwa_genres")
        .select("genre")
        .eq("manhwa_id", manhwa_id)
        .order("genre", {ascending: true})
    
    if (error) {
        console.log(error)
        return []
    }

    const newGenres = data.map(item => item.genre)
    genreMap.set(manhwa_id, newGenres)
    return newGenres
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
    queries: Map<string, Manhwa[]>,
    p_offset: number = 0,
    p_limit: number = 30,
    p_num_chapters: number = 3
): Promise<Manhwa[]> {    
    console.log(p_name_manhwa, p_offset, p_limit, p_num_chapters)
    p_name_manhwa = p_name_manhwa.trim()
    if (queries.has(p_name_manhwa)) {        
        return queries.get(p_name_manhwa)!
    }
    
    const { data, error } = await supabase
        .rpc('get_manhwas_by_name', { p_offset, p_limit, p_num_chapters, p_name_manhwa });

    if (error) {
        console.log(error)
        return []
    }
    
    queries.set(p_name_manhwa, data)
    return data
}

export async function fetchManhwaByAuthor(
    p_author_id: number,
    authorMap: Map<number, Manhwa[]>,
    p_offset: number = 0,
    p_limit: number = 30,
    p_num_chapters: number = 3
): Promise<Manhwa[]> {
    if (authorMap.has(p_author_id)) {        
        return authorMap.get(p_author_id)!
    }
    
    const { data, error } = await supabase
        .rpc('get_manhwas_by_author', { p_offset, p_limit, p_num_chapters, p_author_id });

    if (error) {
        console.log(error)
        return []
    }
    
    authorMap.set(p_author_id, data)
    return data
}



export async function fetchManhwaAuthors(manhwa_id: number, authorMap: Map<number, ManhwaAuthor[]>): Promise<ManhwaAuthor[]> {
    if (authorMap.has(manhwa_id)) {
        return authorMap.get(manhwa_id)!
    }

    const { data, error } = await supabase
        .from("manhwa_authors")
        .select("authors (author_id, name, role)")
        .eq("manhwa_id", manhwa_id)

    if (error) {
        console.log(error)
        return []
    }

    const r = data.map(item => item.authors) as any
    authorMap.set(manhwa_id, r)
    return r
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

export async function fetchChapterImages(chapter_id: number, imageMap: Map<number, ChapterImage[]>): Promise<ChapterImage[]> {
    if (imageMap.has(chapter_id)) {
        const images = imageMap.get(chapter_id)
        if (images && images.length > 0 ) {
            return images
        }
    }

    const { data, error } = await supabase
        .from("chapter_images")
        .select("image_url, width, height")
        .eq("chapter_id", chapter_id)
        .order("index", {ascending: true})

    if (error) {
        console.log(error)
        return []
    }    
    imageMap.set(chapter_id, data)
    return data
}


export async function updateManhwaViews(manhwa_id: number) {    
    const { error } = await supabase
        .rpc('increment_manhwa_views', {
            p_manhwa_id: manhwa_id  
        });

    if (error) {
        console.error('Error incrementing views:', error);
        return null;
    }  
}


export async function fetchGenres(genres: Set<string>) {
    if (genres.size > 0) { return }

    const { data, error } = await supabase
        .rpc('get_genres');

    if (error) {
        console.error('Error fetching enum values:', error);
        return [];
    }

    data.map((item: any) => genres.add(item.genre));
}