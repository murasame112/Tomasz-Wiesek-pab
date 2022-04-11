import { Console } from 'console'
//importowanie biblioteki express (a takze Request i Response, które wskazują typy zmiennych)
import express from 'express'
import { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
const app = express()
//app use wskazuje ze uzywamy formatu danych .json
app.use(express.json())
class Tag {

    name: string
    id?: number
    constructor(name: string, id?: number) {
        this.name = name
        this.id = id
    }
}
class Note {
    title: string
    content: string
    createDate?: string
    tags: Tag[]
    id?: number
    username?: string
    visibility?: boolean
    // private = false, public = true

    constructor(title: string, content: string, tags: Tag[], createDate?: string, id?: number, username?: string, visibility?: boolean) {
        this.title = title
        this.content = content
        this.createDate = createDate
        this.tags = tags
        this.id = id
        this.username = username
        if (visibility == null) {
            this.visibility = false
        } else {
            this.visibility = visibility
        }
    }
}
// {"title":"aaa","content":"aaaaa content","tags":[{"name":"firstTag"},{"name":"secondTag"},{"name":"thirdTagggg"}], "visibility":"true"}
// {"login":"admin135","password":"adminP"}
// npm install  typescript, express, nodemon, ts-node, @types/node, @types/express, jsonwebtoken, @types/jsonwebtoken

// domyslnie notatki prywante, uzytkownik widzi tylko swoje notatki
// mozliwosc dodania publicznej notatki


// header authorization i wartosc Bearer skopiowany_token

// osobne pliki na modele
// osobne pliki na osobne endpointy - jeden na notes, jeden na tags itp
// moge skorzystac z routingu wbudowanego w express, lub po prostu zrobic samemu (lepiej samemu, ale jakby mi braklo czasu)

/*
kod do tokenu

const token = jwt.sign(userLogin, userPassword)

const authData = req.headers.authorization
const token = authData?.split(' ')[1] ??''
const payload = jwt.verify(token, secret)
*/

// W VISIBILITY ZMIENIA MI BOOLEAN NA STRINGA I DLATEGO NIE DZIALA

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
    console.log(req.body) // e.x. req.body.title 
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


app.post('/note', function (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, password)
    let anyLogin = (payload as any)
    login = (anyLogin as string)
    console.log("user: " + login)
    const date = new Date()
    const stringDate = date.toISOString()
    const generatedId = Date.now()
    const username = login

    for (let i = 0; i < req.body.tags.length; i++) {
        let actualTag = req.body.tags[i]
        let actualTagName = actualTag.name.toLowerCase()
        if (tagsArray.some(e => e.name === actualTagName) == false) {
            let tag = new Tag(actualTagName, generatedId)
            tagsArray.push(tag)

        }
    }




    let note = new Note(req.body.title, req.body.content, req.body.tags, stringDate, generatedId, username, req.body.visibility)
    console.log(req.body)


    notesArray.push(note)

    //const data = JSON.stringify(req.body)
    //const dataPromise = saveFileWithPromise(filePath, data)


    //dataPromise.then(data => console.log('data saved'))

    console.log("id: " + generatedId)
    res.sendStatus(201)
})

app.get('/note/:id', function (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, password)

    const noteId = parseInt(req.params.id, 10)
    const foundNoteIndex = notesArray.findIndex(searchNote)

    function searchNote(note: Note) {
        return note.id === noteId
    }

    const foundNote = notesArray[foundNoteIndex]
    res.send(foundNote)
})

app.get('/notes', function (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, password)
    let anyLogin = (payload as any)
    login = (anyLogin as string)

    //const dataPromise = readFileWithPromise(filePath)
    //dataPromise.then(data => console.log('from promise', data))

    

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

    /*res.send(
        
        notesArray.map(note =>
        `<h1>title: ${note.title}</h1><br>
        <p>content: ${note.content}</p><br>
        <p>tags: ${note.tags.map(tag => tag.name+", ").join('')}</p><br>
        <p>id: ${note.id}</p>
        <p>username: ${note.username}</p>
        <p>visible: ${note.visibility}</p>
        `
      ).join(''))*/
})
app.put('/note/:id', function (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, password)

    const noteId = parseInt(req.params.id, 10)
    const foundNoteIndex = notesArray.findIndex(searchNote)

    function searchNote(note: Note) {
        return note.id === noteId
    }


    const date = new Date()
    const stringDate = date.toISOString()
    const generatedId = Date.now()
    const username = login

    for (let i = 0; i < req.body.tags.length; i++) {
        let actualTag = req.body.tags[i]
        let actualTagName = actualTag.name.toLowerCase()
        console.log(actualTagName)
        if (tagsArray.some(e => e.name === actualTagName) == false) {
            let tag = new Tag(actualTagName, generatedId)
            tagsArray.push(tag)
        }
    }

    let note = new Note(req.body.title, req.body.content, req.body.tags, stringDate, generatedId, username)
    notesArray[foundNoteIndex] = note
    res.sendStatus(204)
})
app.delete('/note/:id', function (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, password)

    const noteId = parseInt(req.params.id, 10)
    const foundNoteIndex = notesArray.findIndex(searchNote)

    function searchNote(note: Note) {
        return note.id === noteId
    }

    notesArray.splice(foundNoteIndex, 1)

    res.sendStatus(204)
})

// ============== TAG ENDPOINTS ==============

app.post('/tag', function (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, password)


    const generatedId = Date.now()
    const newTagName = req.body.name.toLowerCase()
    if (tagsArray.some(e => e.name === newTagName) == false) {
        let tag = new Tag(newTagName, generatedId)
        console.log(tag.name)
        console.log(tag.id)
        tagsArray.push(tag)
    }

    res.sendStatus(201)
})
app.get('/tag/:id', function (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, password)



    const tagId = parseInt(req.params.id, 10)
    const foundTagIndex = tagsArray.findIndex(searchTag)

    function searchTag(tag: Tag) {
        return tag.id === tagId
    }

    const foundTag = tagsArray[foundTagIndex]
    res.send(foundTag)
})
app.get('/tags', function (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, password)



    res.send(tagsArray.map(tag =>
        `<h1>${tag.name}</h1><br>
        <p>${tag.id}</p>
        `
    ).join(''))
})
app.put('/tag/:id', function (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, password)



    const tagId = parseInt(req.params.id, 10)
    const foundTagIndex = tagsArray.findIndex(searchTag)

    function searchTag(tag: Tag) {
        return tag.id === tagId
    }

    const generatedId = Date.now()
    let tag = new Tag(req.body.naem, generatedId)
    tagsArray[foundTagIndex] = tag
    res.sendStatus(204)
})
app.delete('/tag/:id', function (req: Request, res: Response) {
    const authData = req.headers.authorization
    const token = authData?.split(' ')[1] ?? ''
    const payload = jwt.verify(token, password)



    const tagId = parseInt(req.params.id, 10)
    const foundTagIndex = tagsArray.findIndex(searchTag)

    function searchTag(tag: Tag) {
        return tag.id === tagId
    }

    tagsArray.splice(foundTagIndex, 1)

    res.sendStatus(204)
})
app.listen(3000)