import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
         unique:true,
        lowercase:true,
        trim:true,
        index:true// this fied is used when attributes is used for searchoing

    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true// this fied is used when attributes is used for searchoing
        
    },
    avatar:{
        type:String,// cloudinary url
        required:true
    },
    coverImage:{
        type:String,// cloudinary url
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    refreshToken:{
        type:String
    }
    
        
    
    
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)

})
// like middleware hum kuch custom methods bhi bna skte
// syntax userSchema.methods.method_name

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
    console.log("Pre save middleware running");
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    
}
// access token is not stored in database

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)