const { Task, User } = require("../models");

class TaskCtrl {

    static list(req, res) {
        Task.findAll({
            include: [{ model: User, where: { organization: 'Hacktiv8' } }], order: [['updatedAt', 'asc']]
        }).then(task => {
            res.status(200).json({ task })
        }).catch(err => {
            res.status(500).json({ msg: 'Internal Server Error', err })
        })
    }

    static add(req, res) {
        const { title, category } = req.body
        Task.create({ title, category, UserId: req.userId })
            .then(task => {
                res.status(201).json({ task })
            }).catch(err => {
                res.status(500).json({ msg: 'Internal Server Error', err })
            })
    }

    static getbyId(req, res) {
        Task.findByPk(req.params.id)
            .then(found => {
                res.status(200).json({ task: found })
            }).catch(err => {
                res.status(500).json({ msg: 'Internal Server Error', err })
            })
    }

    // static move(req, res) {
    //     const { category } = req.body
    //     Task.update({ category }, { where: { id: req.params.id } })
    //         .then(task => {
    //             res.status(200).json({ task })
    //         }).catch(err => {
    //             res.status(500).json({ msg: 'Internal Server Error', err })
    //         })
    // }

    static edit(req, res) {

        // Task.findByPk(req.params.id)
        //     .then(found => {
        //         res.status(200).json({ task: found })
        //     }).catch(err => {
        //         res.status(500).json({ msg: 'Internal Server Error', err })
        //     })


        const { title, category } = req.body

        console.log(title, category)

        Task.update({ title, category }, { where: { id: req.params.id } })
            .then(task => {
                res.status(200).json({ task: { id: req.taskId, title, category: req.taskCategory } })
            }).catch(err => {
                res.status(500).json({ msg: 'Internal Server Error', err })
            })



        // if (title) {
        //     Task.update({ title }, { where: { id: req.params.id } })
        //         .then(task => {
        //             res.status(200).json({ task: { id: req.taskId, title, category: req.taskCategory } })
        //         }).catch(err => {
        //             res.status(500).json({ msg: 'Internal Server Error', err })
        //         })
        // } else if (category) {
        //     Task.update({ category }, { where: { id: req.params.id } })
        //         .then(task => {
        //             res.status(200).json({ task: { id: req.taskId, title: req.taskTitle, category } })
        //         }).catch(err => {
        //             res.status(500).json({ msg: 'Internal Server Error', err })
        //         })
        // } else {
        //     res.status(400).json({ msg: 'Update Error' })
        // }
    }

    static delete(req, res) {
        // let task;
        // Task.findByPk(req.params.id)
        //     .then(data => {
        //         if (data) {
        //             task = data;
        //             return Task.destroy({ where: { id: req.params.id } });
        //         } else {
        //             res.status(404).json({ message: "Error, data not found" });
        //         }
        //     })
        //     .then(data => {
        //         res.status(200).json({ task });
        //     })
        //     .catch(err => {
        //         res.status(500).json({ msg: 'Internal Sever Error', err });
        //     });


        Task.destroy({ where: { id: req.params.id } })
            .then(data => {
                res.status(200).json({ task: { id: req.taskId, title: req.taskTitle, category: req.taskCategory } });
            })
            .catch(err => {
                res.status(500).json({ msg: 'Internal Sever Error', err });
            });
    }
}


module.exports = TaskCtrl