class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""

    ){// overiding
        super(message)
        this.statusCode = statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors = errors

        // a code written in production grade code
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}