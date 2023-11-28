const { dataSource } = require("../config/datasource");
const { UserSchema } = require("../models/UserModel");
const { userValidationSchema } = require('../validators/user-validator');

const bcrypt = require('bcrypt');
const saltRounds = 10;

class UsersController {

    async getUsers(req, res) {
        console.log("GET USERS");

        const userId = req.session?.user?.id

        const usersRepository = dataSource.getRepository(UserSchema)

        const user = await usersRepository.findOne({
            where: { id: userId }
        })

        const users = await usersRepository.find()
        const listUser = users.filter((userList) => {
            return userList.id != user.id
        })
        res.render('friends-list', { listUser, user })
    }

    async pageLogin(req, res) {
      res.status(200).render('login')
    }

    async pageCreateUser(req, res) {
      res.status(200).render('create-user')
    }

    async createUser(req, res) {
        console.log('Create user');

        try {
            const usersRepository = dataSource.getRepository(UserSchema)

            let errors = new Object()

            const userValidation = req.body

            const { value, error } = userValidationSchema.validate(userValidation, { abortEarly: false });

            const user = await usersRepository.findOne({
                where: { username: value.username, email: value.email } 
            })

            if(user) {
                errors = { user: "Usuário já existe" }
            }

            if (error) {
                for (const erro of error.details) {
                    errors[erro.path[0]] = erro.message;
                }
            }

            if (Object.keys(errors).length > 0) {
                console.log('Log: UserController - Object.keys');
                return res.render('create-user', { errors: errors });
            }

            const cryptedPassword = await bcrypt.hash(value.password, saltRounds) 

            const newUser = {
                firstname: value.firstname,
                lastname: value.lastname,
                username: value.username,
                email: value.email,
                password: cryptedPassword
            };

            const users = await usersRepository.save(newUser)

            res.status(201).redirect('/');
        } catch (error) {
            console.log(`Log: UserController - create Catch error: ${error}`);
            return res.render("page-not-found");
        }
        
    }

}

module.exports = {
    UsersController
}