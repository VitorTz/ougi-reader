import { createClient } from '@supabase/supabase-js'
import { Manhwa } from '@/models/Manhwa'
import { Chapter } from '@/models/Chapter'
import { ChapterImage } from '@/models/Image'
import { ManhwaAuthor } from '@/models/ManhwaAuthor'


const supabaseUrl = 'https://wevyvylwsfcxgbuqawuu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indldnl2eWx3c2ZjeGdidXFhd3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTUyMDMsImV4cCI6MjA1ODU5MTIwM30.EXGkpsPue5o2OD5WOpu4IfOZEgqo3FYKV2QDLNW7P6g'
const MANHWAS_PER_PAGE = 30

export const supabase = createClient(supabaseUrl, supabaseKey)


export async function fetchManhwasLastUpdated(page: number): Promise<Manhwa[]> {
    const { data, error } = await supabase
        .from("manhwas")
        .select("manhwa_id, title, descr, views, status, cover_image_url, color, updated_at")
        .order("updated_at", {ascending: false})
        .range(page * MANHWAS_PER_PAGE, (page * MANHWAS_PER_PAGE) + MANHWAS_PER_PAGE - 1)
        .overrideTypes<Manhwa[]>()
    
    if (error) {
        console.log(error)
        return []
    }
    return data
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


export async function fetchManhwaByGenre(genre: string): Promise<Manhwa[]> {
    const { data, error } = await supabase
        .from("manhwa_genres")
        .select("manhwas (manhwa_id, title, descr, views, status, cover_image_url, color, updated_at)")
        .eq("genre", genre)
        .order("manhwas (views)", {ascending: false})
        .overrideTypes<Manhwa[]>()
    
    if (error) {
        console.log(error)
        return []
    }
    
    return data.map(item => item.manhwas as any)
}

export async function fetchRandomManhwa(): Promise<Manhwa[]> {
    const { data, error } = await supabase
        .rpc('get_random_manhwas', { x: MANHWAS_PER_PAGE });

    if (error) {
        console.log(error)
        return []
    }
    return data
}


export async function fetchManhwaAltTitles(manhwa_id: number, altTitleMap: Map<number, string[]>): Promise<string[]> {
    if (altTitleMap.has(manhwa_id)) {
        return altTitleMap.get(manhwa_id)!
    }

    const { data, error } = await supabase
        .from("manhwa_titles")
        .select("title")
        .eq("manhwa_id", manhwa_id)
    
    if (error) {
        console.log(error)
        return []
    }

    const r = data.map(item => item.title)
    altTitleMap.set(manhwa_id, r)
    return r
}

export async function fetchManhwaByName(name: string, queries: Map<string, Manhwa[]>): Promise<Manhwa[]> {    
    name = name.trim()
    if (queries.has(name)) {        
        return queries.get(name)!
    }
    
    const { data, error } = await supabase
        .from("manhwa_titles")
        .select("manhwas (manhwa_id, title, descr, views, status, cover_image_url, color, updated_at)")
        .ilike("title", `%${name}%`)
    
    if (error) {
        console.log(error)
        return []
    }

    const r = data.map(item => item.manhwas) as any
    queries.set(name, r)
    return r
}

export async function fetchManhwaByAuthor(
    author_id: number,     
    authorMap: Map<number, Manhwa[]>
): Promise<Manhwa[]> {
    if (authorMap.has(author_id)) {        
        return authorMap.get(author_id)!
    }

    const { data, error } = await supabase
        .from("manhwa_authors")
        .select("manhwas (manhwa_id, title, descr, views, status, cover_image_url, color, updated_at)")
        .eq("author_id", author_id)
        .order("manhwas (views)", {ascending: false})
        .overrideTypes<Manhwa[]>()
    
    if (error) {
        console.log(error)
        return []
    }
    
    const r = data.map(item => item.manhwas as any)
    authorMap.set(author_id, r)
    return r
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


export async function fetchManhwasMostView(page: number): Promise<Manhwa[]> {
    const { data, error } = await supabase
        .from("manhwas")
        .select("manhwa_id, title, descr, views, status, cover_image_url, color, updated_at")
        .order("views", {ascending: false})
        .range(page * MANHWAS_PER_PAGE, (page * MANHWAS_PER_PAGE) + MANHWAS_PER_PAGE - 1)
        .overrideTypes<Manhwa[]>()
    
    if (error) {
        console.log(error)
        return []
    }

    return data
}

export async function fetchManhwaChapterList(manhwa_id: number): Promise<Chapter[]> {
    const { data, error } = await supabase
        .from("chapters")
        .select("chapter_id, manhwa_id, chapter_num")
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