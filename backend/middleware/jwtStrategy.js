import { ExtractJwt } from "passport-jwt";
import passportJWT from "passport-jwt";
import dotenv from "dotenv";


dotenv.config();
let jwtSecretKey = process.env.JWTKEY;

const JwtStrategy = passportJWT.Strategy;

export const applyPassportStrategyjwt = (passport) => {
    let options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = jwtSecretKey;
  
    passport.use(
      new JwtStrategy(options, function (jwt_payload, done) {
        const now = Date.now() / 1000;
        if (jwt_payload.exp > now) {
          done(null, jwt_payload.user);
        } else {
          done(null, false);
        }
      }),
    );
  };