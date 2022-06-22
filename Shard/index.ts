import express from "express";
const app = express();
import  clc from 'cli-color';
import  { createClient } from "redis";
import axios from "axios";
require('dotenv').config();
const client = createClient({
  url: process.env.redisURL,
});

(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('::> Redis Client Connected'));
client.on('error', (err: any) => console.log('<:: Redis Client Error', err));


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
//create a heartbeat to shard showing that it is online
async function heartbeat() {
  axios.post(process.env.Shard_Manager || "null", {
    ip: "120.154.2.65",
    shard: process.env.name,
    port: process.env.port,
    key: process.env.API_KEY,
}).then(res => {
    console.log(clc.greenBright(`::> Heartbeat: Shard is online`));
}).catch(err => {
    console.log(err)
    console.log(clc.redBright(`::> Heartbeat: Shard Manager is offline | Invalid data provided`));
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
console.log(clc.green("::> Heartbeat: Online"));
return res.status(200).send({ message: "Shard is online" });
});




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

