import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type: Schema.Types.ObjectId,// the user who is subscribing
        ref : "user"
    },
    channel:{
        type: Schema.Types.ObjectId,// the one whose channel is used
        //one to whom 'subscriber' is subscribing
        ref:"user"
    }
},{timestamps:true})


export const Subscription = mongoose.model("Subscription",subscriptionSchema)