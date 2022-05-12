import { Console } from 'console'
//importowanie biblioteki express (a takze Request i Response, które wskazują typy zmiennych)
import express from 'express'
import { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { Tag } from "./tagModel"
import { User } from "./userModel"
import { Note } from "./noteModel"
import * as noteEndpoints from "./noteEndpoints"
import * as tagEndpoints from "./tagEndpoints"
import * as userEndpoints from "./userEndpoints"
import { parse } from 'path'


const app = express()
//app use wskazuje ze uzywamy formatu danych .json
app.use(express.json())



// http://localhost:3000/
// {"title":"aaa","content":"aaaaa content","tags":[{"name":"firstTag"},{"name":"secondTag"},{"name":"thirdTagggg"}], "visibility":true}
// {"login":"admin135","password":"adminP"}
// {"shared":["admin130", "admin135", "admin136"]}
// npm install typescript, express, nodemon, ts-node, @types/node, @types/express, jsonwebtoken, @types/jsonwebtoken, mongoose, mongodb
// header authorization i wartosc Bearer skopiowany_token
// header content-type, wartosc application/json


/*  ============== KOD DO TOKENU ==============

const token = jwt.sign(userLogin, userPassword)
const authData = req.headers.authorization
const token = authData?.split(' ')[1] ??''
const payload = jwt.verify(token, secret)
*/

const notesArray: Note[] = []
const tagsArray: Tag[] = []
const usersArray: User[] = []


const configJson =  JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'))
const secret = configJson.secret
const dataFilePath = configJson.dataFilePath
const userFilePath = configJson.userFilePath





let password: string = ''



app.get('/', function (req: Request, res: Response) {
    res.send('GET Hello World')
})
app.post('/', function (req: Request, res: Response) {
    res.sendStatus(200).send('POST Hello World')
})

// ============== USER ENDPOINTS ==============

app.post('/login', userEndpoints.login)
app.post('/logout', userEndpoints.logut) // nie działa, nie wiem jak zrobić wylogowywanie :(
app.delete('/user/:id', userEndpoints.deleteUser)
app.get('/user', userEndpoints.getUser)
app.put('/user/:id', userEndpoints.putUser)

// ============== NOTE ENDPOINTS ==============

app.post('/note', noteEndpoints.postNote )
app.get('/note/:id', noteEndpoints.getNote )
app.get('/notes', noteEndpoints.getAllNotes)
app.put('/note/:id', noteEndpoints.putNote)
app.delete('/note/:id', noteEndpoints.deleteNote)
app.put('/share/:id', noteEndpoints.shareNote)

// ============== TAG ENDPOINTS ==============

app.post('/tag', tagEndpoints.postTag )
app.get('/tag/:id', tagEndpoints.getTag )
app.get('/tags', tagEndpoints.getAllTags)
app.put('/tag/:id', tagEndpoints.putTag)
app.delete('/tag/:id', tagEndpoints.deleteTag)


function readFileWithPromise(file: string) {
    return fs.promises.readFile(file, 'utf8')
}

function readFile(file: string) {
    return fs.readFileSync(file, 'utf8')
}

function saveFileWithPromise(storeFile: string, dataToSave: string) {

    return fs.promises.writeFile(storeFile, dataToSave);
}

function saveFile(storeFile: string, dataToSave: string){
    return fs.writeFileSync(storeFile, dataToSave)
}

export {notesArray, tagsArray, usersArray, dataFilePath, userFilePath, secret, readFileWithPromise, saveFileWithPromise, saveFile, readFile}
app.listen(3000)

