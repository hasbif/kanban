const { User, Task } = require('../models')
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

    static authorize(req, res, next) {
        Task.findByPk(req.params.id)
            .then(found => {
                if (found) {
                    console.log('test')
                    if (found.UserId == req.userId) {
                        console.log('authorize', found)
                        req.taskId = found.id
                        req.taskTitle = found.title
                        req.taskCategory = found.category
                        next()
                    } else {
                        res.status(400).json({ msg: 'Access Denied' })
                    }

                } else {
                    res.status(404).json({ msg: 'Task Not Found' })
                }
            }).catch(err => {
                res.status(500).json({ msg: 'Internal Server Error', err })
            })

    }
}

module.exports = OA