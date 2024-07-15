

//error codes
// "name": "ValidationError",
// "name": "ValidationError",

module.exports= (err,req,res,next)=>{

    console.log(err)
    
      err.statusCode = err.statusCode || 500;
    err.message = err.message||'Internal Server Error';

    res.status(err.statusCode).json({
        status:err.status,
        message:err.message
        ,error:err,
        
    })
}