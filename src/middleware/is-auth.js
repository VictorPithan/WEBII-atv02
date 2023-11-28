const isAuth = (req, res, next) => {
  if (req.session?.user) {
    console.log("VOCÊ ESTÁ AUTENTICADO")
      return next()
  } else {
    console.log("VOCÊ NÃO ESTÁ AUTENTICADO")
      res.redirect('/')
  }
}

module.exports = { isAuth }