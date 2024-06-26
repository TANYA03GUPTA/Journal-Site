//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const methodOverride = require("method-override");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Feel free to reach out to us at itstanya7777@gmail.com for any inquiries, collaborations, or feedback. We welcome your thoughts and ideas as we continue to grow and improve. Additionally, you can explore our projects, contribute, or collaborate with us on GitHub here. We value your engagement and look forward to connecting with you!.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
mongoose.connect(
  "mongodb+srv://TanyaGupta:Tanya2023@cluster0.lycpt7g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, " MongoDb connection error: "));

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save();

  res.redirect("/");
});

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = req.params.postName;
  console.log(requestedTitle);
  console.log("post called");
  Post.findOne({
    title: { $regex: new RegExp("^" + requestedTitle + "$", "i") },
  }).then((post) => {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});


app.delete("/posts/:postName", function (req, res) {
  const requestedTitle = req.params.postName;

  Post.findOneAndRemove({ title: requestedTitle }, function (err) {
    if (!err) {
      console.log("Successfully deleted the post.");
      res.redirect("/"); // Redirect to home page after deletion
    } else {
      console.log(err);
      res.send("Error deleting the post.");
    }
  });
});


app.get("/resources", function (req, res) {
  res.render("resources", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.listen(3900, function () {
  console.log("Server started on port 3900");
});
