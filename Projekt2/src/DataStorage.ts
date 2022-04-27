import { Tag } from "./tagModel"

export interface DataStorage {
    title: string
    content: string
    createDate?: string
    tags: Tag[]
    id?: number
    username?: string
    visibility?: boolean
    // private = false, public = true
}