const bcrypt = require('bcrypt');
const { dataSource } = require('../config/datasource');
const { UserSchema } = require('../models/UserModel');
const { userLoginValidationSchema } = require('../validators/user-validator');

class AuthController {

    async login(req, res) {

      try {

        const usersRepository = dataSource.getRepository(UserSchema)

        let errors = new Object()

        const userValidation = req.body
        const { value, error } = userLoginValidationSchema.validate(userValidation, { abortEarly: false });


        const user = await usersRepository.findOne({
          where: { email: value.email }
        });

        if (!user) {
          errors = { user: "Login ou senha inválidos" }
        }

        if (error) {
          for (const err of error.details) {
              errors[err.path[0]] = err.message;
          }
        }

        let comparePassword = false

        if(user) {
          comparePassword = bcrypt.compareSync(value?.password, user.password);
        }

        if (!comparePassword) {
          errors = { ...errors, user: "Login ou senha inválidos" }
        }

        if (Object.keys(errors).length > 0) {
          console.log('Log: AuthController - Object.keys');

          return res.render('login', { errors: errors });
        }

        const { password: userPassword, ...userS } = user;
        req.session.user = userS;

        return res.status(200).redirect('/home')
        
      } catch (error) {
        console.log(`Log: AuthController - create Catch error: ${error}`);
        return res.render("page-not-found");
      }
        
    }

    async logout(req, res) {
      req.session.destroy();
      return res.redirect('/')
    }

}

module.exports = {
    AuthController
}