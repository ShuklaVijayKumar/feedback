const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (exception) {
    console.log(exception);
  }
});

passport.deserializeUser((id, done) => {
  try {
    User.findById({ id }).then(user => {
      done(null, user);
    });
  } catch (exception) {
    console.log(exception);
  }
});

passport.use(
  new googleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          console.log(1);
          done(null, existingUser);
        } else {
          new User({ googleId: profile.id })
            .save()
            .then(user =>
               done(null, user));
        }
      });
    }
  )
);
