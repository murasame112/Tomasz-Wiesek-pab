//importowanie biblioteki express (a takze Request i Response, które wskazują typy zmiennych)
import express from 'express'
import {Request, Response} from 'express'

const app = express()

//app use wskazuje ze uzywamy formatu danych .json
app.use(express.json())

type Note = {
    title: string
    content: string
    createDate?: string
    tags?: string[]
    id?: number
}

const notesArray: any[] = []

app.get('/', function (req: Request, res: Response) {
  res.send('GET Hello World')
})
app.post('/', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 
  res.sendStatus(200).send('POST Hello World')
})


app.post('/note', function (req: Request, res: Response){
    console.log(req.body)
    const date = new Date()
    date.toISOString()
    req.body.createDate = date
    //req.body.id = Date.now()
    
    const note: Note = {
        title: req.body.title,
        content: req.body.content,
        createDate: req.body.createDate,
        id: req.body.id
        
    }

    /*let newNote = {
        title: req.body.title,
        content: req.body.content,
        createDate: req.body.createDate,
        id: req.body.id
    }*/

    
    notesArray.push(note)
    res.sendStatus(200).send('POST Hello World')
})

app.get('/note/:id', function(req: Request, res: Response){
    
    let noteId = parseInt(req.params.id, 10)
    
    let foundNote = notesArray.findIndex(note => note.id === noteId)
    res.send(foundNote)
})

app.listen(3000)