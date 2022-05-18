import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import {User} from "../models/UserModel"
import {userFilePath, secret} from "../index"
import {addObjToFile, deleteObjById, getObjById, getAllObjs, getLoggedId, editObj, checkIfUsernameExists} from "../globalFunctions"

export function login(req: Request, res: Response) {
   
    const userLogin: string = req.body.login
    const userPassword: string = req.body.password
    let isAdmin: boolean = req.body.admin
    let token
    if(isAdmin == null){
        isAdmin = false
    }

    const userExists = checkIfUsernameExists(userLogin, userFilePath)
    if(userExists){
        token = "User with that username already exists."
    }else{
        const createdPayload = userLogin + '.' + userPassword + '.' + isAdmin
        token  =  jwt.sign(createdPayload, secret)
            
        const generatedId = Date.now()
        let user = new User(generatedId, userLogin, req.body.admin)
        
        addObjToFile(user, userFilePath)
    }
   
    res.status(201).send(token)
}

export function deleteUser(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    const isAdmin = payload.split('.')[2]
    let deleteResult: string
    const userId = parseInt(req.params.id, 10)
    const user = getObjById(userFilePath, userId)
    if(user != null  && (isAdmin == true || isAdmin == "true")){
        deleteResult = deleteObjById(userFilePath, userId)
    }else{
        deleteResult = "Couldn't find an user with that id."   
    }   
    res.sendStatus(204).send(deleteResult)
}

export function getUser(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    const isAdmin = payload.split('.')[2]
    let result: string
    const loggedUsername = payload.split('.')[0]

    if(isAdmin == true || isAdmin == "true"){
        const users: User[] = getAllObjs(userFilePath)
        result = users.map(user =>
            `<h1>username: ${user.userName}</h1><br>
            <p>id: ${user.id}</p><br>
            <p>is admin: ${user.admin}</p>
            `
        ).join('')
    }else{
        const userId = getLoggedId(userFilePath, loggedUsername)
        const user = getObjById(userFilePath, userId)
        result = `<h1>username: ${user.userName}</h1><br>
        <p>id: ${user.id}</p><br>
        <p>is admin: ${user.admin}</p>
        `
    }

    res.send(result)
}

export function editUser(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    const isAdmin = payload.split('.')[2]
    const userId = parseInt(req.params.id, 10)
    let result: string
    if(isAdmin == true || isAdmin == "true"){
        const user = getObjById(userFilePath, userId)

        if(user != null){
            let newUser = new User(user.id, req.body.login, user.admin)
            editObj(userFilePath, user.id, newUser)
            result = "Done."
        }else{
            result = "Couldn't find an user with that id."
        }

        
    }else{
        result = "You are not an admin."
    }

    res.sendStatus(204).send(result)
}