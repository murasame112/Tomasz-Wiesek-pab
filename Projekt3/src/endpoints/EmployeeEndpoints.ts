import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import {Employee} from "../models/EmployeeModel"
import {employeeFilePath, secret} from "../index"
import {addObjToFile, deleteObjById, getObjById, getAllObjs, editObj, checkIfEmployeeExists} from "../globalFunctions"


export function createEmployee(req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    let result: string
    const date = new Date()
    const stringDate = date.toISOString()
    const generatedId = Date.now()

    // pobrac do tablicy courses, departments, groups
    // sprawdzac po kolei, czy podane przeze mnie courses[], departments, groups istnieja (nazwami) (chyba funkcja exists sie nada)
    // jak nie istnieja, to wyskakuje blad i nie dodaje pracownika
    // jak istnieja to git, dodaje
    // odroznic sytuacje gdzie nie istnieja od sytuacji gdy podano null
    // do courses[] mozna uzyc ponizszego for'a, przerobic

    // for (let i = 0; i < req.body.courses.length; i++) {
    //     let actualCourse = req.body.courses[i]
    //     let actualTagName = actualTag.name.toLowerCase()
    //     if (tagsArray.some(e => e.name === actualTagName) == false) {
    //         let tag = new Tag(actualTagName, generatedId)
    //         tagsArray.push(tag)

    //     }
    // }

    const employee = new Employee(generatedId, req.body.name, req.body.surname, req.body.group, stringDate, req.body.phone, req.body.department, req.body.course)
    


    addObjToFile(employee, employeeFilePath)
    result = "Done."   
    res.status(201).send(result)
}

export function deleteEmployee(req: Request, res: Response){

}

export function getEmployee(req: Request, res: Response){

}

export function editEmployee(req: Request, res: Response){
    
}