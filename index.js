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
      const orderdBiekCollection=database.collection("orderdBiekCollection")

      //    get all data from motorCycleCollection database
      app.get("/motorcycels", async (req, res) => {
        const result = await motorCycleCollection.find({}).toArray();
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
        console.log(result)
        res.json(result)
      });
      // save user in database  google login
      app.put("/users", async (req, res) => {
        const user = res.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = {
          $set: user,
        };
        const result = await userCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.json(result);
      })
      // save purcessed biek and buyer information in database 
      app.post("/orderdBiek", async (req, res) => {
        const bike = req.body;
        const result = await orderdBiekCollection.insertOne(bike)
        res.json(result)
        
      })









    }
    finally {
    //    await client.close()
    }
}
run().catch(console.dir)




app.get("/", (req, res) => {
  res.send("Hello !");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
