import { Tag } from "./tagModel"
import { DataStorage } from "./DataStorage"

export class Note implements DataStorage{
    title: string
    content: string
    createDate?: string
    tags: Tag[]
    id?: number
    username?: string
    visibility?: boolean
    // private = false, public = true

    constructor(title: string, content: string, tags: Tag[], createDate?: string, id?: number, username?: string, visibility?: boolean) {
        this.title = title
        this.content = content
        this.createDate = createDate
        this.tags = tags
        this.id = id
        this.username = username
        if (visibility == null) {
            this.visibility = false
        } else {
            this.visibility = visibility
        }
    }
}