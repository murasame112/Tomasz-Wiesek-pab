import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import fs from 'fs'
import {User} from "../models/UserModel"
import {userFilePath} from "../index"
import {signJWT, readFile, saveFile, addObjToFile, authorizeJWT, getObjIndexById, deleteObjById} from "../globalFunctions"

export function login(req: Request, res: Response) {

    let userLogin: string
    let userPassword: string
    userLogin = req.body.login
    userPassword = req.body.password
    const createdPayload = userLogin + '.' + userPassword
    
    const token = signJWT(createdPayload);
        
    const generatedId = Date.now()
    let user = new User(generatedId, userLogin, req.body.admin)
    
    addObjToFile(user, userFilePath)

   
    res.status(201).send(token)
}

export function deleteUser(req: Request, res: Response){
    authorizeJWT(req.headers.authorization)

    let deleteResult: string
    const userId = parseInt(req.params.id, 10)
    deleteResult = deleteObjById(userFilePath, userId)

    res.sendStatus(204).send(deleteResult)
}

export function getUser(req: Request, res: Response){

}

export function editUser(req: Request, res: Response){

}