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