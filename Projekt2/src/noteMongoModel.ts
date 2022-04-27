import mongoose from "mongoose";
import { Tag } from "./tagModel"
import { DataStorage } from "./DataStorage"

const notesSchema = new mongoose.Schema<DataStorage>({
    title: String,
    content: String,
    createDate: String,
    tags: [Tag],
    id: Number,
    username: String,
    visibility: Boolean
}, {
    timestamps: true
})