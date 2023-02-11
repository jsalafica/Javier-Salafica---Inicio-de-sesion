const authMiddleware = (req, res, next) => {
  const user = req.session.user;

  if (user) {
    return next();
  }

  res.redirect("/login");
};

const checkNotRegistered = (req, res, next) => {
  const user = req.session.user;

  if (user) {
    return next();
  }

  // Acá va la logica de chequeo en la base de datos
};

const checkNotLogged = (req, res, next) => {
  const user = req.session.user;

  if (!user) {
    return next();
  }

  res.redirect("/welcome");
};

export const authMiddlewares = { checkNotLogged, authMiddleware };
