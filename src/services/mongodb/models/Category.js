import mongoose from 'mongoose'
const CategorySchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})
const Category=mongoose.model("Category",CategorySchema)
export default Category