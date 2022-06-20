const express = require('express');
const app = express();
const clc = require("cli-color");
const cors = require("cors");
const { createClient } = require('redis');
const mongoose = require('mongoose');
const ShardsSchema = require("./Database/Schema/shards.js");

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Database ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
const client = createClient({
  url: "redis://:Fighting35a@103.21.52.122:6379",
});

(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('::> Redis Client Connected'));
client.on('error', (err) => console.log('<:: Redis Client Error', err));


mongoose.connect("mongodb://localhost:27017/shardmanager", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.log('Unable to connect to MongoDB Database.\nError: ' + err)
})
mongoose.connection.on("err", err => {
  console.error(`Mongoose connection error: \n ${err.stack}`);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection disconnected");
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Express /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: false }));
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(function (err, req, res, next) {
  if (!err.status) console.error(err);
  makeError(res, err.status || 500);
});
app.set("trust proxy", true);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Heart Beat //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
  async function heartbeat() {
    const shardValue = await client.get('Running_shards_count');
        if (shardValue == null) {
            console.log(clc.redBright(`::> Heartbeat: No shard running`));
            await client.set('Running_shards_count', 0);
        }
        console.log(clc.yellow("::> [Heartbeat]: ") + clc.greenBright(`${shardValue} shard(s) running...`));

        //get each shards from ShardsSchema and there data
        const shards = await ShardsSchema.find({});
        if (shards.length == 0) {
            console.log(clc.redBright(`::> Heartbeat: No shard registered`));
        }
        shards.forEach(async (shard) => {
            const shardValue = await client.get(shard.name);
            if (shardValue == null) {
                console.log(clc.redBright(`::> Heartbeat: No shard running`));
                await client.set(shard.name, 0);
            }
          });

    }
    setInterval(heartbeat, 300000);
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// API //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.post("/api/auth/heartbeat", async (req, res) => {
  let {shard , ip , key} = req.body
  console.log(shard, ip, key);
  if(!shard || !ip || !key) return res.status(400).send({ error: "Invalid Shard data" });
  if(key != process.env.API_KEY) return res.status(401).send({ error: "Invalid API key" });
  let user = await ShardsSchema.findOne({ip: ip})
  if(user) return res.send(400, "User already exists")
  let localshard = new ShardsSchema({
      name: shard,
      ip: ip
  })
  await localshard.save()
  console.log(clc.green("Event [Shard]: " + shard))
});





/////////////////////////////// SESSION ////////////////////////////////////////
app.listen(7777, () => {
    console.log(
      "//////////////////////////////////////////////////////////////////////////////////////////////////"
    );
    console.log(clc.white("App running at:"));
    console.log(clc.blue("- Shard Manager: localhost:7777"));
    console.log(
      "//////////////////////////////////////////////////////////////////////////////////////////////////"
    );
  });