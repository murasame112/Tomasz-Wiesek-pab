import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { Tag } from "./tagModel"
import { Note } from "./noteModel"
import { User } from "./userModel"
import {notesArray, tagsArray, usersArray, dataFilePath, userFilePath, secret, readFileWithPromise, saveFileWithPromise, saveFile, readFile} from "./index"
const app = express()
app.use(express.json())


let password: string = ''



export function login(req: Request, res: Response) {
    let userLogin: string
    let userPassword: string
    userLogin = req.body.login
    userPassword = req.body.password
    const token = jwt.sign(userLogin, secret)
    password = userPassword
    const generatedId = Date.now()

    let user = new User(req.body.login, generatedId, req.body.admin)
    usersArray.push(user)

    let dataInString
    const dataArray = []
    const dataInJson = readFile(userFilePath)

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson);
        if(Array.isArray(dataToArray)){

            for (var i=0;i<dataToArray.length;i++) {
                 dataArray.push(dataToArray[i])
            }
            dataArray.push(user)
            
        }else{
            dataArray.push(dataToArray, user)
            dataInString = JSON.stringify(dataArray)
            
        }
        dataInString = JSON.stringify(dataArray)
    }else{
        dataInString = JSON.stringify(user)
    }

    saveFile(userFilePath, dataInString)
    res.status(201).send(token)
}

export function logut(req: Request, res: Response){
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    res.status(201)
}

export function deleteUser(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)
    const userId = parseInt(req.params.id, 10)
    
    
    function searchUser(user: User){
        return user.id === userId
    }
    const activeUserIndex = usersArray.findIndex(searchUser)
   

   

    
    
         
        const dataInJson = readFile(dataFilePath)

        if(dataInJson.length != 0){
        const noteData = JSON.parse(dataInJson);
        if(Array.isArray(noteData)){
            const forIter = noteData.length
            for (var i=0;i<forIter;i++) {
                
                if(noteData[i].username == usersArray[activeUserIndex].username){
                    
                    console.log("-usunieto")
                    const noteId = noteData[i].id
                    function searchNote(note: Note) {
                        return note.id === noteId
                    }
                    const foundNoteIndex = notesArray.findIndex(searchNote)
                    notesArray.splice(foundNoteIndex, 1)
                }
               
            }
            
            
        }else{
            if(noteData.username == usersArray[activeUserIndex].username){
                    const noteId = noteData.id
                    function searchNote(note: Note) {
                        return note.id === noteId
                    }
                    const foundNoteIndex = notesArray.findIndex(searchNote)
                    notesArray.splice(foundNoteIndex, 1)
                }
        }
    }
    

    usersArray.splice(activeUserIndex, 1)

    res.sendStatus(204)
}

export function getUser(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)
    function searchUser(user: User){
        return user.username === payload
    }
    const activeUserIndex = usersArray.findIndex(searchUser)
    
    let ret= "."
    if(usersArray[activeUserIndex].admin == true){
    
    ret = usersArray.map(user =>
        `<h1>username: ${user.username}</h1><br>
        <p>id: ${user.id}</p><br>
        <p>is admin: ${user.admin}</p>
        `
    ).join('')}
    else{
        ret = 
            `<h1>username: ${usersArray[activeUserIndex].username}</h1><br>
            <p>id: ${usersArray[activeUserIndex].id}</p><br>
            <p>is admin: ${usersArray[activeUserIndex].admin}</p>
            `
        
    }
    
    res.send(ret)
}

export function putUser(req: Request, res: Response){
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)
        
    const userId = parseInt(req.params.id, 10)
    
    const activeUserIndex = usersArray.findIndex(searchUser)
        
    
    
    function searchUser(user: User){
        return user.username === payload
    }
    
    const loggedUsername = usersArray[activeUserIndex].username
    
    let user = new User(req.body.username, usersArray[activeUserIndex].id, usersArray[activeUserIndex].admin)
        
    
        if(usersArray[activeUserIndex].id == userId || usersArray[activeUserIndex].admin == true){
            usersArray[activeUserIndex] = user
            const token = jwt.sign(usersArray[activeUserIndex].username, secret)
            console.log("Done.")
        }else{
            console.log("You can't edit note that doesn't belong to you.")
        }
        
        res.sendStatus(204).send(token)
}