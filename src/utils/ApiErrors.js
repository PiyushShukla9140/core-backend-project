class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        statck=""

    ){// overiding
        super(message)
        this.statusCode = statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors = errors

        // a code written in production grade code
        if(statck){
            this.stack=statck
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}