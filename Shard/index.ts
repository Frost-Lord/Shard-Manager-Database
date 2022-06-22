import express from "express";
const app = express();
import  clc from 'cli-color';
import  { createClient } from "redis";
import axios from "axios";
require('dotenv').config();
import * as sessionAuth from "./routes/heartbeat";
let extIP = require("ext-ip")();
 
const client = createClient({
  url: process.env.redisURL,
});
(async () => {
    await client.connect();
})();
client.on('connect', () => console.log('::> Redis Client Connected'));
client.on('error', (err: string) => console.log('<:: Redis Client Error', err));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(function (err: { status: number}, res: any) {
  if (!err.status) console.error(err);
  makeError(res, err.status || 500);
});
app.set("trust proxy", true);


////////////////////////////// Heart Beat //////////////////////////////////////
async function heartbeat() {
  extIP.get().then((ip: string) => {
  axios.post(process.env.Shard_Manager || "null", {
    ip: ip,
    shard: process.env.name,
    port: process.env.port,
    key: process.env.API_KEY,
}).then(res => {
    console.log(clc.greenBright(`::> Heartbeat: Shard is online`));
}).catch(err => {
    console.log(err)
    console.log(clc.redBright(`::> Heartbeat: Shard Manager is offline | Invalid data provided`));
});
}, (err: string) => {
  console.error(err);
});
}
heartbeat();

///////////////////////////////// API //////////////////////////////////////////
sessionAuth.register(app, client);


/////////////////////////////// SESSION ////////////////////////////////////////
app.listen(process.env.port, () => {
    console.log(
      "//////////////////////////////////////////////////////////////////////////////////////////////////"
    );
    console.log(clc.white("App running at:"));
    console.log(clc.blue("- Shard Manager: localhost:3000"));
    console.log(
      "//////////////////////////////////////////////////////////////////////////////////////////////////"
    );
  });
function makeError(res: any, arg1: any) {
  throw new Error("Function not implemented.");
}

function ip(ip: any, arg1: (string: any) => void, arg2: (err: any) => void) {
  throw new Error("Function not implemented.");
}

