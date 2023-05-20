const express = require('express');
const usersRouter = express.Router();

const jwt = require('jsonwebtoken');

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");

    next();
});

const { getAllUsers } = require('../db');

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();

    res.send({
        users
    });
});

const { getUserByUsername } = require('../db');

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next({
            name: "MissingCridentialsError",
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUserByUsername(username)

        if (user && user.password === password) {
            const token = jwt.sign({ id: user.id, username: user.username, password: user.password }, process.env.JWT_SECRET);

            res.send({ message: "you're logged in!", token });
        } else {
            next({
                name: "IncorrectCridentialsError",
                message: "Username or password is incorrect"
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = usersRouter;