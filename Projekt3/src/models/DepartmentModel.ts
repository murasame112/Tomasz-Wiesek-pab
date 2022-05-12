export class Department{
    id: number
    departmentName: string
    adress: string
    description?: string
    

    constructor(id: number, departmentName: string, adress: string, description?: string) {
        this.id = id
        this.departmentName = departmentName
        this.adress = adress
        if(description == null){
            this.description = ""
        }else{
            this.description = description
        }
    }

}