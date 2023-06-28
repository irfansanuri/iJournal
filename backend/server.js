require("dotenv/config");

var express = require("express");
var app = express();

var jwt = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");

var cors = require("cors");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

var mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const multer = require("multer");

const { v4: uuidv4 } = require("uuid");

const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  sendAccessToken
} = require("./tokens.js");

// MongoDB Configuration

mongoose
  .connect("mongodb://localhost/journalDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(
    () => {
      console.log("Database sucessfully connected");
    },
    (error) => {
      console.log("Database could not be connected: " + error);
    }
  );

let User = require("./model/user.js");
let Field = require("./model/field");
let Category = require("./model/category");
let Article = require("./model/article");

const { urlencoded, application } = require("express");

app.use(cookieParser());

app.use("/public", express.static("public"));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use(bodyParser.json()); // to support JSON-encoded bodies

app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

//-----------------------------------------------//
//             LOGIN/REGISTER/LOGOUT             //
//-----------------------------------------------//

//LOGIN API

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user in array. If not exist send error

    User.findOne({ email: email }, function (err, data) {
      if (err) {
        console.log(err);
      } else if (data) {
        // 2. Compare crypted password and see if it checks out. Send error if not
        bcrypt.compare(password, data.password, function (err, result) {
          if (result) {
            // 3. Create Refresh- and Accesstoken
            const accesstoken = createAccessToken(data._id);
            console.log("Access Token: " + accesstoken);

            const refreshtoken = createRefreshToken(data._id);
            console.log("Refresh Token: " + refreshtoken);

            // 4. Store Refreshtoken with user in "db"
            // Could also use different version numbers instead.
            // Then just increase the version number on the revoke endpoint
            // data.refreshtoken = refreshtoken;

            User.updateOne(
              { email: email },
              { refreshtoken: refreshtoken },
              { multi: true },
              function (err, found) {
                if (err) {
                  console.log(err);
                } else {
                  // 5. Send token. Refreshtoken as a cookie and accesstoken as a regular response

                  sendRefreshToken(res, refreshtoken);
                  sendAccessToken(res, req, accesstoken);
                }
              }
            );
          } else {
            res.status(400).json({
              errorMessage: "Password not correct",
              status: false
            });
          }
        });
      } else {
        res.status(400).json({
          errorMessage: "User does not exist",
          status: false
        });
      }
    });
  } catch (err) {
    res.send({
      error: "`${err.message}`"
    });
  }
});

/* REGISTER API*/
app.post("/register", (req, res) => {
  try {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (req.body && req.body.email && req.body.password) {
          User.find({ email: req.body.email }, (err, data) => {
            if (data.length === 0) {
              let user = new User({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: hash,
                role: req.body.role
              });
              user.save((err, data) => {
                if (err) {
                  res.status(400).json({
                    errorMessage: err,
                    status: false
                  });
                } else {
                  res.status(200).json({
                    status: true,
                    title: "Registered Successfully."
                  });
                }
              });
            } else {
              res.status(400).json({
                errorMessage: `UserName ${req.body.email} Already Exist!`,
                status: false
              });
            }
          });
        } else {
          res.status(400).json({
            errorMessage: "Add proper parameter first!",
            status: false
          });
        }
      });
    });
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false
    });
  }
});

/*LOGOUT API*/

app.post("/logout", (req, res) => {
  res.clearCookie("refreshtoken", { path: "/refresh_token" });
  res.clearCookie("role", { path: "/" });
  res.clearCookie("email", { path: "/" });

  return res.send({
    message: "Logged Out"
  });
});

//REFRESH TOKEN API

app.post("/refresh_token", (req, res) => {
  console.log("refresh token");
  const token = req.cookies.refreshtoken;

  //if we don't have a token in our request
  if (!token) return res.send({ accesstoken: "" });

  //we have a token, let's verify it
  let payload = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.send({ accesstoken: "" });
  }

  //token is valid, check if user exist

  User.findOne({ _id: payload.userId }, function (err, user) {
    // const user = fakeDB.find(user=>user.id === payload.userId);
    if (!user) {
      return res.send({ accesstoken: "" });
    }

    //user exists, check if refreshtoken exist on user
    else if (user.refreshtoken !== token) {
      return res.send({ accesstoken: " " });
    }

    //token exist,create new refresh- and accesstoken
    const accesstoken = createAccessToken(user._id);
    const refreshtoken = createRefreshToken(user._id);
    user.refreshtoken = refreshtoken;

    // All good to go send new refresh token and accestoken
    sendRefreshToken(res, refreshtoken, user.email, user.role);

    console.log("refresh token");
    return res.send({
      accesstoken
    });
  });
});

//-----------------------------------------------//
//              MANAGE USER API                  //
//-----------------------------------------------//

// READ SPECIFIC USER API

app.post("/readSpecificUser", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    res.send(user);
  });
});

// READ USER API

app.get("/userData", function (req, res) {
  var userData = [];

  User.find({}, function (err, user) {
    user.forEach((each) => {
      userData.push({
        id: each._id,
        field: each.field,
        category: each.category,
        fname: each.fname,
        lname: each.lname,
        email: each.email,
        role: each.role,
        date: each.date
      });
    });

    res.send(userData);
  });
});

// EDIT USER API

app.patch("/edituser", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, found) {
    switch (req.body.type) {
      case "fullName":
        User.updateOne(
          { email: req.body.email },
          { fname: req.body.fname, lname: req.body.lname },
          function (err, found) {
            console.log("Successfully update user's name");
          }
        );
        break;
      case "role":
        User.updateOne(
          { email: req.body.email },
          { role: req.body.role },
          function (err, found) {
            console.log("Successfully update user's role");
          }
        );
        break;
      case "field":
      case "category":
        User.updateOne(
          { email: req.body.email },
          { field: req.body.field, category: req.body.category },
          function (err, found) {
            console.log("Successfully update user's field and category");
          }
        );
        break;
      default:
        console.log("ERROR WEH");
    }
  });
});

// DELETE USER API

app.post("/userDelete", function (req, res) {
  User.findOneAndRemove({ _id: req.body.id }, function (err, data) {
    console.log(data);
    if (!err) {
      console.log("Deleted");
    }
  });
});

//-----------------------------------------------//
//              MANAGE FIELD API                 //
//-----------------------------------------------//

//CREATE FIELD API

app.post("/fieldCreate", function (req, res) {
  let newField = new Field({
    name: req.body.field,
    categories: []
  });

  newField.save((err, data) => {
    if (err) {
      res.status(400).json({
        errorMessage: err,
        status: false
      });
    } else {
      res.status(200).json({
        status: true,
        title: "Successfully add new Field!"
      });
    }
  });
});

//READ FIELD API

app.get("/fieldRead", function (req, res) {
  Field.find({}, function (err, field) {
    res.send(field);
  });
});

//DELETE FIELD API

app.post("/fieldDelete", async function (req, res) {
  Field.findOneAndRemove({ name: req.body.field }, function (err, data) {
    console.log(data);
    if (!err) {
      console.log("Deleted");
    }
  });

  await Category.deleteOne({ field: req.body.field });

  await Article.deleteMany({ field: req.body.field });
});

//-----------------------------------------------//
//             MANAGE CATEGORY API               //
//-----------------------------------------------//

//CREATE CATEGORY

app.post("/categoryCreate", function (req, res) {
  console.log(
    `Category dia ${req.body.category}, pastu Field dia ${req.body.field}`
  );
  let newCategory = new Category({
    name: req.body.category,
    field: req.body.field,
    articles: []
  });

  Field.findOne({ name: req.body.field }, function (err, field) {
    Field.updateOne(
      { name: req.body.field },
      { categories: [...field.categories, newCategory] },
      function (err, found) {
        console.log("New Category inserted into " + req.body.field);
      }
    );
  });

  newCategory.save();
});

//READ CATEGORY

app.get("/categoryRead", function (req, res) {
  Category.find({}, function (err, category) {
    res.send(category);
  });
});

//DELETE CATEGORY

app.post("/categoryDelete", async function (req, res) {
  Category.deleteOne({ name: req.body.category }, function (err, found) {
    console.log(found);
  });

  Field.findOne({ name: req.body.field }, function (err, field) {
    let fieldArr = field.categories;
    let newField = [];

    fieldArr.forEach((each) => {
      if (each.name === req.body.category) {
      } else {
        newField.push(each);
      }
    });

    Field.updateOne(
      { name: req.body.field },
      { categories: newField },
      function (err, found) {
        console.log("Successfully deleted a category");
      }
    );
  });

  await Article.deleteMany({ category: req.body.category });
});

//-----------------------------------------------//
//              MULTER FILE UPLOAD               //
//-----------------------------------------------//

const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  }
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .pdf format allowed!"));
    }
  }
});

//-----------------------------------------------//
//                  ARTICLE API                  //
//-----------------------------------------------//

// CREATE ARTICLE

app.post("/createArticle", upload.single("pathArticle"), (req, res, next) => {
  console.log("Create Article");

  const url = req.protocol + "://" + req.get("host");

  const article = new Article({
    title: req.body.title,
    status: "Waiting",
    year: req.body.year,
    field: req.body.field,
    category: req.body.category,
    author: req.body.author,
    path: url + "/public/" + req.file.filename,
    notes: []
  });
  article
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Article registered successfully!",
        userCreated: {
          _id: result._id,
          title: result.title,
          status: result.status,
          details: result.details,
          pathArticle: result.pathArticle
        }
      });
    })
    .catch((err) => {
      console.log(err),
        res.status(500).json({
          error: err
        });
    });

  Category.findOne({ name: req.body.category }, function (err, newCategory) {
    Category.updateOne(
      { name: req.body.category },
      { articles: [...newCategory.articles, article] },
      function (err, found) {
        console.log("New Article inserted into " + req.body.category);
      }
    );
  });

  Field.findOne({ name: req.body.field }, function (err, field) {
    let newFieldCategories = field.categories;

    Category.findOne({ name: req.body.category }, function (err, newCategory) {
      newFieldCategories.forEach((each) => {
        if (each.name === req.body.category) {
          newFieldCategories.splice(
            newFieldCategories.indexOf(each),
            1,
            newCategory
          );
        }
      });

      Field.updateOne(
        { name: req.body.field },
        { categories: newFieldCategories },
        function (err, found) {}
      );
    });
  });

  User.findOne({ email: req.body.email }, function (err, foundUser) {
    User.updateOne(
      { email: req.body.email },
      { articles: [...foundUser.articles, article] },
      function (err, found) {
        console.log("New Article inserted into " + req.body.category);
      }
    );
  });

  console.log("Article Created");
});

// CREATE ARTICLE ADMIN

app.post("/adminCreateArticle", upload.single("pathArticle"), (req, res, next)=>{
  console.log(req.body.title);
  console.log(req.body.author);
  console.log(req.body.editor);
  console.log(req.body.field);
  console.log(req.body.category);
  console.log(req.body.status);
  console.log(req.body.year);

  const url = req.protocol + "://" + req.get("host");

  const article = new Article({
    title: req.body.title,
    status: req.body.status,
    year: req.body.year,
    field: req.body.field,
    category: req.body.category,
    author: req.body.author,
    path: url + "/public/" + req.file.filename,
    notes: []
  });
  article
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Article registered successfully!",
        userCreated: {
          _id: result._id,
          title: result.title,
          status: result.status,
          details: result.details,
          pathArticle: result.pathArticle
        }
      });
    })
    .catch((err) => {
      console.log(err),
        res.status(500).json({
          error: err
        });
    });

  Category.findOne({ name: req.body.category }, function (err, newCategory) {
    Category.updateOne(
      { name: req.body.category },
      { articles: [...newCategory.articles, article] },
      function (err, found) {
        console.log("New Article inserted into " + req.body.category);
      }
    );
  });

  Field.findOne({ name: req.body.field }, function (err, field) {
    let newFieldCategories = field.categories;

    Category.findOne({ name: req.body.category }, function (err, newCategory) {
      newFieldCategories.forEach((each) => {
        if (each.name === req.body.category) {
          newFieldCategories.splice(
            newFieldCategories.indexOf(each),
            1,
            newCategory
          );
        }
      });

      Field.updateOne(
        { name: req.body.field },
        { categories: newFieldCategories },
        function (err, found) {}
      );
    });
  });
  
})

// READ ARTICLE

app.get("/readArticle", (req, res, next) => {
  Article.find().then((data) => {
    res.status(200).json({
      message: "Article retrieved successfully!",
      articles: data
    });
  });
});

// EDIT ARTICLE

app.patch("/editArticle", (req, res) => {
  console.log(req.body.type);
  console.log(req.body.articleID);

  Article.findOne({ _id: req.body.articleID }, function (err, article) {
    switch (req.body.type) {
      case "status":
        Article.updateOne(
          { _id: req.body.articleID },
          { status: req.body.status },
          function (req, res) {
            console.log("Status successfully updated");
          }
        );
        break;
      case "title":
        Article.updateOne(
          { _id: req.body.articleID },
          { title: req.body.title },
          function (req, res) {
            console.log("Title successfully updated");
          }
        );
        break;
      case "year":
        Article.updateOne(
          { _id: req.body.articleID },
          { year: req.body.year },
          function (req, res) {
            console.log("Year successfully updated");
          }
        );
        break;
      case "dateline":
        Article.updateOne(
          { _id: req.body.articleID },
          { dateline: req.body.dateline },
          function (req, res) {
            console.log("Dateline successfully updated");
          }
        );
        break;
      case "field":
      case "category":
        Article.updateOne(
          { _id: req.body.articleID },
          { field: req.body.newField, category: req.body.newCategory },
          function (req, res) {
            console.log("Title successfully updated");
          }
        );
        break;
      default:
        console.log("Hello World");
    }
  }).then(() => {
    User.find({}, function (err, userData) {
      Article.findOne({ _id: req.body.articleID }, function (
        err,
        foundArticle
      ) {
        userData.forEach((user) => {
          let userArticles = user.articles;

          userArticles.forEach((article) => {
            if (article._id.equals(req.body.articleID)) {
              userArticles.splice(
                userArticles.indexOf(article),
                1,
                foundArticle
              );

              console.log(user.email);
            }
          });

          User.updateOne(
            { email: user.email },
            { articles: userArticles },
            () => {}
          );
        });
      });
    });

    switch (req.body.type) {
      case "field":
      case "category":
        Category.findOne({ name: req.body.newCategory }, function (
          err,
          foundCategory
        ) {
          Article.findOne({ _id: req.body.articleID }, function (
            err,
            foundArticle
          ) {
            let foundCategoryArr = foundCategory.articles;

            foundCategoryArr.forEach((each) => {
              if (each._id.equals(req.body.articleID)) {
                foundCategoryArr.splice(
                  foundCategoryArr.indexOf(each),
                  1,
                  foundArticle
                );
              }
            });

            Category.updateOne(
              { name: req.body.newCategory },
              { articles: foundCategoryArr },
              function (err, found) {
                console.log("New Article assigned to an editor");
              }
            );
          });
        }).then(() => {
          Field.findOne({ name: req.body.newField }, function (err, field) {
            Category.findOne({ name: req.body.newCategory }, function (
              err,
              newCategory
            ) {
              let newFieldCategories = field.categories;

              newFieldCategories.forEach((each) => {
                if (each.name === req.body.newCategory) {
                  newFieldCategories.splice(
                    newFieldCategories.indexOf(each),
                    1,
                    newCategory
                  );
                }
              });

              Field.updateOne(
                { name: req.body.newField },
                { categories: newFieldCategories },
                function (err, found) {}
              );
            });
          });
        });

        break;
      default:
        Category.findOne({ name: req.body.category }, function (
          err,
          foundCategory
        ) {
          Article.findOne({ _id: req.body.articleID }, function (
            err,
            foundArticle
          ) {
            let foundCategoryArr = foundCategory.articles;

            foundCategoryArr.forEach((each) => {
              if (each._id.equals(req.body.articleID)) {
                foundCategoryArr.splice(
                  foundCategoryArr.indexOf(each),
                  1,
                  foundArticle
                );
              }
            });

            Category.updateOne(
              { name: req.body.category },
              { articles: foundCategoryArr },
              function (err, found) {
                console.log("New Article assigned to an editor");
              }
            );
          });
        }).then(() => {
          Field.findOne({ name: req.body.field }, function (err, field) {
            Category.findOne({ name: req.body.category }, function (
              err,
              newCategory
            ) {
              let newFieldCategories = field.categories;

              newFieldCategories.forEach((each) => {
                if (each.name === req.body.category) {
                  newFieldCategories.splice(
                    newFieldCategories.indexOf(each),
                    1,
                    newCategory
                  );
                }
              });

              Field.updateOne(
                { name: req.body.field },
                { categories: newFieldCategories },
                function (err, found) {}
              );
            });
          });
        });
    }
  });
});

// DELETE ARTICLE

app.post("/deleteArticle", (req, res) => {
  Article.findOneAndRemove({ _id: req.body.articleID }, function (err, data) {
    console.log(data);
    if (!err) {
      console.log("Deleted");
    }
  });

  Category.findOne({ name: req.body.category }, function (err, category) {
    let categoryArr = category.articles;
    let newCategory = [];

    categoryArr.forEach((each) => {
      if (each._id.equals(req.body.articleID)) {
      } else {
        newCategory.push(each);
      }
    });

    console.log("New Category:");
    console.log(newCategory);

    Category.updateOne(
      { name: req.body.category },
      { articles: newCategory },
      function (err, found) {
        console.log("Successfully deleted an article");
      }
    );
  });

  Field.findOne({ name: req.body.field }, function (err, field) {
    let newFieldCategories = field.categories;

    Category.findOne({ name: req.body.category }, function (err, newCategory) {
      newFieldCategories.forEach((each) => {
        if (each.name === req.body.category) {
          newFieldCategories.splice(
            newFieldCategories.indexOf(each),
            1,
            newCategory
          );
        }
      });

      Field.updateOne(
        { name: req.body.field },
        { categories: newFieldCategories },
        function (err, found) {}
      );
    });
  });

  User.find({}, function (err, userData) {
    userData.forEach((each) => {
      let userArr = each.articles;

      userArr.forEach((article) => {
        if (article._id.equals(req.body.articleID)) {
          userArr.splice(userArr.indexOf(article), 1);
        }

        User.updateOne({ email: each.email }, { articles: userArr }, function (
          err,
          found
        ) {
          console.log("Successfully deleted an article");
        });
      });
    });
  });
});

//-----------------------------------------------//
//             GENERAL EDITOR API                //
//-----------------------------------------------//

// ASSIGN ARTICLE TO EDITOR API

app.post("/assignEditor", function (req, res) {
  console.log("Assign Editor");

  Article.findOne({ _id: req.body.articleID }, function (err, foundArticle) {
    Article.updateOne(
      { _id: req.body.articleID },
      { editor: req.body.email, status: "Editing" },
      function (err, found) {
        console.log("New Article is assigned to an editor");
      }
    );
  }).then(() => {
    User.find({}, function (err, userData) {
      Article.findOne({ _id: req.body.articleID }, function (
        err,
        foundArticle
      ) {
        userData.forEach((user) => {
          let userArticles = user.articles;

          userArticles.forEach((article) => {
            if (article._id.equals(req.body.articleID)) {
              userArticles.splice(
                userArticles.indexOf(article),
                1,
                foundArticle
              );

              console.log(user.email);
            }
          });

          User.updateOne(
            { email: user.email },
            { articles: userArticles },
            () => {}
          );
        });
      });
    });

    User.findOne({ email: req.body.email }, function (err, foundUser) {
      Article.findOne({ _id: req.body.articleID }, function (
        err,
        foundArticle
      ) {
        User.updateOne(
          { email: req.body.email },
          { articles: [...foundUser.articles, foundArticle] },
          function (err, found) {
            console.log("New Article is assigned to an editor");
          }
        );
      });
    });

    Category.findOne({ name: req.body.category }, function (
      err,
      foundCategory
    ) {
      Article.findOne({ _id: req.body.articleID }, function (
        err,
        foundArticle
      ) {
        let foundCategoryArr = foundCategory.articles;

        foundCategoryArr.forEach((each) => {
          if (each._id.equals(req.body.articleID)) {
            foundCategoryArr.splice(
              foundCategoryArr.indexOf(each),
              1,
              foundArticle
            );
          }
        });

        Category.updateOne(
          { name: req.body.category },
          { articles: foundCategoryArr },
          function (err, found) {
            console.log("New Article assigned to an editor");
          }
        );
      });
    }).then(() => {
      Field.findOne({ name: req.body.field }, function (err, field) {
        Category.findOne({ name: req.body.category }, function (
          err,
          newCategory
        ) {
          let newFieldCategories = field.categories;

          newFieldCategories.forEach((each) => {
            if (each.name === req.body.category) {
              newFieldCategories.splice(
                newFieldCategories.indexOf(each),
                1,
                newCategory
              );
            }
          });

          Field.updateOne(
            { name: req.body.field },
            { categories: newFieldCategories },
            function (err, found) {}
          );
        });
      });
    });
  });

  console.log("Assign Editor");
});

// REASSIGN EDITOR API

app.post("/reassignEditor", function (req, res) {
  console.log("Reassign Editor");

  User.findOne({ email: req.body.editorEmail }, function (err, foundUser) {
    console.log(req.body.editorEmail);
    let userArticles = foundUser.articles;
    let newArr = [];

    userArticles.forEach((article) => {
      if (article._id.equals(req.body.articleID)) {
      } else {
        newArr.push(article);
      }
    });

    User.updateOne(
      { email: req.body.editorEmail },
      { articles: newArr },
      function (err, found) {}
    );
  });

  Article.findOne({ _id: req.body.articleID }, function (err, foundArticle) {
    Article.updateOne(
      { _id: req.body.articleID },
      { editor: req.body.email, status: "Editing" },
      function (err, found) {
        console.log("An Article is ReAssigned to a new editor");
      }
    );
  }).then(() => {
    User.find({}, function (err, userData) {
      Article.findOne({ _id: req.body.articleID }, function (
        err,
        foundArticle
      ) {
        userData.forEach((user) => {
          let userArticles = user.articles;

          userArticles.forEach((article) => {
            if (article._id.equals(req.body.articleID)) {
              userArticles.splice(
                userArticles.indexOf(article),
                1,
                foundArticle
              );
            }
          });

          User.updateOne(
            { email: user.email },
            { articles: userArticles },
            () => {}
          );
        });
      });
    });

    User.findOne({ email: req.body.email }, function (err, foundUser) {
      Article.findOne({ _id: req.body.articleID }, function (
        err,
        foundArticle
      ) {
        User.updateOne(
          { email: req.body.email },
          { articles: [...foundUser.articles, foundArticle] },
          function (err, found) {
            console.log("An Article is ReAssigned to a new editor");
          }
        );
      });
    });

    Category.findOne({ name: req.body.category }, function (
      err,
      foundCategory
    ) {
      Article.findOne({ _id: req.body.articleID }, function (
        err,
        foundArticle
      ) {
        let foundCategoryArr = foundCategory.articles;

        foundCategoryArr.forEach((each) => {
          if (each._id.equals(req.body.articleID)) {
            foundCategoryArr.splice(
              foundCategoryArr.indexOf(each),
              1,
              foundArticle
            );
          }
        });

        Category.updateOne(
          { name: req.body.category },
          { articles: foundCategoryArr },
          function (err, found) {}
        );
      });
    }).then(() => {
      Field.findOne({ name: req.body.field }, function (err, field) {
        Category.findOne({ name: req.body.category }, function (
          err,
          newCategory
        ) {
          let newFieldCategories = field.categories;

          newFieldCategories.forEach((each) => {
            if (each.name === req.body.category) {
              newFieldCategories.splice(
                newFieldCategories.indexOf(each),
                1,
                newCategory
              );
            }
          });

          Field.updateOne(
            { name: req.body.field },
            { categories: newFieldCategories },
            function (err, found) {}
          );
        });
      });
    });
  });

  console.log("Reassign Editor");
});

// ASSIGN FIELD & CATEGORY TO EDITOR API

app.post("/fieldCatEditor", function (req, res) {
  console.log(req.body.email);
  console.log(req.body.field);
  console.log(req.body.category);

  User.find({ email: req.body.email }, function (err, user) {
    User.updateOne(
      { email: req.body.email },
      { field: req.body.field, category: req.body.category },
      function (err, foundUser) {
        console.log("Successfully assign field and category to this editor.");
      }
    );
  });
});

//-----------------------------------------------//
//                  EDITOR API                   //
//-----------------------------------------------//

// ASSIGN ARTICLE TO REVIWER API

app.post("/assignReviewer", function (req, res) {
  console.log("Assign Reviewer");

  let reviewer = Array;

  if (req.body.reviewer3 === "") {
    reviewer = [req.body.reviewer1, req.body.reviewer2];
  } else {
    reviewer = [req.body.reviewer1, req.body.reviewer2, req.body.reviewer3];
  }

  Article.findOne({ _id: req.body.articleID }, function (err, foundArticle) {
    Article.updateOne(
      { _id: req.body.articleID },
      { reviewer: reviewer, status: "Reviewing", dateline: req.body.dateline },
      function (err, found) {
        console.log("New Article is assigned to reviewers");
      }
    );
  }).then(() => {
    User.find({}, function (err, userData) {
      Article.findOne({ _id: req.body.articleID }, function (
        err,
        foundArticle
      ) {
        userData.forEach((user) => {
          let userArticles = user.articles;

          userArticles.forEach((article) => {
            if (article._id.equals(req.body.articleID)) {
              userArticles.splice(
                userArticles.indexOf(article),
                1,
                foundArticle
              );

              console.log(user.email);
            }
          });

          User.updateOne(
            { email: user.email },
            { articles: userArticles },
            () => {}
          );
        });
      });
    });

    User.findOne({ email: req.body.reviewer1 }, function (err, foundUser) {
      Article.findOne({ _id: req.body.articleID }, function (
        err,
        foundArticle
      ) {
        User.updateOne(
          { email: req.body.reviewer1 },
          { articles: [...foundUser.articles, foundArticle] },
          function (err, found) {
            console.log("New Article is assigned to an editor");
          }
        );
      });
    });

    User.findOne({ email: req.body.reviewer2 }, function (err, foundUser) {
      Article.findOne({ _id: req.body.articleID }, function (
        err,
        foundArticle
      ) {
        User.updateOne(
          { email: req.body.reviewer2 },
          { articles: [...foundUser.articles, foundArticle] },
          function (err, found) {
            console.log("New Article is assigned to an editor");
          }
        );
      });
    });

    if (!(req.body.reviewer3 === "")) {
      User.findOne({ email: req.body.reviewer3 }, function (err, foundUser) {
        Article.findOne({ _id: req.body.articleID }, function (
          err,
          foundArticle
        ) {
          User.updateOne(
            { email: req.body.reviewer3 },
            { articles: [...foundUser.articles, foundArticle] },
            function (err, found) {
              console.log("New Article is assigned to an editor");
            }
          );
        });
      });
    }

    Category.findOne({ name: req.body.category }, function (
      err,
      foundCategory
    ) {
      Article.findOne({ _id: req.body.articleID }, function (
        err,
        foundArticle
      ) {
        let foundCategoryArr = foundCategory.articles;

        foundCategoryArr.forEach((each) => {
          if (each._id.equals(req.body.articleID)) {
            foundCategoryArr.splice(
              foundCategoryArr.indexOf(each),
              1,
              foundArticle
            );
          }
        });

        Category.updateOne(
          { name: req.body.category },
          { articles: foundCategoryArr },
          function (err, found) {
            console.log("New Article assigned to an editor");
          }
        );
      });
    }).then(() => {
      Field.findOne({ name: req.body.field }, function (err, field) {
        Category.findOne({ name: req.body.category }, function (
          err,
          newCategory
        ) {
          let newFieldCategories = field.categories;

          newFieldCategories.forEach((each) => {
            if (each.name === req.body.category) {
              newFieldCategories.splice(
                newFieldCategories.indexOf(each),
                1,
                newCategory
              );
            }
          });

          Field.updateOne(
            { name: req.body.field },
            { categories: newFieldCategories },
            function (err, found) {}
          );
        });
      });
    });
  });

  console.log("Assign Reviewer");
});

//-----------------------------------------------//
//                  EDITOR API                   //
//-----------------------------------------------//

app.post("/rejectArticle", function (req, res) {
  console.log("reject Article");

  Article.findOne({ _id: req.body.articleID }, function (err, foundArticle) {
    Article.updateOne(
      { _id: req.body.articleID },
      { status: "Rejected" },
      function (err, found) {
        console.log("Successfully reject an article. (By Editor)");
      }
    ).then(() => {
      User.find({}, function (err, userData) {
        Article.findOne({ _id: req.body.articleID }, function (
          err,
          foundArticle
        ) {
          userData.forEach((user) => {
            let userArticles = user.articles;

            userArticles.forEach((article) => {
              if (article._id.equals(req.body.articleID)) {
                userArticles.splice(
                  userArticles.indexOf(article),
                  1,
                  foundArticle
                );

                console.log(user.email);
              }
            });

            User.updateOne(
              { email: user.email },
              { articles: userArticles },
              () => {}
            );
          });
        });
      });

      Category.findOne({ name: req.body.category }, function (
        err,
        foundCategory
      ) {
        Article.findOne({ _id: req.body.articleID }, function (
          err,
          foundArticle
        ) {
          let foundCategoryArr = foundCategory.articles;

          foundCategoryArr.forEach((each) => {
            if (each._id.equals(req.body.articleID)) {
              foundCategoryArr.splice(
                foundCategoryArr.indexOf(each),
                1,
                foundArticle
              );
            }
          });

          Category.updateOne(
            { name: req.body.category },
            { articles: foundCategoryArr },
            function (err, found) {
              console.log("New Article assigned to an editor");
            }
          );
        });
      }).then(() => {
        Field.findOne({ name: req.body.field }, function (err, field) {
          Category.findOne({ name: req.body.category }, function (
            err,
            newCategory
          ) {
            let newFieldCategories = field.categories;

            newFieldCategories.forEach((each) => {
              if (each.name === req.body.category) {
                newFieldCategories.splice(
                  newFieldCategories.indexOf(each),
                  1,
                  newCategory
                );
              }
            });

            Field.updateOne(
              { name: req.body.field },
              { categories: newFieldCategories },
              function (err, found) {}
            );
          });
        });
      });
    });
  });

  console.log("reject Article");
});

app.post("/publishArticle", function (req, res) {
  console.log("publish Article");

  Article.findOne({ _id: req.body.articleID }, function (err, foundArticle) {
    Article.updateOne(
      { _id: req.body.articleID },
      { status: "Published" },
      function (err, found) {
        console.log("Successfully published an article.");
      }
    ).then(() => {
      User.find({}, function (err, userData) {
        Article.findOne({ _id: req.body.articleID }, function (
          err,
          foundArticle
        ) {
          userData.forEach((user) => {
            let userArticles = user.articles;

            userArticles.forEach((article) => {
              if (article._id.equals(req.body.articleID)) {
                userArticles.splice(
                  userArticles.indexOf(article),
                  1,
                  foundArticle
                );

                console.log(user.email);
              }
            });

            User.updateOne(
              { email: user.email },
              { articles: userArticles },
              () => {}
            );
          });
        });
      });

      Category.findOne({ name: req.body.category }, function (
        err,
        foundCategory
      ) {
        Article.findOne({ _id: req.body.articleID }, function (
          err,
          foundArticle
        ) {
          let foundCategoryArr = foundCategory.articles;

          foundCategoryArr.forEach((each) => {
            if (each._id.equals(req.body.articleID)) {
              foundCategoryArr.splice(
                foundCategoryArr.indexOf(each),
                1,
                foundArticle
              );
            }
          });

          Category.updateOne(
            { name: req.body.category },
            { articles: foundCategoryArr },
            function (err, found) {}
          );
        });
      }).then(() => {
        Field.findOne({ name: req.body.field }, function (err, field) {
          Category.findOne({ name: req.body.category }, function (
            err,
            newCategory
          ) {
            let newFieldCategories = field.categories;

            newFieldCategories.forEach((each) => {
              if (each.name === req.body.category) {
                newFieldCategories.splice(
                  newFieldCategories.indexOf(each),
                  1,
                  newCategory
                );
              }
            });

            Field.updateOne(
              { name: req.body.field },
              { categories: newFieldCategories },
              function (err, found) {}
            );
          });
        });
      });
    });
  });

  console.log("publish Article");
});

//-----------------------------------------------//
//                 REVIEWER API                  //
//-----------------------------------------------//

app.post("/setNote", function (req, res) {
  const noteObject = {
    email: req.body.email,
    note: req.body.note
  };

  Article.findOne({ _id: req.body.articleID }, function (err, foundArticle) {
    let newArr = foundArticle.notes;
    console.log("newArr");
    console.log(newArr);

    Article.updateOne(
      { _id: req.body.articleID },
      { notes: [...newArr, noteObject] },
      function (err, found) {
        console.log("A note successfully added to an article");
      }
    );
  }).then(() => {
    Article.findOne({ _id: req.body.articleID }, function (err, foundArticle) {
      let noteLength = foundArticle.notes.length;
      let reviewerLength = foundArticle.reviewer.length;
      if (noteLength === reviewerLength) {
        Article.updateOne(
          { _id: req.body.articleID },
          { status: "Reviewed", dateline: null },
          function (err, done) {
            if (err) {
              console.log(err);
            } else {
              console.log(done);
            }
          }
        );
      }
    }).then(() => {
      User.find({}, function (err, userData) {
        Article.findOne({ _id: req.body.articleID }, function (
          err,
          foundArticle
        ) {
          userData.forEach((user) => {
            let userArticles = user.articles;

            userArticles.forEach((article) => {
              if (article._id.equals(req.body.articleID)) {
                userArticles.splice(
                  userArticles.indexOf(article),
                  1,
                  foundArticle
                );
              }
            });

            User.updateOne(
              { email: user.email },
              { articles: userArticles },
              () => {}
            );
          });
        });
      });

      Category.findOne({ name: req.body.category }, function (
        err,
        foundCategory
      ) {
        Article.findOne({ _id: req.body.articleID }, function (
          err,
          foundArticle
        ) {
          let foundCategoryArr = foundCategory.articles;

          foundCategoryArr.forEach((each) => {
            if (each._id.equals(req.body.articleID)) {
              foundCategoryArr.splice(
                foundCategoryArr.indexOf(each),
                1,
                foundArticle
              );
            }
          });

          Category.updateOne(
            { name: req.body.category },
            { articles: foundCategoryArr },
            function (err, found) {
              console.log("A note successfully added to an article");
            }
          );
        });
      }).then(() => {
        Field.findOne({ name: req.body.field }, function (err, field) {
          Category.findOne({ name: req.body.category }, function (
            err,
            newCategory
          ) {
            let newFieldCategories = field.categories;

            newFieldCategories.forEach((each) => {
              if (each.name === req.body.category) {
                newFieldCategories.splice(
                  newFieldCategories.indexOf(each),
                  1,
                  newCategory
                );
              }
            });

            Field.updateOne(
              { name: req.body.field },
              { categories: newFieldCategories },
              function (err, found) {}
            );
          });
        });
      });
    });
  });
});

//-----------------------------------------------//
//                  PORT LISTEN                  //
//-----------------------------------------------//

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});