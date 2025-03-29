import React from 'react';
import { Manhwa } from '@/models/Manhwa';
import { Chapter } from '@/models/Chapter';
import { ChapterImage } from '@/models/Image';
import { ManhwaAuthor } from '@/models/ManhwaAuthor';


export interface GlobalContextProps {
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
    genres: Set<string>
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
  genres: new Set()
});