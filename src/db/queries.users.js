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
//define a result object to hold the user, posts, and comments that we will return and 
//request the User object from the database.
        let result = {};

        User.findById(id)
          .then((user) => {
            if (!user) {
              callback(404);
            } else {
                result["user"] = user;

                Post.scope({
                    method: ["lastFiveFor", id]
                  }).all()
                  .then((posts) => {
                    result["posts"] = posts;

                    Comment.scope({
                        method: ["lastFiveFor", id]
                      }).all()
                      .then((comments) => {
                        result["comments"] = comments;

                        User.scope({
                            method: ["getFavoritedPosts", id]
                          }).all()
                          .then((favorites) => {
                            let userFavorites = JSON.parse(JSON.stringify(favorites));
                            let favoritePostsId = [];

                            userFavorites[0].favorites.forEach((favorite) => {
                              favoritePostsId.push(favorite.postId);
                            });
                            let allFavorites = [];

                            Post.findAll()
                              .then((allPosts) => {
                                allPosts.forEach((thisPost) => {
                                  if (favoritePostsId.includes(thisPost.id)) {
                                    allFavorites.push({
                                      id: thisPost.id,
                                      title: thisPost.title,
                                      topicId: thisPost.topicId
                                    });
                                  }
                                })

                                result["allFavorites"] = allFavorites;
                                callback(null, result);
                              })
                            })
                          })
                        .catch((err) => {
                          callback(err);
                        })
                      })
                    }
                  })
                }

 }