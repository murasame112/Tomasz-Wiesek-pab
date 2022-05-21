import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import {Employee} from "../models/EmployeeModel"
import {Group} from "../models/GroupModel"
import {Department} from "../models/DepartmentModel"
import {Course} from "../models/CourseModel"
import {courseFilePath, departmentFilePath, employeeFilePath, groupFilePath, secret} from "../index"
import {addObjToFile, deleteObjById, getObjById, getAllObjs, editObj, checkIfEmployeeExists, getGrpByName, getDepByName, getCrsByName} from "../globalFunctions"


export function createEmployee(req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    let result: string
    const date = new Date()
    const stringDate = date.toISOString()
    const generatedId = Date.now()

    const courseArray: Course[] = getAllObjs(courseFilePath)
    const departmentArray: Department[] = getAllObjs(departmentFilePath)
    const groupArray: Group[] = getAllObjs(groupFilePath)

    const courseNames: string[] = req.body.course
    const departmentName: string = req.body.departament
    const groupName: string = req.body.group

    let acceptedCourseNames: string []
    let acceptedDepartmentName: string
    let acceptedGroupName: string

    for (let i = 0; i < courseNames.length; i++) {
        let actualCourse = courseNames[i]
        if (courseArray.some(c => c.courseName === actualCourse) == true) {
            acceptedCourseNames.push(actualCourse)
        }else{
            result+= actualCourse + " cannot be added, since it's not a course. "
        }
    }

    if(departmentArray.some(d => d.departmentName === departmentName) == true) {
        acceptedDepartmentName = departmentName
    }else{
        acceptedDepartmentName = ""
    }

    if(groupArray.some(g => g.groupName === groupName) == true){
        acceptedGroupName = groupName
    }else{
        acceptedGroupName = ""
    }

    let acceptedGroup: Group
    let acceptedDepartment: Department
    let acceptedCourses: Course[]

    if(acceptedDepartmentName != ""){
        acceptedDepartment = getDepByName(acceptedDepartmentName, departmentFilePath)
    }else{
        acceptedDepartment = null
    }

    if(acceptedGroupName != ""){
        acceptedGroup = getGrpByName(acceptedGroupName,  groupFilePath)
    }else{
        acceptedGroup = null
    }

    if(acceptedCourseNames.length > 0){
        acceptedCourses = getCrsByName(acceptedCourseNames, courseFilePath)

    }else{
        acceptedCourses = null
    }
    
    if(acceptedGroup == null || acceptedGroupName == null || acceptedGroupName == ""){
        result += "Employee has to be in a group! "
    }else{
        const employee = new Employee(generatedId, req.body.name, req.body.surname, acceptedGroup, stringDate, req.body.phone, acceptedDepartment, acceptedCourses)
        result += "Done. "
        addObjToFile(employee, employeeFilePath)
    }
    
    res.status(201).send(result)
}

export function deleteEmployee(req: Request, res: Response){

}

export function getEmployee(req: Request, res: Response){

}

export function editEmployee(req: Request, res: Response){
    
}