const { User, Food } = require('../models')
var jwt = require('jsonwebtoken');


class OA {
    static authenticate(req, res, next) {
        let token = req.headers.access_token
        if (token) {
            var decoded = jwt.verify(token, process.env.SECRET);
            req.userId = decoded.userId
            next()
        } else {
            res.status(400).json({ msg: 'Login in first to continue' })
        }
    }

    // static autherize(req, res, next) {
    //     console.log('in autherize')
    //     Food.findByPk(req.params.id)
    //         .then(found => {
    //             if (found) {
    //                 if (found.UserId == req.userId) {
    //                     console.log('autherized')
    //                     next()
    //                 } else {
    //                     res.status(400).json({ msg: 'access denied' })
    //                 }

    //             } else {
    //                 res.status(404).json({ msg: 'data not found' })
    //             }
    //         }).catch(err=>{
    //             res.status(500).json({msg:'Internal Server Error',err})
    //         })

    // }
}

module.exports = OA