const { dataSource } = require("../config/datasource");
const { UserSchema } = require("../models/UserModel");

const bcrypt = require('bcrypt');
const saltRounds = 10;

class UsersController {

    async getUsers(req, res) {
        console.log("GET USERS");

        const usersRepository = dataSource.getRepository(UserSchema)
        const users = await usersRepository.find()
        
        console.log({ users })
        res.status(200).send(users);
    }

    async pageLogin(req, res) {
      res.status(200).render('login')
    }

    async pageCreateUser(req, res) {
      res.status(200).render('create-user')
    }

    async createUser(req, res) {
        console.log('Create user');
        const { firstname, lastname, username, email, password } = req.body;
        if (!firstname || !lastname || !username || !email || !password) {
            return res.status(400).send('Bad request - missing parameters');
        }

        const cryptedPassword = await bcrypt.hash(password, saltRounds) 

        const user = {
            firstname,
            lastname,
            username,
            email,
            password: cryptedPassword
        };

        const usersRepository = dataSource.getRepository(UserSchema)
        const users = await usersRepository.save(user)

        // res.status(201).send(JSON.stringify(user));
        res.status(201).redirect('/');
    }


    // async pageEditUser(req, res) {
    //     const { id } = req.params;

    //     const user = await this.usersDao.getById(id);
        
    //     res.render('edit-user', { user })
    // }


    // async editUserV1(req, res) {

    //     const { id } = req.params;

    //     const form = formidable({
    //         uploadDir: 'public/uploads'
    //     });

    //     form.parse(req, async (err, fields, files) => {
    //         if (err) {
    //             next(err);
    //             return;
    //         }

    //         let name, email, image;
    //         name = fields.name[0];
    //         email = fields.email[0];
    //         image = files.image_upload[0].newFilename;

    //         await this.usersDao.update({id, name, email, image});

    //         res.json({ name, email, image });
    //     });


    // }

}

module.exports = {
    UsersController
}