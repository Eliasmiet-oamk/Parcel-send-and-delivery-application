import { BasicStrategy } from "passport-http";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";



export const applyPassportStrategybasic = (passport) => {
passport.use(
    new BasicStrategy(async (email, password, done) => {
      const user = await User.findOne({ email: email }).select("+password");
      if (!user) {
        //  email not found
  
        return done(null, false, { message: "HTTP Basic email not found" });
      }
  
      /* Verify password match */
      if (bcrypt.compareSync(password, user.password) == false) {
        // Password does not match
  
        return done(null, false, { message: "HTTP Basic password not found" });
      }
      return done(null, user);
    }),
  );
}
  