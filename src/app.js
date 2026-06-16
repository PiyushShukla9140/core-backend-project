import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// cors configuration, app.use is used
// it is also used for all middlewares

app.use(cors({
    origin:process.env.CORS_ORIGN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
//url encoder
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// thsis configuration is storing files
app.use(express.static("public"))
app.use(cookieParser())


export {app}
