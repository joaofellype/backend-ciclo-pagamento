const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {

    genereteToken(params = {}) {
        console.log(params)
        return jwt.sign(params, process.env.SECREKEYTOKEN, {
            expiresIn: process.env.TOKENEXPIRES
        })
    },
    validateToken(req, res, next) {

        console.log('ldkfldkfldklfkdlfkdlf')
        const token = req.body.token || ''
        jwt.verify(token, process.env.SECREKEYTOKEN, function (err, decoded) {
                if(err){
                    return res.status(400).json({message:err})
                }
            return res.status(200).send({
                valid: !err
            })
        })
    }
}