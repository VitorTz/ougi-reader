import { Chapter } from "./Chapter"


export type Manhwa = {
    manhwa_id: number
    title: string
    descr: string
    cover_image_url: string
    status: "OnGoing" | "Completed"
    updated_at: string
    color: string
    chapters: Chapter[] | null
}