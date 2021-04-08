const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(bodyParser())
app.use(cors())
const port = 5000 || process.env.PORT;
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb').ObjectID;


// const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.rf1wp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rf1wp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const carCollection = client.db("carmia").collection("cars");
  const ordersCollection = client.db("carmia").collection("orders");
  // perform actions on the collection object
  app.post('/addCar', (req, res) => {
    const car = req.body;
    carCollection.insertOne(car)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    console.log(car);
    
  })


  app.get('/getCars',(req,res)=>{
    carCollection.find()
    .toArray((err, data)=>{
       res.send(data)
      
    })
  })
  app.get('/getOrders',(req,res)=>{
    const email = req.query.email;
    console.log(email);
    ordersCollection.find({email:email})
    .toArray((err, data)=>{
       res.send(data)
      console.log(data);
    })
  })

  // app.get('/getCarById',(req,res)=>{
  //   const id = ObjectID(req.query.id)
  //   carCollection.find({_id:id})
  //   .toArray((err,documents)=>{
  //     res.send(documents)
  //   })
  // })
  
  app.get('/deleteCar',(req,res)=>{
    const id = ObjectID(req.query.id)
    carCollection.deleteOne({_id:id})
    .then(result => res.send(result))
  })

  app.get('/car/:id', (req,res)=>{
    const id = ObjectID(req.params.id)
    carCollection.find({_id:id})
    .toArray((err, documents)=>{
        res.send(documents[0])
        // console.log(documents[0])
    })
  })

    app.post('/addOrder',(req,res)=>{
      ordersCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount>0)
      })
    })
    


  //  client.close();
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})