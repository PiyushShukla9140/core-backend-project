const asyncHandler = (requestHandler)=>{
    return (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}
export {asyncHandler}
/*
const asyncHandler = (fn)=>async(req,res,next)=>{
    try{
        await fn(req,res,next)
    }catch(err){
        
        res.status(err.code||800).json({
            success:false,
            message:err.message
        })
    }
}
//const asynHandler=()=>{}
// cosnt asyncHandler=(fn)=>{}
// const asyncHandler=(fn)=>()=>{}
//const asyncHandler = (fn)=>async()=>{}
*/

// now the promise then catch method

