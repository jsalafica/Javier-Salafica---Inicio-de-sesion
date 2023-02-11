import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";
import { User } from "../models/user.model.js";

const hashPasword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const validatePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

const loginStrategy = new LocalStrategy(async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user || !validatePassword(password, user.password)) {
      return done("Invalid credentials", null);
    }

    done(null, user);
  } catch (err) {
    done("Error while login in", null);
  }
});

const registerStrategy = new LocalStrategy(
  { passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return done("Username already in use", null);
      }

      const newUser = {
        email,
        password: hashPasword(password),
      };
      const createdUser = await User.create(newUser);

      req.user = createdUser;

      done(null, createdUser);
    } catch (err) {
      done("Error while register", null);
    }
  }
);

export const passportStrategies = { loginStrategy, registerStrategy };
