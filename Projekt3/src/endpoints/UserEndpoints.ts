import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import fs from 'fs'
import {User} from "../models/UserModel"
import {userFilePath} from "../index"
import {signJWT, readFile, saveFile, addObjToFile, authorizeJWT} from "../globalFunctions"

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

}

export function editUser(req: Request, res: Response){

}