import MongoStore from "connect-mongo";
import express, { json, urlencoded } from "express";
import expHbs from "express-handlebars";
import session from "express-session";
import { configObject } from "./config/index.js";
import router from "./routes/index.js";
import passport from "passport";
import { passportStrategies } from "./lib/passport.lib.js";
import { User } from "./models/user.model.js";
import mongoose from "mongoose";

const app = express();
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    rolling: true,
    secret: "coderhouse",
    store: new MongoStore({
      mongoUrl: configObject.mongoUrl,
      mongoOptions,
    }),
    cookie: {
      maxAge: 600000,
    },
  })
);

app.engine(".hbs", expHbs({ extname: ".hbs", defaultLayout: "main.hbs" }));
app.set("view engine", ".hbs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use("login", passportStrategies.loginStrategy);
passport.use("register", passportStrategies.registerStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);

  return user;
});

app.use("/", router);

mongoose.connect;
app.listen(3000, () => {
  console.log("Server listening port 3000");
});
