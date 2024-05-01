const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// coffeshop    user
// mbncbMjN5DtYAK9j   pass
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}
:${process.env.DB_PASS}@cluster000.74jenv3.mongodb.net/
?retryWrites=true&w=majority&appName=Cluster000`;
console.log(uri);
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
    await client.connect();

    const coffeColection = client.db('coffeeDB').collection('cofffe');

app.get('/coffee', async(req, res)=>{
const cursor = coffeColection.find();
const result = await cursor.toArray();
res.send(result);
})
app.get('/coffee/:id', async(req, res) =>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}
  const result = await coffeColection.findOne(query);
  res.send(result);
})
app.put('/coffee/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options  = {upsert: true};
  const updateCoffe = req.body;
  const Coffe = {
    $set: {
      name:updateCoffe.name,
       supplier:updateCoffe.supplier,
        category:updateCoffe.category,
         chef:updateCoffe.chef,
         taste:updateCoffe.taste,
         details:updateCoffe.details,
         photo:updateCoffe.photo,
        //  email:updateCoffe.email,
        //  messege:updateCoffe.messege,
    }
  }
  const result = await coffeColection.updateOne(filter, Coffe, options);
  res.send(result);
})
  
app.post('/coffee', async(req, res)=>{
  const newCoffee = req.body;
  console.log(newCoffee)
  const result = await coffeColection.insertOne(newCoffee);
  res.send(result);
})

app.delete('/coffee/:id', async(req, res) =>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}
  const result = await coffeColection.deleteOne(query);
  res.send(result);
})
  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send("coffe makeing server is running");
})

app.listen(port, () => {
    console.log(`coffe surver running on port: ${port}`)
})