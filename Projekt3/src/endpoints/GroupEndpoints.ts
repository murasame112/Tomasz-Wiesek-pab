import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import {Group} from "../models/GroupModel"
import {Employee} from "../models/EmployeeModel"
import {groupFilePath, employeeFilePath, secret} from "../index"
import {addObjToFile, deleteObjById, getObjById, getAllObjs, editObj, checkIfGroupExists} from "../globalFunctions"

export function createGroup(req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)
    let result: string

    const groupName = req.body.groupName
    const generatedId = Date.now()
    const group = new Group(generatedId, req.body.groupName)
    const groupExists = checkIfGroupExists(groupName, groupFilePath)


    if(groupExists){
        result = "This group already exists."
    }else{       
        addObjToFile(group, groupFilePath)
        result = "Done."
    }
    res.status(201).send(result)
}

export function deleteGroup(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    let employeeCounter = 0

    let deleteResult: string
    const groupId = parseInt(req.params.id, 10)
    const group = getObjById(groupFilePath, groupId)
    if(group != null){

        const employeesArray: Employee[] = getAllObjs(employeeFilePath)

        for(let i = 0; i < employeesArray.length; i++){
            if(employeesArray[i].group.groupName == group.groupName){
                employeeCounter++
            }
        }

        if(employeeCounter == 0){
            deleteResult = deleteObjById(groupFilePath, groupId)
        }else{
            deleteResult = "You have to delete " + employeeCounter + " employees from this group before deleting it!"
        }
        
    }else{
        deleteResult = "Couldn't find a group with that id."   
    }   
    res.sendStatus(204).send(deleteResult)
}

export function getGroup(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    let result: string

    const groups = getAllObjs(groupFilePath)

    if(Array.isArray(groups)){
        result = groups.map(group =>
         `<h1>Group name: ${group.groupName}</h1><br>
         <p>id: ${group.id}</p><br>`
        ).join('')
    }else{
        result = 
         `<h1>Group name: ${groups.groupName}</h1><br>
         <p>id: ${groups.id}</p><br>`
        
    }
    res.send(result)
}

export function editGroup(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)


    const groupId = parseInt(req.params.id, 10)
    let result: string
    
    const group = getObjById(groupFilePath, groupId)

    if(group != null){
        let newGroup = new Group(group.id, req.body.groupName)
        const newGroupName = req.body.groupName
        const newGroupExists = checkIfGroupExists(newGroupName, groupFilePath)
        if(newGroupExists){
            result = "This group already exists"
        }else{
            editObj(groupFilePath, group.id, newGroup)

            const employeesArray: Employee[] = getAllObjs(employeeFilePath)

            for(let i = 0; i < employeesArray.length; i++){
                if(employeesArray[i].group.groupName == group.groupName){
                    employeesArray[i].group.groupName = newGroup.groupName
                    editObj(employeeFilePath, employeesArray[i].id, employeesArray[i])
                    }
                
            }
            result = "Done."
        }
    }else{
        result = "Couldn't find a group with that id."
    }

    res.sendStatus(204).send(result)
}