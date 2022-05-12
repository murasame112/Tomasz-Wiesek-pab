export class User{
    id: number
    userName: string
    admin?: boolean //false means not an admin, true means an admin
    

    constructor(id: number, userName: string, admin?: boolean) {
        this.id = id
        this.userName = userName
        
        if(admin == null){
            this.admin = false
        }else{
            this.admin = admin
        }
    }

}