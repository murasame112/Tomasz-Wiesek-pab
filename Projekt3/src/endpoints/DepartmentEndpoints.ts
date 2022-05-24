import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import {Department} from "../models/DepartmentModel"
import {Employee} from "../models/EmployeeModel"
import {departmentFilePath, employeeFilePath, secret} from "../index"
import {addObjToFile, deleteObjById, getObjById, getAllObjs, editObj, checkIfDepartmentExists} from "../globalFunctions"

export function createDepartment(req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)
    let result: string

    const departmentName = req.body.departmentName
    const departmentAdress = req.body.adress
    const generatedId = Date.now()
    const department = new Department(generatedId, req.body.departmentName, req.body.adress, req.body.description)
    const departmentExists = checkIfDepartmentExists(departmentName, departmentAdress, departmentFilePath)


    if(departmentExists){
        result = "This department already exists."
    }else{       
        addObjToFile(department, departmentFilePath)
        result = "Done."
    }
    res.status(201).send(result)
}

export function deleteDepartment(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    let deleteResult: string
    const departmentId = parseInt(req.params.id, 10)
    const department = getObjById(departmentFilePath, departmentId)
    if(department != null){
        deleteResult = deleteObjById(departmentFilePath, departmentId)
        const generatedId = Date.now()
        const employeesArray: Employee[] = getAllObjs(employeeFilePath)

        for(let i = 0; i < employeesArray.length; i++){
            if(employeesArray[i].department?.id == department.id){
                
                let newDepartment: Department = new Department(generatedId, "", "", "")
                employeesArray[i].department = newDepartment
                editObj(employeeFilePath, employeesArray[i].id, employeesArray[i])
            }
        }

        

    }else{
        deleteResult = "Couldn't find a department with that id."   
    }   
    res.sendStatus(204).send(deleteResult)
}

export function getDepartment(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)


    let result: string


    const departments = getAllObjs(departmentFilePath)

    if(Array.isArray(departments)){
        result = departments.map(department =>
         `<h1>Department name: ${department.departmentName}</h1><br>
         <p>id: ${department.id}</p><br>
         <p>adress: ${department.adress}</p><br>
         <p>id: ${department.description}</p><br>`
        ).join('')
    }else{
        result = 
         `<h1>Department name: ${departments.departmentName}</h1><br>
         <p>id: ${departments.id}</p><br>
         <p>adress: ${departments.adress}</p><br>
         <p>id: ${departments.description}</p><br>`
    }
    res.send(result)
}

export function departmentEmployeeReport(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)


    let result: string = ""
    

    const departments = getAllObjs(departmentFilePath)
    const employees = getAllObjs(employeeFilePath)
    

    if(Array.isArray(departments)){
        
        for(let i = 0; i < departments.length; i++){
            let empCounter = 0
            for(let j = 0; j < employees.length; j++){               
                if(departments[i].departmentName == employees[j].department.departmentName){
                    empCounter++
                } 
            }

            result += 
            `<h1>Department name: ${departments[i].departmentName}</h1>
            <p>Employees: ${empCounter}</p><br><br>
            `
        }
    }else{
        let empCounter = 0
        for(let j = 0; j < employees.length; j++){
            
            if(departments.departamentName == employees.departament.departamentName){
                empCounter++
            } 
        }

        result = 
        `<h1>Department name: ${departments.departmentName}</h1><br>
        <p>Employees: ${empCounter}</p><br>
        `
        
    }
    res.send(result)
}

export function editDepartment(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)


    const departmentId = parseInt(req.params.id, 10)
    let result: string
    
    const department = getObjById(departmentFilePath, departmentId)

    if(department != null){
        let newDepartment = new Department(department.id, req.body.departmentName, req.body.adress, req.body.description)
        const newDepartmentName = req.body.departmentName
        const newDepartmentAdress = req.body.adress
        const newDepartmentExists = checkIfDepartmentExists(newDepartmentName, newDepartmentAdress, departmentFilePath)
        if(newDepartmentExists){
            result = "This department already exists"
        }else{
            editObj(departmentFilePath, department.id, newDepartment)

            const employeesArray: Employee[] = getAllObjs(employeeFilePath)

            for(let i = 0; i < employeesArray.length; i++){
                if(employeesArray[i].department?.departmentName == department.departmentName){
                    employeesArray[i].department = newDepartment
                    editObj(employeeFilePath, employeesArray[i].id, employeesArray[i])
                }
                
            }
            result = "Done."
        }
    }else{
        result = "Couldn't find a department with that id."
    }

    res.sendStatus(204).send(result)
}