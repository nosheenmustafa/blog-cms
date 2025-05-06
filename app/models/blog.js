import mongoose from "mongoose";
const blogSchema = new mongoose.Schema({
   
  title:{type:String, required:true},
  image:{type:String},
  category:{type:String, required:true},
  author:{type:String},
  description:{type:String},
  image:{type:String},
  createdAt:{type:Date, default:Date.now},
  likes:{type: Number},
  dislikes:{type:Number},
  imagePublicId: String, // this is line will used when we want to integrate our api using cloundinary
  


 
})
const Blog = mongoose.models.Blog || mongoose.model("Blog",blogSchema);
export default Blog;