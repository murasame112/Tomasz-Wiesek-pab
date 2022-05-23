import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import {Course} from "../models/CourseModel"
import {Employee} from "../models/EmployeeModel"
import {courseFilePath, employeeFilePath, secret} from "../index"
import {addObjToFile, deleteObjById, getObjById, getAllObjs, editObj, checkIfCourseExists} from "../globalFunctions"

export function createCourse(req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)
    let result: string

    const courseName = req.body.courseName
    const generatedId = Date.now()
    const course = new Course(generatedId, req.body.courseName, req.body.points)
    const courseExists = checkIfCourseExists(courseName, courseFilePath)


    if(courseExists){
        result = "This course already exists."
    }else{       
        addObjToFile(course, courseFilePath)
        result = "Done."
    }
    res.status(201).send(result)
}

export function deleteCourse(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    let deleteResult: string
    const courseId = parseInt(req.params.id, 10)
    const course = getObjById(courseFilePath, courseId)
    if(course != null){
        deleteResult = deleteObjById(courseFilePath, courseId)
    }else{
        deleteResult = "Couldn't find a course with that id."   
    }   
    res.sendStatus(204).send(deleteResult)
}

export function getCourse(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)


    let result: string


    const courses = getAllObjs(courseFilePath)

    if(Array.isArray(courses)){
        result = courses.map(course =>
        `<h1>Course name: ${course.courseName}</h1><br>
         <p>id: ${course.id}</p><br>
         <p>points: ${course.points}</p><br>
            `
        ).join('')
    }else{
        result = 
         `<h1>Course name: ${courses.courseName}</h1><br>
         <p>id: ${courses.id}</p><br>
         <p>points: ${courses.points}</p><br>`
    }


    res.send(result)
}

export function editCourse(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)


    const courseId = parseInt(req.params.id, 10)
    let result: string
    
    const course = getObjById(courseFilePath, courseId)

    if(course != null){
        let newCourse = new Course(course.id, req.body.courseName, req.body.points)
        const newCourseName = req.body.courseName
        const newCourseExists = checkIfCourseExists(newCourseName, courseFilePath)
        if(newCourseExists){
            result = "This course already exists"
        }else{
            editObj(courseFilePath, course.id, newCourse)

            const employeesArray: Employee[] = getAllObjs(employeeFilePath)

            for(let i = 0; i < employeesArray.length; i++){
                for(let j = 0; j < employeesArray[i].course.length; j++){
                    if(employeesArray[i].course[j].courseName == course.courseName){
                        employeesArray[i].course[j].courseName = newCourse.courseName
                        editObj(employeeFilePath, employeesArray[i].id, employeesArray[i])
                    }
                }
            }
            
            result = "Done."
        }
    }else{
        result = "Couldn't find a course with that id."
    }

    res.sendStatus(204).send(result)
}