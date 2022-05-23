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
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    let deleteResult: string
    const employeeId = parseInt(req.params.id, 10)
    const employee = getObjById(employeeFilePath, employeeId)
    if(employee != null){
        deleteResult = deleteObjById(employeeFilePath, employeeId)
    }else{
        deleteResult = "Couldn't find an employee with that id."   
    }   
    res.sendStatus(204).send(deleteResult)
}

export function getEmployee(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    let result: string
    const employees = getAllObjs(employeeFilePath)
   
    if(Array.isArray(employees)){
        result = employees.map(employee =>
         `<h1>Employee's name: ${employee.name}</h1><br>
         <p>Employee's surname: ${employee.surname}</p><br>
         <p>id: ${employee.id}</p><br>
         <p>department: ${employee.departament.departmentName}</p><br>
         <p>group: ${employee.group.groupName}</p><br>
         <p>courses: ${employee.course.map(crs => crs.name + ", ").join('')}</p><br>
         <p>joining date: ${employee.joiningDate}</p><br>
         <p>phone: ${employee.phone}</p><br>`
        ).join('')
    }else{
        result = 
         `<h1>Employee's name: ${employees.name}</h1><br>
         <p>Employee's surname: ${employees.surname}</p><br>
         <p>id: ${employees.id}</p><br>
         <p>department: ${employees.departament.departmentName}</p><br>
         <p>group: ${employees.group.groupName}</p><br>
         <p>courses: ${employees.course.map(crs => crs.name + ", ").join('')}</p><br>
         <p>joining date: ${employees.joiningDate}</p><br>
         <p>phone: ${employees.phone}</p><br>`
        
    }
    res.send(result)
}

export function editEmployee(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    const employeeId = parseInt(req.params.id, 10)
    let result: string
    
    const employee = getObjById(employeeFilePath, employeeId)

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
        acceptedGroup = employee.group
    }

    if(acceptedCourseNames.length > 0){
        acceptedCourses = getCrsByName(acceptedCourseNames, courseFilePath)

    }else{
        acceptedCourses = null
    }

    if(employee != null){
        let newEmployee = new Employee(employee.id, req.body.name, req.body.surname, acceptedGroup, employee.joiningDate, req.body.phone, acceptedDepartment, acceptedCourses)

        editObj(employeeFilePath, employee.id, newEmployee)
        result += "Done. "
        
    }else{
        result += "Couldn't find an employee with that id. "
    }

    res.sendStatus(204).send(result)
}