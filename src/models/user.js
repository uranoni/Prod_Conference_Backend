import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validate: {
        validator: function (v) {
          return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
            v
          );
        },
        message: props => `${props.value} is not a valid email!`
      },
      unique: true,
      required: true
    },
    password: {
      type: String,
      minlength: [6, "Minimum 6 characters required!"],
      required: true
    },
    access: {
      role: { type: String, default: "USER" },
      group: { type: String }
    },
    tokens: [
      {
        token: {
          type: String
        },
        device: {
          type: String
        },
        requestIp: {
          type: String
        }
      }
    ],
    labels: [{ type: String }],
    verifyToken: {
      token: { type: String },
      exp: { type: Date }
    },
    verify: {
      type: String,
      default: false
    }
  },
  {
    timestamps: true
  }
);

schema.methods.generateAuthToken = function (requestIp, device) {
  const user = this;
  const token = jwt
    .sign({ _id: user._id.toHexString(), requestIp, device }, "conferpwd2019")
    .toString();
  user.tokens.push({ token, requestIp, device });
  return user.save().then(user => {
    return { token, user };
  });
};

schema.methods.userAuthentication = function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

schema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject("沒有這個會員");
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password).then(res => {
        if (res) {
          resolve(user);
        } else {
          reject("此密碼錯誤");
        }
      });
    });
  });
};

schema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, "conferpwd2019");
  } catch (e) {
    return null;
  }
  return User.findOne({
    _id: decoded._id,
    "tokens.token": token
  });
};

schema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.hash(user.password, 10).then(hash => {
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

export default mongoose.model("User", schema);
