import React from 'react';
import { Manhwa } from '@/models/Manhwa';
import { Chapter } from '@/models/Chapter';
import { ChapterImage } from '@/models/Image';
import { ManhwaAuthor } from '@/models/ManhwaAuthor';
import { Session } from '@supabase/supabase-js';


export interface GlobalContextProps {
    session: Session | null
    manhwa: Manhwa | null  
    chapters: Chapter[] | null
    chapter_index: number | null
    chapter_images: Map<number, ChapterImage[]>
    chapter_readed: Set<number>
    manhwa_genres: Map<number, string[]>
    manhwa_authors: Map<number, ManhwaAuthor[]>
    manhwa_by_author: Map<number, Manhwa[]>
    manhwa_alt_titles: Map<number, string[]>
    manhwa_queries: Map<string, Manhwa[]>
    user_bookmarks: Map<number, Manhwa>
    genres: Set<string>
    user: {username: string, image_url: string | null} | null
    most_view_manhwas: {mawnhas: Manhwa[], last_update: number | null}
    last_update_manhwas: {mawnhas: Manhwa[], last_update: number | null}
    random_manhwas: {mawnhas: Manhwa[], last_update: number | null}
    manhwa_rating: Map<number, number>
}

export const GlobalContext = React.createContext<GlobalContextProps>({
  manhwa: null,
  chapters: null,
  chapter_index: null,
  chapter_images: new Map(),
  chapter_readed: new Set(),
  manhwa_genres: new Map(),
  manhwa_authors: new Map(),
  manhwa_by_author: new Map(),
  manhwa_alt_titles: new Map(),
  manhwa_queries: new Map(),
  genres: new Set(),
  user_bookmarks: new Map(),
  session: null,
  user: null,
  most_view_manhwas: {mawnhas: [], last_update: null},
  last_update_manhwas: {mawnhas: [], last_update: null},
  random_manhwas: {mawnhas: [], last_update: null},
  manhwa_rating: new Map()
});