//importowanie biblioteki express (a takze Request i Response, które wskazują typy zmiennych)
import express from 'express'
import {Request, Response} from 'express'

const app = express()

//app use wskazuje ze uzywamy formatu danych .json
app.use(express.json())
/*
type Note = {
    title: string
    content: string
    createDate?: string
    tags?: string[]
    id?: number
}
*/


class Note{
    title: string
    content: string
    createDate?: string
    //tags?: string[]
    id?: number

    constructor(title: string, content: string, createDate?: string, /*tags?: string[],*/ id?: number) {
        this.title = title
        this.content = content
        this.createDate = createDate
        //this.tags = tags
        this.id = id
    }
}

const notesArray: Note[] = []


app.get('/', function (req: Request, res: Response) {
  res.send('GET Hello World')
})
app.post('/', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 
  res.sendStatus(200).send('POST Hello World')
})


app.post('/note', function (req: Request, res: Response){
    
    
    const date = new Date()
    const stringDate = date.toISOString()
    const generatedId = Date.now()

    let note = new Note(req.body.title, req.body.content, stringDate, generatedId )

    console.log(note.title)
    console.log(note.content)
    console.log(note.id)
    notesArray.push(note)
    res.sendStatus(201)
})

app.get('/note/:id', function(req: Request, res: Response){
    
    const noteId = parseInt(req.params.id, 10)
    const foundNoteIndex = notesArray.findIndex(searchNote)
    // predykat - funkcja przeszukująca tablicę
    function searchNote(note: Note) {
        return note.id === noteId
    }
    
    const foundNote = notesArray[foundNoteIndex]
    res.send(foundNote)
})

app.get('/notes', function(req: Request, res: Response){
    

    
    res.send(notesArray.map(note =>
        `<h1>${note.title}</h1><br>
        <p>${note.content}</p><br>
        <p>${note.id}</p>
        `
      ).join(''))
})

app.put('/note/:id', function(req: Request, res: Response){
    
    const noteId = parseInt(req.params.id, 10)
    const foundNoteIndex = notesArray.findIndex(searchNote)
    // predykat - funkcja przeszukująca tablicę
    function searchNote(note: Note) {
        return note.id === noteId
    }
    
    
    const date = new Date()
    const stringDate = date.toISOString()
    const generatedId = Date.now()

    let note = new Note(req.body.title, req.body.content, stringDate, generatedId )
    notesArray[foundNoteIndex] = note
    res.sendStatus(204)
})

app.delete('/note/:id', function(req: Request, res: Response){
    
    const noteId = parseInt(req.params.id, 10)
    const foundNoteIndex = notesArray.findIndex(searchNote)
    // predykat - funkcja przeszukująca tablicę
    function searchNote(note: Note) {
        return note.id === noteId
    }
    
    notesArray.splice(foundNoteIndex,1)
    
    res.sendStatus(204)
})



app.listen(3000)