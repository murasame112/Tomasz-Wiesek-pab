export class User{
    username: string
    id?: number
    admin?: boolean


    constructor(username: string,  id?: number, admin?: boolean) {
        this.username = username
        this.id = id
        if (admin == null) {
            this.admin = false
        } else {
            this.admin = admin
        }
    }
}