import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { Tag } from "./tagModel"
import { Note } from "./noteModel"
import {notesArray, tagsArray,  dataFilePath, readFileWithPromise, saveFileWithPromise, saveFile, readFile} from "./index"
const app = express()
app.use(express.json())

let login: string = ''
const configJson =  JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'))
const secret = configJson.secret


export function postNote(req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    
    
    const payload = jwt.verify(token, secret)
    
    let anyLogin = (payload as any)
    login = (anyLogin as string)
    
    const date = new Date()
    const stringDate = date.toISOString()
    const generatedId = Date.now()
    const username = login

    for (let i = 0; i < req.body.tags?.length; i++) {
        let actualTag = req.body.tags[i]
        let actualTagName = actualTag.name.toLowerCase()
        if (tagsArray.some(e => e.name === actualTagName) == false) {
            let tag = new Tag(actualTagName, generatedId)
            tagsArray.push(tag)

        }
    }

    let note = new Note(req.body.title, req.body.content, req.body.tags, stringDate, generatedId, username, req.body.visibility)
    notesArray.push(note)
    
    //const dataPromise = readFileWithPromise(dataFilePath)
    //dataPromise.then(data => console.log('from promise', data))
    
    
    let dataInString
    const dataArray = []
    const dataInJson = readFile(dataFilePath)
    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson);
        dataArray.push(dataToArray)
        dataArray.push(note)
        dataInString = JSON.stringify(dataArray)
    }else{
        dataInString = JSON.stringify(note)
    }
    saveFile(dataFilePath, dataInString)
    
    
    // const dataPromise = saveFileWithPromise(dataFilePath, data)

    // dataPromise.then(data => console.log('data saved'))
    
    res.sendStatus(201)
}

export function getNote(req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    const noteId = parseInt(req.params.id, 10)
    const foundNoteIndex = notesArray.findIndex(searchNote)

    function searchNote(note: Note) {
        return note.id === noteId
    }

    const foundNote = notesArray[foundNoteIndex]
    res.send(foundNote)
}

export function getAllNotes (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)
    let anyLogin = (payload as any)
    login = (anyLogin as string)

    
    const ret = notesArray.filter(function (note) {
        if ((note.username == login) || (note.visibility == true)) {
            return note
        }
    }).map(note =>

        `<h1>title: ${note.title}</h1><br>
        <p>content: ${note.content}</p><br>
        <p>tags: ${note.tags.map(tag => tag.name + ", ").join('')}</p><br>
        <p>id: ${note.id}</p>
        <p>username: ${note.username}</p>
        <p>visible: ${note.visibility}</p>
        <p>same user as logged user: ${note.username == login}</p>

        `
    ).join('')
    
    res.send(ret)

}

export function putNote (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)
    
    const noteId = parseInt(req.params.id, 10)
    const foundNoteIndex = notesArray.findIndex(searchNote)

    function searchNote(note: Note) {
        return note.id === noteId
    }



    const generatedId = Date.now()


    for (let i = 0; i < req.body.tags.length; i++) {
        let actualTag = req.body.tags[i]
        let actualTagName = actualTag.name.toLowerCase()
        if (tagsArray.some(e => e.name === actualTagName) == false) {
            let tag = new Tag(actualTagName, generatedId)
            tagsArray.push(tag)
        }
    }

    let note = new Note(req.body.title, req.body.content, req.body.tags, notesArray[foundNoteIndex].createDate, notesArray[foundNoteIndex].id, notesArray[foundNoteIndex].username)
    let resultInfo:string = ''

    if(notesArray[foundNoteIndex].username == payload){
        notesArray[foundNoteIndex] = note
        console.log("Done.")
    }else{
        console.log("You can't edit note that doesn't belong to you.")
    }
    
    res.sendStatus(204)
}

export function deleteNote (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    const noteId = parseInt(req.params.id, 10)
    const foundNoteIndex = notesArray.findIndex(searchNote)

    function searchNote(note: Note) {
        return note.id === noteId
    }

    notesArray.splice(foundNoteIndex, 1)

    res.sendStatus(204)
}
