'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
      },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "member"
    }
  }, {});

  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Post, {
      foreignKey: "userId",
      as: "posts"
    });

    User.hasMany(models.Comment, {
      foreignKey: "userId",
      as: "comments"
    });

    User.hasMany(models.Vote, {
      foreignKey: "userId",
      as: "votes"
    });

    User.hasMany(models.Favorite, {
      foreignKey: "userId",
      as: "favorites"
    });

    User.addScope("getFavoritedPosts", (userId) => {
      return {
        include: [{
          model: models.Favorite,
          as: "favorites"
        }],
        where: {
          id: userId
        }
      }
    });

  }

  User.prototype.isAdmin = function() {
    return this.role === "admin";
      };
  
  return User;
};