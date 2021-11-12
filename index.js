const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

// mongodb clint and uri link;
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.jgifu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("MotorCycleVally");
    const motorCycleCollection = database.collection("motorCycleCollection");
    const userCollection = database.collection("UserCollection");
    const orderdBiekCollection = database.collection("orderdBiekCollection");
    const feedbackCollection = database.collection("feedbackCollection");

    //    get all data from motorCycleCollection database
    app.get("/motorcycels", async (req, res) => {
      const result = await motorCycleCollection.find({}).toArray();
      res.json(result);
    });
    // get all review
    app.get("/feedback", async (req, res) => {
      const result = await feedbackCollection.find({}).toArray();
      res.json(result);
    });

    // Add new Bike collection
    app.post("/addABike", async (req, res) => {
      const bike = req.body.newBike;
      const result = await motorCycleCollection.insertOne(bike);

      res.json(result);
    });

    // Add a new review
    app.post("/addReview", async (req, res) => {
      const feedback = req.body.feedback;
      const result = await feedbackCollection.insertOne(feedback);
      res.json(result);
    });

    // get specific data useing id
    app.get("/motorcycels/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await motorCycleCollection.findOne(query);
      res.json(result);
    });

    // save user in database  email and passsword
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    // save user in database  google login
    app.put("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    // save purcessed biek and buyer information in database
    app.post("/orderdBiek", async (req, res) => {
      const bike = req.body;
      const result = await orderdBiekCollection.insertOne(bike);
      res.json(result);
    });

    // get all order bike
    app.get("/allorderdBieks", async (req, res) => {
      const result = await orderdBiekCollection.find({}).toArray();
      res.json(result);
    });
    // get order bike using user email
    app.get("/orderdBiek", async (req, res) => {
      const email = req.query.email;
      const coursor = { Buyeremail: email };

      const result = await orderdBiekCollection.find(coursor).toArray();
      res.json(result);
    });
    // update delevary status
    app.put("/orderbike", async (req, res) => {
      const bike = req.body;
      console.log(bike);
      const id = bike._id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      delete bike._id;
      const updateDoc = {
        $set: bike,
      };
      const result = await orderdBiekCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // update Price
    app.put("/updatePrice", async (req, res) => {
      const updateinfo = req.body;
      console.log(updateinfo);
      const id = updateinfo._id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      delete updateinfo._id;
      const updateDoc = {
        $set: updateinfo,
      };
      const result = await motorCycleCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // delete an item useing id
    app.delete("/bikeCollection/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await motorCycleCollection.deleteOne(query);
      res.json(result);
    });
    // delete an item useing id
    app.delete("/orderdBiek/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderdBiekCollection.deleteOne(query);
      res.json(result);
    });
    // make admin
    app.put("/users/admin", async (req, res) => {
      const email = req.body.email;
      const filter = { email: email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // check admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      if (email) {
        const coursor = { email: email };
        const user = await userCollection.findOne(coursor);
        let isAdmin = false;
        if (user?.role === "admin") {
          isAdmin = true;
        }
        res.json({ admin: isAdmin });
      }
    });
  } finally {
    //    await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello !");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
