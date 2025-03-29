

export type Manhwa = {
    manhwa_id: number
    title: string
    views: number
    descr: string
    cover_image_url: string
    status: "OnGoing" | "Completed"
    updated_at: string
}