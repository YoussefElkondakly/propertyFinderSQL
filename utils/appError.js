

class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational=true
        //the next Line I do Not Know it
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports=AppError