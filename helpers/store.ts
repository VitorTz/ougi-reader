import { Chapter } from '@/models/Chapter'
import { ChapterImage } from '@/models/Image'
import { Manhwa } from '@/models/Manhwa'
import { Session } from '@supabase/supabase-js'
import { create }  from 'zustand'


export type ReadingState = {
    manhwa: Manhwa | null
    setManhwa: (manhwa: Manhwa) => void
    chapterMap: Map<number, Chapter>
    chapterNum: number | null
    currentChapter: Chapter | null
    setChapterMap: (chapterList: Chapter[]) => void    
    setChapterNum: (newChapterIndex: number) => void
    moveToNextChapter: () => void
    moveToPreviousChapter: () => void
    clearReadingState: () => void
}


export const useReadingState = create<ReadingState>(
    (set) => ({
        manhwa: null,
        chapterMap: new Map<number, Chapter>,
        chapterNum: null,
        currentChapter: null,
        setManhwa: (manhwa: Manhwa) => {set((state) => {            
            return {...state, manhwa}
        })},
        setChapterMap: (chapterList: Chapter[]) => {set((state) => {
            const newChapterMap = new Map()
            chapterList.forEach(item => newChapterMap.set(item.chapter_num, item))
            return {...state, chapterMap: newChapterMap}
        })
        },
        setChapterNum: (newChapterNum: number) => {set((state) => {
            if (state.chapterMap.has(newChapterNum)) {
                return {...state, chapterNum: newChapterNum, currentChapter: state.chapterMap.get(newChapterNum)}
            }            
            return state
        })},
        moveToNextChapter: () => {set((state) => {
            if (state.chapterNum && state.chapterMap.has(state.chapterNum + 1)) {
                return {
                    ...state, 
                    chapterNum: state.chapterNum + 1, 
                    currentChapter: state.chapterMap.get(state.chapterNum + 1)
                }
            }
            return state
        })},
        moveToPreviousChapter: () => {set((state) => {
            if (state.chapterNum && state.chapterMap.has(state.chapterNum - 1)) {
                return {
                    ...state,
                    chapterNum: state.chapterNum - 1,
                    currentChapter: state.chapterMap.get(state.chapterNum - 1)
                }
            }
            return state
        })},
        clearReadingState: () => {set((state) => {
            return {
                ...state,
                manhwa: null,
                chapterMap: new Map(),
                chapterIndex: null,
                currentChapter: null,
            }
        })}
    })
)


export type ChapterImageState = {
    imageMap: Map<number, ChapterImage[]>
    addImages: (chapterId: number, images: ChapterImage[]) => void
}

export const useChapterImageState = create<ChapterImageState>(
    (set) => ({
        imageMap: new Map(),
        addImages: (chapterId: number, images: ChapterImage[]) => {set((state) => {
            const m = new Map(state.imageMap)
            if (!m.has(chapterId)) {
                m.set(chapterId, images);
            }
            const a = { ...state, imageMap: m }
            return { ...state, imageMap: m };
        })}
    })
)

export type ReadingHistoryState = {
    readingHistoryMap: Set<number>
    addToReadingHistory: (chapter_id: number) => void
    setReadingHistory: (r: Set<number>) => void    
}


export const useReadingHistoryState = create<ReadingHistoryState>(
    (set) => ({
        readingHistoryMap: new Set(),
        addToReadingHistory: (chapter_id: number) => {set((state) => {
            const s = new Set(state.readingHistoryMap)
            s.add(chapter_id)
            return {...state, readingHistoryMap: s}
        })},
        setReadingHistory: (r: Set<number>) => {set((state) => {
            return {...state, readingHistoryMap: r}
        })}
    })
)

export type ReadingStatusState = {
    readingStatus: Map<number, {manhwa: Manhwa, status: string}>
    addReadingStatus: (manhwa: Manhwa, status: string) => void
    setReadingStatus: (r: Map<number, {manhwa: Manhwa, status: string}>) => void
}

export const useReadingStatusState = create<ReadingStatusState>(
    (set) => ({
        readingStatus: new Map(),
        addReadingStatus: (manhwa: Manhwa, status: string) => {set((state) => {
            const r = new Map(state.readingStatus)
            r.set(manhwa.manhwa_id, {manhwa, status})
            return {...state, readingStatus :r}
        })},
        setReadingStatus: (r: Map<number, {manhwa: Manhwa, status: string}>) => (set((state) => {
            return {...state, readingStatus: r}
        }))
    })
)


type AuthState = {
    username: string | null
    image_url: string | null
    session: Session | null
    login: (username: string | null, image_url: string | null, session: Session | null) => void
    logout: () => void
}

export const useAuthState = create<AuthState>(
    (set) => ({
        username: null,
        image_url: null,
        session: null,
        login: (username: string | null, image_url: string | null, session: Session | null) => {
            (set((state) => {return {...state, username, image_url, session}}))
        },
        logout: () => {
            set((state) => {return {...state, username: null, image_url: null, session: null}})
        }
    })
)

type MostViewManhwasState = {
    manhwas: Manhwa[]
    lastUpdate: number
    setManhwas: (manhwas: Manhwa[]) => void    
}

export const useMostViewManhwasState = create<MostViewManhwasState>(
    (set) => ({
        manhwas: [],
        lastUpdate: Date.now(),
        setManhwas: (manhwas: Manhwa[]) => {set((state) => {            
            return {...state, manhwas: manhwas, lastUpdate: Date.now()}
        })}
    })
)

type LatestReleasesManhwaState = {
    manhwas: Manhwa[]
    lastUpdate: number
    setManhwas: (manhwas: Manhwa[]) => void    
}

export const useLatestReleasesManhwaState = create<LatestReleasesManhwaState>(
    (set) => ({
        manhwas: [],
        lastUpdate: Date.now(),
        setManhwas: (manhwas: Manhwa[]) => {set((state) => {            
            return {...state, manhwas: manhwas, lastUpdate: Date.now()}
        })}
    })
)


type RandomManhwaState = {
    manhwas: Manhwa[]
    lastUpdate: number
    setManhwas: (manhwas: Manhwa[]) => void    
}

export const useRandomManhwaState = create<RandomManhwaState>(
    (set) => ({
        manhwas: [],
        lastUpdate: Date.now(),
        setManhwas: (manhwas: Manhwa[]) => {set((state) => {            
            return {...state, manhwas: manhwas, lastUpdate: Date.now()}
        })}
    })
)

type ManhwaGenresState = {
    genres: string[]
    setGenres: (genres: string[]) => void
}

export const useManhwaGenresState = create<ManhwaGenresState>(
    (set) => ({
        genres: [],
        setGenres: (genres: string[]) => {set((state) => {
            return {...state, genres}
        })}
    })
)

type ManhwaLatestReleasesPagesState = {
    pages: Map<number, Manhwa[]>
    addPage: (page: number, manhwas: Manhwa[]) => void
}

export const useManhwaQueriesState = create<ManhwaLatestReleasesPagesState>(
    (set) => ({
        pages: new Map(),
        addPage: (page: number, manhwas: Manhwa[]) => {set((state) => {
            const r = new Map(state.pages)
            r.set(page, manhwas)
            return {...state, pages: r}
        })}
    })
)

type ManhwaMostViewPagesState = {
    pages: Map<number, Manhwa[]>
    addPage: (page: number, manhwas: Manhwa[]) => void
}


export const useManhwaMostViewPagesState = create<ManhwaMostViewPagesState>(
    (set) => ({
        pages: new Map(),
        addPage: (page: number, manhwas: Manhwa[]) => {set((state) => {
            const r = new Map(state.pages)
            r.set(page, manhwas)
            return {...state, pages: r}
        })}
    })
)