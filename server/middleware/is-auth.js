const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if(!authHeader) {
        const error = new Error('Not Authenticated')
        error.statusCode = 401
        throw error
    }
    const token = authHeader.split(' ')[1]

    let decodedToken;
    try {
        decodedToken = jwt.verify(token,'thesecretkey')  // decode and verify the token
    } catch (error) {
        error.statusCode = 500
        throw error 
    }
    // we found i\the token and now verify if the token is undefined or not i.e if undefined then not authenticated
    if(!decodedToken) {
        const error = new Error('Not authenticated')
        error.statusCode = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
} 