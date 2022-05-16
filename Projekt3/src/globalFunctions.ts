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

// parametr to req.headers.authorization
export function authorizeJWT(bearer: string){
    const authData = bearer
    const token = authData?.split(' ')[1] ?? ''
    
    
    const payload = jwt.verify(token, secret)
    return payload
}

export function signJWT(payload: string){
    const token =  jwt.sign(payload, secret)
    return token
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




export function getObjIndexById(path: string, id: number){
    const dataInJson = readFile(path)

    if(dataInJson.length != 0){
        const dataToArray = JSON.parse(dataInJson)

        if(Array.isArray(dataToArray)){
        function searchObj(object){
            return object.id === id
        }
        
        const objectIndex = dataToArray.findIndex(searchObj)
        return objectIndex
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
            function searchObj(object){
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