const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

var db, collection;

const url =
  "mongodb+srv://pdot:Nono0707@cluster0.axdot4f.mongodb.net/CoinFlip?retryWrites=true&w=majority";
const dbName = "CoinFlip";

app.listen(3000, () => {
  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      db = client.db(dbName);
      console.log("Connected to `" + dbName + "`!");
    }
  );
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  db.collection("results")
    .find()
    .toArray((err, allDocuments) => {
      if (err) return console.log(err);
      res.render("index.ejs", { coinFlipResults: allDocuments });
    });
});

app.post("/results", (req, res) => {
  let myArray = ["heads", "tails"];
  let botCoin = myArray[Math.floor(Math.random() * myArray.length)];

  let outcome;

  if (botCoin == req.body.userGuess) {
    outcome = "-Are you a Wizard ?";
  } else {
    outcome = "-Guess Again Loser!";
  }

  // insert code logic here

  db.collection("results").insertOne(
    {
      userGuess: req.body.userGuess,
      coinFlipResult: botCoin,
      winOrLose: outcome,
    },
    (err, result) => {
      if (err) return console.log(err);
      console.log("saved to database");
      res.redirect("/");
    }
  );
});

// app.put("/messages", (req, res) => {
//   db.collection("results").findOneAndUpdate(
//     { name: req.body.name, msg: req.body.msg },
//     {
//       $set: {
//         thumbUp: req.body.thumbUp + 1,
//       },
//     },
//     {
//       sort: { _id: -1 },
//       upsert: true,
//     },
//     (err, result) => {
//       if (err) return res.send(err);
//       res.send(result);
//     }
//   );
// });

app.delete("/messages", (req, res) => {
  db.collection("results").findOneAndDelete(
    { name: req.body.name, msg: req.body.msg },
    (err, result) => {
      if (err) return res.send(500, err);
      res.send("Message deleted!");
    }
  );
});
