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

export function authorizeJWT(bearer){
    const authData = bearer
    const token = authData?.split(' ')[1] ?? ''
    
    
    const payload = jwt.verify(token, secret)
    return payload
}

export function signJWT(payload){
    const token =  jwt.sign(payload, secret)
    return token
}