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
import { isImportEqualsDeclaration } from 'typescript'


export function createEmployee(req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    let result: string = ""
    const date = new Date()
    const stringDate = date.toISOString()
    const generatedId = Date.now()

    const courseArray: Course[] = getAllObjs(courseFilePath)
    const departmentArray: Department[] = getAllObjs(departmentFilePath)
    const groupArray: Group[] = getAllObjs(groupFilePath)

    const courseNames: string[] = req.body.course
    const departmentName: string = req.body.department
    const groupName: string = req.body.group

    let acceptedCourseNames: string [] = []
    let acceptedDepartmentName: string
    let acceptedGroupName: string

    if(Array.isArray(courseNames)){
        for (let i = 0; i < courseNames.length; i++) {
            let actualCourse = courseNames[i]
            console.log(courseArray.length)
            console.log("actual from array: " + actualCourse)
            if (courseArray.some(c => c.courseName === actualCourse) == true) {
                acceptedCourseNames.push(actualCourse)
            }else{
                result+= actualCourse + " cannot be added, since it's not a course. "
            }
        }
    }else if(courseNames != "" || courseNames != null || courseNames != undefined){
        result+= " Course must be added as an array! " 
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
        acceptedDepartment = new Department(generatedId, "", "")
    }

    if(acceptedGroupName != ""){
        acceptedGroup = getGrpByName(acceptedGroupName,  groupFilePath)
    }else{
        acceptedGroup = new Group(generatedId, "")
    }

    if(acceptedCourseNames.length > 0){
        acceptedCourses = getCrsByName(acceptedCourseNames, courseFilePath)

    }else{
        acceptedCourses = [] 
    }
    
    if(acceptedGroupName == null || acceptedGroupName == "" || acceptedGroup.groupName == ""){
        result += "Employee has to be in a group! "
    }else{
        const employee = new Employee(generatedId, req.body.name, req.body.surname, acceptedGroup, stringDate, req.body.phone, acceptedCourses, acceptedDepartment)
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
        result = employees.map((employee: Employee) =>
         `<h1>Employee's name: ${employee.name}</h1><br>
         <p>Employee's surname: ${employee.surname}</p><br>
         <p>id: ${employee.id}</p><br>
         <p>department: ${employee.department?.departmentName}</p><br>
         <p>group: ${employee.group.groupName}</p><br>
         <p>courses: ${employee.course.map((crs: Course) => crs.courseName + ", ").join('')}</p><br>
         <p>joining date: ${employee.joiningDate}</p><br>
         <p>phone: ${employee.phone}</p><br>`
        ).join('')
    }else{
        result = 
         `<h1>Employee's name: ${employees.name}</h1><br>
         <p>Employee's surname: ${employees.surname}</p><br>
         <p>id: ${employees.id}</p><br>
         <p>department: ${employees.department.departmentName}</p><br>
         <p>group: ${employees.group.groupName}</p><br>
         <p>courses: ${employees.course.map((crs: Course) => crs.courseName + ", ").join('')}</p><br>
         <p>joining date: ${employees.joiningDate}</p><br>
         <p>phone: ${employees.phone}</p><br>`
        
    }
    res.send(result)
}

export function employeeCourseReport(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    const employeeId = parseInt(req.params.id, 10)
    let result: string
    let points: number = 0
    const employee: Employee = getObjById(employeeFilePath, employeeId)

    for(let i = 0; i < employee.course.length; i++){
        points += employee.course[i].points
    }

    result = 
         `<h1>name: ${employee.name}</h1><br>
         <p>surname: ${employee.surname}</p><br>
         <h4>courses: </h4> ${employee.course.map((crs: Course) =>"<p>" + crs.courseName + "</p><br>").join('')}
         <p>points: ${points}</p><br>`
    res.send(result)
}

export function editEmployee(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    const employeeId = parseInt(req.params.id, 10)
    let result: string = ""
    
    const employee = getObjById(employeeFilePath, employeeId)

    const courseArray: Course[] = getAllObjs(courseFilePath)
    const departmentArray: Department[] = getAllObjs(departmentFilePath)
    const groupArray: Group[] = getAllObjs(groupFilePath)

    const courseNames: string[] = req.body.course
    const departmentName: string = req.body.department
    const groupName: string = req.body.group

    let acceptedCourseNames: string [] = []
    let acceptedDepartmentName: string
    let acceptedGroupName: string

    if(Array.isArray(courseNames)){
        for (let i = 0; i < courseNames.length; i++) {
            let actualCourse = courseNames[i]
            if (courseArray.some(c => c.courseName === actualCourse) == true) {
                acceptedCourseNames.push(actualCourse)
            }else{
                result+= actualCourse + " cannot be added, since it's not a course. "
            }
        }
    }else if(courseNames != "" || courseNames != null || courseNames != undefined){
        result+= " Course must be added as an array! " 
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
        acceptedDepartment = employee.department
    }

    if(acceptedGroupName != ""){
        acceptedGroup = getGrpByName(acceptedGroupName,  groupFilePath)
    }else{
        acceptedGroup = employee.group
    }

    if(acceptedCourseNames.length > 0){
        acceptedCourses = getCrsByName(acceptedCourseNames, courseFilePath)

    }else{
        acceptedCourses = employee.course
    }

    if(employee != null){

        let empName: string
        let empSurname: string
        let empPhone: string

        if(req.body.name == null || req.body.name == "" || req.body.name == undefined){
            empName = employee.name
        }else{
            empName = req.body.name
        }

        if(req.body.surname == null || req.body.surname == "" || req.body.surname == undefined){
            empSurname = employee.surname
        }else{
            empSurname = req.body.surname
        }

        if(req.body.phone == null || req.body.phone == "" || req.body.phone == undefined){
            empPhone = req.body.phone
        }else{
            empPhone = req.body.phone
        }




        let newEmployee = new Employee(employee.id, empName, empSurname, acceptedGroup, employee.joiningDate, empPhone, acceptedCourses, acceptedDepartment)

        editObj(employeeFilePath, employee.id, newEmployee)
        result += "Done. "
        
    }else{
        result += "Couldn't find an employee with that id. "
    }

    res.sendStatus(204).send(result)
}