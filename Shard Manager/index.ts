import express from "express";
const app = express();
import clc from "cli-color";
import { createClient } from "redis";
import mongoose from "mongoose";
import ShardsSchema from "./Database/Schema/shards";
import * as sessionAuth from "./routes/heartbeat";
import axios from "axios";
require("dotenv").config();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(function (err: { status: any }, req: any, res: any, next: any) {
  if (!err.status) console.error(err);
  makeError(res, err.status || 500);
});
app.set("trust proxy", true);

/////////////////////////////// Database ///////////////////////////////////////
const client = createClient({
  url: process.env.redisURL,
});
(async () => {
  await client.connect();
})();

client.on("connect", () => console.log("::> Redis Client Connected"));
client.on("error", (err: any) => console.log("<:: Redis Client Error", err));
mongoose
  .connect(
    "mongodb+srv://admin:Fighting35a@cluster0.qslzd.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: string) => {
    console.log("Unable to connect to MongoDB Database.\nError: " + err);
  });
mongoose.connection.on("err", (err: { stack: any }) => {
  console.error(`Mongoose connection error: \n ${err.stack}`);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection disconnected");
});

////////////////////////////// Heart Beat //////////////////////////////////////
async function heartbeat() {
  const shardValue = await client.get("Running_shards_count");
  if (shardValue == null) {
    console.log(clc.redBright(`::> Heartbeat: No shard running`));
    return await client.set("Running_shards_count", 0);
  }

  const shards = await ShardsSchema.find({});
  if (shards.length == 0) {
    await client.set("Running_shards_count", 0);
    return console.log(clc.redBright(`::> [Heartbeat]: No shard registered`));
  }
  console.log(
    clc.yellow("::> [Heartbeat]: ") +
      clc.greenBright(`${shardValue} shard(s) running...`)
  );

  shards.forEach(async (shard: any) => {
    const shardValue = await client.get(shard.name);
    if (shardValue == null) {
      console.log(clc.redBright(`::> [Heartbeat]: No shard running`));
    }

    const url = `http://${shard.ip}:${shard.port}/heartbeat`;
    await axios
      .post(url, {
        ip: shard.ip,
        key: process.env.API_KEY,
      })
      .then(async (response) => {
        console.log(response.status);
        if (response.status == 200) {
          console.log(clc.green(`::> Heartbeat: ${shard.name} is online`));
        }
      })
      .catch(async (err) => {
        console.log(
          clc.yellow("::> [Heartbeat]: ") +
            clc.redBright(`${shard.name} is not running!`)
        );
        const shardToDelete = await ShardsSchema.findOne({ ip: shard.ip });
        if (shardToDelete) {
          await shardToDelete.remove();
          console.log(
            clc.yellow("::> [Heartbeat]: ") +
              clc.redBright(`${shard.name} has been deleted from the database!`)
          );
        } else {
          console.log(clc.redBright(`::> Heartbeat: No shard registered`));
        }
      });
  });
}
setInterval(heartbeat, 15000);

///////////////////////////////// API //////////////////////////////////////////
sessionAuth.register(app, client);

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
