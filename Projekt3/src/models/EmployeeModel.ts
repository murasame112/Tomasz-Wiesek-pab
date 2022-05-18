import { Group } from "./GroupModel"
import { Department } from "./DepartmentModel"
import { Course } from "./CourseModel"

export class Employee{
    id: number
    name: string
    surname: string
    department?: Department
    course?: Course[]
    group: Group
    joiningDate: string
    phone: string


    constructor(id: number, name: string, surname: string, group: Group, joiningDate: string, phone: string, department?: Department, course?: Course[]) {
        this.id = id
        this.name = name
        this.surname = surname
        this.department = department
        this.course = course  
        this.group = group
        this.joiningDate = joiningDate
        this.phone = phone
    }

}