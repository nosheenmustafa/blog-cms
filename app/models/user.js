import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name:{type:String},
  email:{type:String },
  profile:{type:String},
  role:{type:String}

})
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;