export class Course{
    id: number
    courseName: string
    points: number
    

    constructor(id: number, courseName: string, points: number) {
        this.id = id
        this.courseName = courseName
        this.points = points
    }

}