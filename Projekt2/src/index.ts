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
import { parse } from 'path'


const app = express()
//app use wskazuje ze uzywamy formatu danych .json
app.use(express.json())



// http://localhost:3000/
// {"title":"aaa","content":"aaaaa content","tags":[{"name":"firstTag"},{"name":"secondTag"},{"name":"thirdTagggg"}], "visibility":true}
// {"login":"admin135","password":"adminP"}
// npm install  typescript, express, nodemon, ts-node, @types/node, @types/express, jsonwebtoken, @types/jsonwebtoken, mongoose, mongodb
// header authorization i wartosc Bearer skopiowany_token
// header content-type, wartosc application/json



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
const usersArray: User[] = []


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

// ============== USER ENDPOINTS ==============

app.post('/login', function (req: Request, res: Response) {
    
    let userLogin: string
    let userPassword: string
    userLogin = req.body.login
    userPassword = req.body.password
    const token = jwt.sign(userLogin, secret)
    password = userPassword
    const generatedId = Date.now()

    let user = new User(req.body.login, token, generatedId, req.body.admin)
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
})

app.delete('/deleteUser/:id', function (req: Request, res: Response) {
    
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
})

app.get('/user', function (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, secret)

    const activeUserIndex = usersArray.findIndex(searchUser)
    function searchUser(user: User){
        return user.username === payload
    }
    let ret= "."
    if(usersArray[activeUserIndex].admin == true){
    
    ret = usersArray.map(user =>
        `<h1>username: ${user.username}</h1><br>
        <p>id: ${user.id}</p><br>
        <p>is admin: ${user.admin}</p>
        <p>token: ${user.userToken}</p>
        `
    ).join('')}
    else{
        ret = 
            `<h1>username: ${usersArray[activeUserIndex].username}</h1><br>
            <p>id: ${usersArray[activeUserIndex].id}</p><br>
            <p>is admin: ${usersArray[activeUserIndex].admin}</p>
            <p>token: ${usersArray[activeUserIndex].userToken}</p>
            `
        
    }
    
    res.send(ret)
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


export {notesArray, tagsArray, usersArray, dataFilePath, readFileWithPromise, saveFileWithPromise, saveFile, readFile}
app.listen(3000)