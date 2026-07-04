import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const likeSchema = new mongoose.Schema({
    comment:{
        type:Schema.Types.ObjectId,
        ref:"comment"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"video"
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"tweets"
    }
},{timestamps:true})

likeSchema.plugin(mongooseAggregatePaginate)

export const Like = mongoose.model("Like",likeSchema)