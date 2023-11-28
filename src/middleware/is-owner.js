const isOwner = (req, res, next) => {
  if (req.params.id == req.session?.user?.id) {
    console.log("VC EH DONO DESTA INFORMAÇÃO")
      return next();
  }

  return res.status(403).send("VC NAO EH O DONO DA INFORMACAO");
}

module.exports = {
  isOwner
}