import { Console } from 'console'
import express from 'express'
import { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import * as UserEndpoints from "./endpoints/UserEndpoints"

const app = express()
app.use(express.json())

// http://localhost:3000/
// npm install typescript, express, nodemon, ts-node, @types/node, @types/express, jsonwebtoken, @types/jsonwebtoken, mongoose, mongodb
// header authorization i wartosc Bearer skopiowany_token
// header content-type, wartosc application/json

// typowe posty do skopiowania
// user: (one sa juz dodane)
// {"login":"admin","password":"password1", "admin":true}
// {"login":"user1","password":"password1", "admin":false}
// {"login":"user2","password":"password1"}

//TODO

// 3. nie mozna utworzyc uzytkownika z istniejacym juz username

const configJson =  JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'))
const secret = configJson.secret
const employeeFilePath = configJson.employeeData
const userFilePath = configJson.userPath
const departmentFilePath = configJson.departmentPath
const courseFilePath = configJson.coursePath
const groupFilePath = configJson.groupPath

export {employeeFilePath, userFilePath, departmentFilePath, courseFilePath, groupFilePath, secret}


// ============== USER ENDPOINTS ==============

app.post('/login', UserEndpoints.login)
app.delete('/user/:id', UserEndpoints.deleteUser)
app.get('/user', UserEndpoints.getUser)
app.put('/user/:id', UserEndpoints.editUser) 



app.listen(3000)