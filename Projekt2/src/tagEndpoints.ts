import { Console } from 'console'
import express from 'express'
import { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { Tag } from "./tagModel"
import { Note } from "./noteModel"
import {tagsArray,  dataFilePath, readFileWithPromise, saveFileWithPromise} from "./index"
const app = express()
app.use(express.json())

let login: string = ''
const configJson =  JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'))
const secret = configJson.secret

export function postTag (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)


    const generatedId = Date.now()
    const newTagName = req.body.name.toLowerCase()
    if (tagsArray.some(e => e.name === newTagName) == false) {
        let tag = new Tag(newTagName, generatedId)
        console.log(tag.name)
        console.log(tag.id)
        tagsArray.push(tag)
    }

    res.sendStatus(201)
}
export function getTag (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)



    const tagId = parseInt(req.params.id, 10)
    const foundTagIndex = tagsArray.findIndex(searchTag)

    function searchTag(tag: Tag) {
        return tag.id === tagId
    }

    const foundTag = tagsArray[foundTagIndex]
    res.send(foundTag)
}
export function getAllTags (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)



    res.send(tagsArray.map(tag =>
        `<h1>${tag.name}</h1><br>
        <p>${tag.id}</p>
        `
    ).join(''))
}

export function putTag (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)



    const tagId = parseInt(req.params.id, 10)
    const foundTagIndex = tagsArray.findIndex(searchTag)

    function searchTag(tag: Tag) {
        return tag.id === tagId
    }

    const generatedId = Date.now()
    let tag = new Tag(req.body.naem, generatedId)
    tagsArray[foundTagIndex] = tag
    res.sendStatus(204)
}

export function deleteTag (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)



    const tagId = parseInt(req.params.id, 10)
    const foundTagIndex = tagsArray.findIndex(searchTag)

    function searchTag(tag: Tag) {
        return tag.id === tagId
    }

    tagsArray.splice(foundTagIndex, 1)

    res.sendStatus(204)
}