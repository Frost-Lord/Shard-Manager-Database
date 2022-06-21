const express = require('express');
const app = express();
const clc = require("cli-color");
const cors = require("cors");
const { createClient } = require('redis');
const axios = require('axios');
require('dotenv').config();
const client = createClient({
  url: process.env.redisURL,
});

(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('::> Redis Client Connected'));
client.on('error', (err) => console.log('<:: Redis Client Error', err));


app.use(express.urlencoded({ extended: false }));
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
//create a heartbeat to shard showing that it is online
async function heartbeat() {
  axios.post(process.env.Shard-Manager, {
    ip: "0.0.0.0",
    name: process.env.name,
    port: process.env.port,
}).then(res => {
    console.log(clc.greenBright(`::> Heartbeat: Shard is online`));
}).catch(err => {
    console.log(clc.redBright(`::> Heartbeat: Shard is offline`));
});

}
heartbeat();






////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// API //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.post("/heartbeat", async (req, res) => {
let {ip , key} = req.body
if(!ip || !key) return res.status(400).send({ error: "Invalid Shard data" });
if(key != process.env.API_KEY) return res.status(401).send({ error: "Invalid API key" });
return res.send(200)  
});




/////////////////////////////// SESSION ////////////////////////////////////////
app.listen(7776, () => {
    console.log(
      "//////////////////////////////////////////////////////////////////////////////////////////////////"
    );
    console.log(clc.white("App running at:"));
    console.log(clc.blue("- Shard Manager: localhost:7776"));
    console.log(
      "//////////////////////////////////////////////////////////////////////////////////////////////////"
    );
  });
