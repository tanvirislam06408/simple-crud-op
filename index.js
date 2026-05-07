const express = require('express');
const cors = require('cors');
// without it i got an err (faa man)
require('dotenv').config()


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
  res.send('hello from server')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSS}@cluster0.mndvni1.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db('simpleCrud').collection('users');

    app.get('/users', async (req, res) => {
      const cursor = database.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const result = await database.findOne(query)
      res.send(result)

    })

    // post 
    app.post('/users', async (req, res) => {
      const newUser = req.body;

      // user to be inserted
      console.log(newUser)


      const result = await database.insertOne(newUser);
      res.send(result);
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const result = await database.deleteOne(query);
      res.send(result);
    })

    // update-user
    app.patch('/users/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {
        _id: new ObjectId(id)
      }
      const modifiedInfo = req.body;
      const updatedDoc = {
        $set: {
          name: modifiedInfo.name,
          email: modifiedInfo.email,
          role: modifiedInfo.role
        }
      }

      const result = await database.updateOne(filter,updatedDoc);
      res.send(result)


    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.listen(port, () => {
  console.log(`hello from ${port}`);

})