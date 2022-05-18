// tu sa ogolne funkcje, ktorych uzywam wiele razy w roznych plikach, jak np czytanie z pliku
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { secret } from "./index"

export function readFile(file: string) {
    return fs.readFileSync(file, 'utf8')
}

export function saveFile(storeFile: string, dataToSave: string){
    return fs.writeFileSync(storeFile, dataToSave)
}

export function checkIfUsernameExists(username: string, path: string){
    const dataInJson = readFile(path)
    let dataInString: string
    

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson)

        if(Array.isArray(dataToArray)){

            if(dataToArray.some(u => u.userName === username)){
                return true
            }
        }else{         
            if(dataToArray.userName === username){
                return true
            }       
        }      
    }
    return false
}

export function checkIfGroupExists(groupName: string, path: string){
    const dataInJson = readFile(path)
    let dataInString: string
    

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson)

        if(Array.isArray(dataToArray)){

            if(dataToArray.some(g => g.groupName === groupName)){
                return true
            }
        }else{         
            if(dataToArray.groupName === groupName){
                return true
            }       
        }      
    }
    return false
}

export function checkIfEmployeeExists(groupName: string, path: string){
    const dataInJson = readFile(path)
    let dataInString: string
    

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson)

        if(Array.isArray(dataToArray)){

            if(dataToArray.some(g => g.groupName === groupName)){
                return true
            }
        }else{         
            if(dataToArray.groupName === groupName){
                return true
            }       
        }      
    }
    return false
}

export function checkIfDepartmentExists(departmentName: string, departmentAdress: string, path: string){
    const dataInJson = readFile(path)
    let dataInString: string
    

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson)

        if(Array.isArray(dataToArray)){

            if((dataToArray.some(d => d.departmentName === departmentName)) && (dataToArray.some(d => d.adres === departmentAdress))){
                return true
            }
        }else{         
            if(dataToArray.departmentName === departmentName && dataToArray.adress === departmentAdress){
                return true
            }       
        }      
    }
    return false
}

export function checkIfCourseExists(courseName: string, path: string){
    const dataInJson = readFile(path)
    let dataInString: string
    

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson)

        if(Array.isArray(dataToArray)){

            if(dataToArray.some(c => c.courseName === courseName)){
                return true
            }
        }else{         
            if(dataToArray.courseName === courseName){
                return true
            }       
        }      
    }
    return false
}

export function addObjToFile(obj: object, path: string){
    
    let dataInString
    const dataArray = []
    const dataInJson = readFile(path)

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson);
        if(Array.isArray(dataToArray)){

            for (var i=0;i<dataToArray.length;i++) {
                 dataArray.push(dataToArray[i])
            }
            dataArray.push(obj)
            
        }else{
            dataArray.push(dataToArray, obj)
            dataInString = JSON.stringify(dataArray)
            
        }
        dataInString = JSON.stringify(dataArray)
    }else{
        dataInString = JSON.stringify(obj)
    }

    saveFile(path, dataInString)
}

export function getObjById(path: string, id: number){
    const dataInJson = readFile(path)

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson)

        if(Array.isArray(dataToArray)){
            function searchObj(object: any){
                return object.id === id
            }
            
            const objectIndex = dataToArray.findIndex(searchObj)        
            return dataToArray[objectIndex]
        }else{
            return dataToArray
        }      
    }else{
        return null
    }

}

export function getAllObjs(path: string){
    const dataInJson = readFile(path)

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson)
        return dataToArray
            
    }else{
        return null
    }
}

export function getLoggedId(path: string, loggedUsername: string){
    const dataInJson = readFile(path)
    let dataInString: string
    

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson)

        if(Array.isArray(dataToArray)){
        function searchObj(object: any){
            return object.userName === loggedUsername
        }
        
        const objectIndex = dataToArray.findIndex(searchObj)
        
        
            return dataToArray[objectIndex].id
        }else{
            
            if(dataToArray.userName == loggedUsername){
                return dataToArray.id
            }else{
                return null
            }           
        }      
    }else{
        return null
    }
}



export function deleteObjById(path: string, id: number){
    const dataInJson = readFile(path)
    let dataInString: string
    let result: string

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson)

        if(Array.isArray(dataToArray)){
            function searchObj(object: any){
                return object.id === id
            }
        
            const objectIndex = dataToArray.findIndex(searchObj)
            dataToArray.splice(objectIndex, 1)
            dataInString = JSON.stringify(dataToArray)
            saveFile(path, dataInString)
            result = 'Record deleted.'
            return result
        }else{
            dataInString = ''
            saveFile(path, dataInString)
            result = 'Record deleted.'
            return result
            }
    }else{
        result = 'File is empty'
        return result
    }
}

export function editObj(path: string, oldId: number, newObj: any){

    const dataInJson = readFile(path)
    let dataInString: string
    let result: string

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson)

        if(Array.isArray(dataToArray)){
            function searchObj(object: any){
                return object.id === oldId
            }
        
            const oldObjectIndex = dataToArray.findIndex(searchObj)
            dataToArray[oldObjectIndex] = newObj
            dataInString = JSON.stringify(dataToArray)
            saveFile(path, dataInString)
            result = 'Record edited.'
            return result
        }else{
            dataInString = JSON.stringify(newObj)
            saveFile(path, dataInString)
            result = 'Record edited.'
            return result
            }
    }else{
        result = 'File is empty'
        return result
    }
}