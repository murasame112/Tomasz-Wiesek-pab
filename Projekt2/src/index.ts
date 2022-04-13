import { Console } from 'console'
//importowanie biblioteki express (a takze Request i Response, które wskazują typy zmiennych)
import express from 'express'
import { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'

import { Tag } from "./tagModel"
import { Note } from "./noteModel"
import * as noteEndpoints from "./noteEndpoints"
import * as tagEndpoints from "./tagEndpoints"

const config =  fs.readFileSync(__dirname + '/config.json')
const app = express()
//app use wskazuje ze uzywamy formatu danych .json
app.use(express.json())



// {"title":"aaa","content":"aaaaa content","tags":[{"name":"firstTag"},{"name":"secondTag"},{"name":"thirdTagggg"}], "visibility":true}
// {"login":"admin135","password":"adminP"}
// npm install  typescript, express, nodemon, ts-node, @types/node, @types/express, jsonwebtoken, @types/jsonwebtoken
// header authorization i wartosc Bearer skopiowany_token


/*
kod do tokenu

const token = jwt.sign(userLogin, userPassword)

const authData = req.headers.authorization
const token = authData?.split(' ')[1] ??''
const payload = jwt.verify(token, secret)
*/

const notesArray: Note[] = []
const tagsArray: Tag[] = []
const filePath = 'src/data.json'


let login: string = ''
let password: string = ''

function readFileWithPromise(file: string) {
    return fs.promises.readFile(file, 'utf8')
}

function saveFileWithPromise(storeFile: string, dataToSave: string) {

    return fs.promises.writeFile(storeFile, dataToSave);
}

app.get('/', function (req: Request, res: Response) {
    res.send('GET Hello World')
})
app.post('/', function (req: Request, res: Response) {
    res.sendStatus(200).send('POST Hello World')
})

// ============== LOGIN ENDPOINTS ==============

app.post('/login', function (req: Request, res: Response) {
    let userLogin: string
    let userPassword: string

    userLogin = req.body.login
    userPassword = req.body.password
    const token = jwt.sign(userLogin, userPassword)

    password = userPassword
    res.status(201).send(token)
})

// ============== NOTE ENDPOINTS ==============

app.post('/note', noteEndpoints.postNote )
app.get('/note/:id', noteEndpoints.getNote )
app.get('/notes', noteEndpoints.getAllNotes)
app.put('/note/:id', noteEndpoints.putNote)
app.delete('/note/:id', noteEndpoints.deleteNote)

// ============== TAG ENDPOINTS ==============

app.post('/tag', tagEndpoints.postTag )
app.get('/tag/:id', tagEndpoints.getTag )
app.get('/tags', tagEndpoints.getAllTags)
app.put('/tag/:id', tagEndpoints.putTag)
app.delete('/tag/:id', tagEndpoints.deleteTag)


export {notesArray, tagsArray, filePath, login, password, readFileWithPromise, saveFileWithPromise}
app.listen(3000)