const express = require('express');
const app = express();
const clc = require("cli-color");
const cors = require("cors");
const { createClient } = require('redis');

const client = createClient({
  url: "redis://:Fighting35a@103.21.52.122:6379",
});

(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('::> Redis Client Connected'));
client.on('error', (err) => console.log('<:: Redis Client Error', err));


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
        console.log(clc.greenBright(`::> Heartbeat: ${shardValue} shard(s) running...`));
    }
    setInterval(heartbeat, 10000);







////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// API //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////













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