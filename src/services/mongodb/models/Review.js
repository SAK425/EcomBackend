import mongoose from 'mongoose'
const ReviewSchema = new mongoose.Schema({
    authorname:{
        type:String,
        required:true
    },
    review:{
        type:String,
        required:true
    }
})
const Review=mongoose.model("Review",ReviewSchema)
export default Review