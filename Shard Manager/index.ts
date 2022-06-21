import express from "express";
const app = express();
import  clc from 'cli-color';
import  { createClient } from "redis";
import  mongoose from 'mongoose';
import  ShardsSchema from "./Database/Schema/shards";
import axios from "axios";
require('dotenv').config();

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Database ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
const client = createClient({
  url: process.env.redisURL,
});

(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('::> Redis Client Connected'));
client.on('error', (err: any) => console.log('<:: Redis Client Error', err));


mongoose.connect("mongodb://localhost:27017/shardmanager").then(() => {
    console.log('Connected to MongoDB')
}).catch((err: string) => {
    console.log('Unable to connect to MongoDB Database.\nError: ' + err)
})
mongoose.connection.on("err", (err: { stack: any; }) => {
  console.error(`Mongoose connection error: \n ${err.stack}`);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection disconnected");
});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Express /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(function (err: { status: any; }, req: any, res: any, next: any) {
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

        const shards = await ShardsSchema.find({});
        if (shards.length == 0) {
            return console.log(clc.redBright(`::> Heartbeat: No shard registered`));
        }

        shards.forEach(async (shard: any) => {

            const shardValue = await client.get(shard.name);
            if (shardValue == null) {
                console.log(clc.redBright(`::> Heartbeat: No shard running`));
                await client.set(shard.name, 0);
            }

            const url = `http://${shard.ip}/${shard.port}/heartbeat`;
            const response = await axios.post(url, {
                ip: shard.ip,
                key: process.env.API_KEY,
            }).catch(async (err) => {
                console.log(clc.yellow("::> [Heartbeat]: ") + clc.redBright(`${shard.name} is not running!`));
                client.set(shard.name, 0);
                const shardToDelete = await ShardsSchema.findOne({ip: shard.ip});
                if (shardToDelete) {
                    await shardToDelete.remove();
                    console.log(clc.yellow("::> [Heartbeat]: ") + clc.redBright(`${shard.name} has been deleted from the database!`));
                } else {
                    console.log(clc.redBright(`::> Heartbeat: No shard registered`));
                }
            });
            if (response) {
              console.log(clc.redBright(`::> Heartbeat: ${shard.name} is offline`));
            }
          });

    }
    setInterval(heartbeat, 15000);
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// API //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////// 
    app.post("/api/auth/heartbeat", async (req, res) => {
      let {shard , ip , key, port} = req.body
      console.log(shard, ip, key, port);
      if(!shard || !ip || !key || !port) return res.status(400).send({ error: "Invalid Shard data" });
      if(key != process.env.API_KEY) return res.status(401).send({ error: "Invalid API key" });
      let user = await ShardsSchema.findOne({ip: ip})
      if(user) {
        await ShardsSchema.updateOne({ip: ip}, {$set: {name: shard}})
        await client.set(shard, ip);
        await client.set(shard + '_last_heartbeat', Date.now());
        let dataa = await client.get('Running_shards_count') || null
        if(dataa == null) {  }
        else {
          await client.set('Running_shards_count', dataa + 1);
        }
        console.log(clc.green("Event [Shard]: " + shard))
        return res.status(200).send({ message: "Shard updated" });
      } else {
      let localshard = new ShardsSchema({
          name: shard,
          ip: ip,
          port: port,
      })
      await localshard.save()
      console.log(clc.green("Event [Shard]: " + shard))
      }
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
function makeError(res: any, arg1: any) {
  throw new Error("Function not implemented.");
}

