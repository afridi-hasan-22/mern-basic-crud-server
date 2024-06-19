const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Services are coming");
});
// afrididcc6251
// 9YW53ZQqGrWSIlRi

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.smjazix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db("services").collection("service");

    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    });

    app.get('/services/:id', async(req,res)=> {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await serviceCollection.findOne(query);
        res.send(result)
    });

    app.put('/services/:id', async(req,res)=> {
        const id = req.params.id;
        const updatedService = req.body;
        const option = {
            upsert : true,
        }
        const query = {_id : new ObjectId(id)}
        const serviceData = {
            $set : {
                name : updatedService.name,
                email : updatedService.email,
                message : updatedService.message
            }
        }
        console.log(updatedService);
        const result = await serviceCollection.updateOne(query, serviceData, option, );
        res.send(result)
    });

     app.delete('/services/:id', async(req,res)=> {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await serviceCollection.deleteOne(query);
        res.send(result)
     })

    // Send a ping to confirm a successful connection
    await client.db("services").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
