import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import fs from 'fs'
import {userFilePath, secret} from "../index"
import {signJWT} from "../globalFunctions"

export function login(req: Request, res: Response) {
    let userLogin: string
    let userPassword: string
    userLogin = req.body.login
    userPassword = req.body.password
    const createdPayload = userLogin + '.' + userPassword
    
    const token = signJWT(createdPayload);
    
    // tu skonczylem
    
    
    
    // const token = jwt.sign(userLogin, secret)
    // password = userPassword
    // const generatedId = Date.now()

    // let user = new User(req.body.login, generatedId, req.body.admin)
    // usersArray.push(user)

    // let dataInString
    // const dataArray = []
    // const dataInJson = readFile(userFilePath)

    // if(dataInJson.length != 0){
    //     const dataToArray = JSON.parse(dataInJson);
    //     if(Array.isArray(dataToArray)){

    //         for (var i=0;i<dataToArray.length;i++) {
    //              dataArray.push(dataToArray[i])
    //         }
    //         dataArray.push(user)
            
    //     }else{
    //         dataArray.push(dataToArray, user)
    //         dataInString = JSON.stringify(dataArray)
            
    //     }
    //     dataInString = JSON.stringify(dataArray)
    // }else{
    //     dataInString = JSON.stringify(user)
    // }

    // saveFile(userFilePath, dataInString)
    // res.status(201).send(token)
}