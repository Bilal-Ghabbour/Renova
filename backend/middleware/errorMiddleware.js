const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    console.error(err);
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export default errorHandler;