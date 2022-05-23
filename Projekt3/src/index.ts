import { Console } from 'console'
import express from 'express'
import { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import * as UserEndpoints from "./endpoints/UserEndpoints"
import * as GroupEndpoints from "./endpoints/GroupEndpoints"
import * as DepartmentEndpoints from "./endpoints/DepartmentEndpoints"
import * as CourseEndpoints from "./endpoints/CourseEndpoints"
import * as EmployeeEndpoints from "./endpoints/EmployeeEndpoints"

const app = express()
app.use(express.json())

// http://localhost:3000/
// npm install typescript, express, nodemon, ts-node, @types/node, @types/express, jsonwebtoken, @types/jsonwebtoken, mongoose, mongodb
// header authorization i wartosc Bearer skopiowany_token
// header content-type, wartosc application/json

// typowe posty do skopiowania
// user:
// {"login":"admin","password":"password1", "admin":true}
// {"login":"user1","password":"password1", "admin":false}
// {"login":"user2","password":"password1"}
//
// department:
// {"departmentName":"department1", "adress":"gdziekolwiek", "description":"abc"}
//
// course:
// {"courseName":"course1", "points":1}
//
// group:
// {"groupName":"group1"}
//
// employee:
// {"name":"Arthas", "surname":"Menethil", "group":"group1", "phone":"123456789", "department":"department1", "course":["course1", "course2"]}


//TODO

// 4. usunięcie departamentu usuwa także ten departament u każdego pracownika będącego w niej.
// 5. edycja nazwy grupy zmienia nazwę także u pracowników
// 7. usunięcie grupy możliwe tylko, jeśli nie posiada on pracowników. 
// 8. zmiana departamentu edytuje też departament u pracowników, którzy w nim byli
// 9. edycja nazwy szkolenia zmienia nazwę danego szkolenia u pracowników

// 12. raporty

// 14.

const configJson =  JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'))
const secret = configJson.secret
const employeeFilePath = configJson.employeePath
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

// ============== GROUP ENDPOINTS ==============

app.post('/group', GroupEndpoints.createGroup)
app.delete('/group/:id', GroupEndpoints.deleteGroup)
app.get('/group', GroupEndpoints.getGroup)
app.put('/group/:id', GroupEndpoints.editGroup) 

// ============== DEPARTMENT ENDPOINTS ==============

app.post('/department', DepartmentEndpoints.createDepartment)
app.delete('/department/:id', DepartmentEndpoints.deleteDepartment)
app.get('/department', DepartmentEndpoints.getDepartment)
app.put('/department/:id', DepartmentEndpoints.editDepartment) 

// ============== COURSE ENDPOINTS ==============

app.post('/course', CourseEndpoints.createCourse)
app.delete('/course/:id', CourseEndpoints.deleteCourse)
app.get('/course', CourseEndpoints.getCourse)
app.put('/course/:id', CourseEndpoints.editCourse) 

// ============== EMPLOYEE ENDPOINTS ==============

app.post('/employee', EmployeeEndpoints.createEmployee)
app.delete('/employee/:id', EmployeeEndpoints.deleteEmployee)
app.get('/employee', EmployeeEndpoints.getEmployee)
app.put('/employee/:id', EmployeeEndpoints.editEmployee) 



app.listen(3000)