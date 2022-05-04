export class User{
    username: string
    userToken: string
    id?: number
    admin?: boolean


    constructor(username: string, userToken: string, id?: number, admin?: boolean) {
        this.username = username
        this.userToken = userToken
        this.id = id
        if (admin == null) {
            this.admin = false
        } else {
            this.admin = admin
        }
    }
}