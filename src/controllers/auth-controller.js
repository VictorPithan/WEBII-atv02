const bcrypt = require('bcrypt');
const { dataSource } = require('../config/datasource');
const { UserSchema } = require('../models/UserModel');

class AuthController {

    async login(req, res) {

        const { email, password } = req.body;

        const usersRepository = dataSource.getRepository(UserSchema)

        const user = await usersRepository.findOne({
          where: { email: email }
        });


        if (user) {
          const comparePassword = bcrypt.compareSync(password, user.password);

          const { password: userPassword, ...userS } = user;
          req.session.user = userS;

          return res.status(200).redirect('/home')
        }

        res.send('USUARIO NAO ENCONTRADO');
    }

    async logout(req, res) {
      req.session.destroy();
      return res.redirect('/')
    }

}

module.exports = {
    AuthController
}