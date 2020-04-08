const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { decrypt } = require("../helpers/bcrypt");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLECLIENTID);


class UserController {

    static register(req, res) {
        let { email, password } = req.body;
        User.findOne({ where: { email: email } })
            .then(foundOne => {
                if (foundOne) {
                    res.status(400).json({ msg: 'Email is Already Taken' })
                } else {
                    return User.create({ email, password })
                }
            })
            .then(user => {
                const access_token = jwt.sign({ userId: user.id }, process.env.SECRET);
                res.status(201).json({ access_token });
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ msg: 'Internal Server Error', error })
            })
    }

    static login(req, res) {
        let { email, password } = req.body;
        User.findOne({ where: { email: email } })
            .then(user => {
                let msg = "Email/Password invalid";
                if (user) {
                    if (decrypt(password, user.password)) {
                        const access_token = jwt.sign({ userId: user.id, }, process.env.SECRET);
                        res.status(200).json({ access_token });
                    } else {
                        res.status(400).json({ msg });
                    }
                } else {
                    res.status(400).json({ msg });
                }
            }).catch(err => {
                console.log(err)
                res.status(500).json({ msg: 'Internal Server Error', err })
            })
    }


    static google(req, res) {
        const token = req.body.token
        let user = {}
        client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLECLIENTID
        }).then(data => {
            const payload = data.getPayload()
            user.email = payload.email
            user.password = 'google'
            return User.findOne({ where: { email: user.email } })
        }).then(found => {
            if (found) {
                return found
            } else {
                return User.create(user)
            }
        }).then(login => {
            let access_token = jwt.sign({ userId: login.id }, process.env.SECRET)
            res.status(200).json({ access_token })
        }).catch(err => {
            res.status(500).text({ msg: 'Internal Server Error', err })
        })
    }
}

module.exports = UserController;