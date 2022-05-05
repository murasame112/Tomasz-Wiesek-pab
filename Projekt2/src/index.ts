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


const app = express()
//app use wskazuje ze uzywamy formatu danych .json
app.use(express.json())



// http://localhost:3000/
// {"title":"aaa","content":"aaaaa content","tags":[{"name":"firstTag"},{"name":"secondTag"},{"name":"thirdTagggg"}], "visibility":true}
// {"login":"admin135","password":"adminP"}
// npm install  typescript, express, nodemon, ts-node, @types/node, @types/express, jsonwebtoken, @types/jsonwebtoken, mongoose, mongodb
// header authorization i wartosc Bearer skopiowany_token
// header content-type, wartosc application/json




// 2 edytowac notatke po id mozna tylko, jesli payload sie zgadza z username
//      - admin moze edytowac kazda notatke
// 3 admin moze usunąć konto
//      - usunięcie konta usuwa wszystkie notatki
// 4 admin moze pobrac liste uzytkownikow
// 5 uzytkownik moze pobrac dane uzytkownika (dla wlasnego konta)
//      - admin moze dla wszystkich
// 6 wylogowywanie przez uniewaznienie tokenu
// 7 udostepnianie notatek wybranemu uzytkownikowi przez podanie loginu/loginow wspolpracownikow

/*
kod do tokenu

const token = jwt.sign(userLogin, userPassword)

const authData = req.headers.authorization
const token = authData?.split(' ')[1] ??''
const payload = jwt.verify(token, secret)
*/

const notesArray: Note[] = []
const tagsArray: Tag[] = []


const configJson =  JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'))
const secret = configJson.secret
const dataFilePath = configJson.dataFilePath
const userFilePath = configJson.userFilePath





let password: string = ''

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
    const token = jwt.sign(userLogin, secret)
    password = userPassword
    const generatedId = Date.now()

    let user = new User(req.body.login, token, generatedId, req.body.admin)

    let dataInString
    const dataArray = []
    const dataInJson = readFile(userFilePath)
    if(dataInJson.length != 0){
    const dataToArray = JSON.parse(dataInJson);
    dataArray.push(dataToArray)
    dataArray.push(user)
    dataInString = JSON.stringify(dataArray)
    }else{
    dataInString = JSON.stringify(user)
    }
    saveFile(userFilePath, dataInString)

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


export {notesArray, tagsArray, dataFilePath, readFileWithPromise, saveFileWithPromise, saveFile, readFile}
app.listen(3000)