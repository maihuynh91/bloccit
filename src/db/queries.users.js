const User = require("./models").User;
const bcrypt = require("bcryptjs");

const Post = require("./models").Post;
const Comment = require("./models").Comment;

module.exports = {
// createUser takes object with email, password, passwordConfirmation properties, and a callback.
      createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    
    // #4
        return User.create({
          email: newUser.email,
          password: hashedPassword
        })
        .then((user) => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        })
      },

      getUser(id, callback){
           let result = {};

           User.findById(id)
           .then((user) => {
             if(!user) {
               callback(404);
             } else {
               result["user"] = user;
        
               Post.scope({method: ["lastFiveFor", id]}).all()
               .then((posts) => {
        //store the result in the result object.
                 result["posts"] = posts;
        
                 Comment.scope({method: ["lastFiveFor", id]}).all()
                 .then((comments) => {
        //store the result in the object and pass the object to the callback.
                   result["comments"] = comments;
                   callback(null, result);
                 })
                 .catch((err) => {
                   callback(err);
                 })
               })
             }
           })
         }


    
    }