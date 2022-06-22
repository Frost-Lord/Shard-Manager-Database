import * as express from "express";
import ShardSchema from "../Database/Schema/shards";
import ShardDataSchema from "Database/Schema/ShardData";
import clc from "cli-color";
import axios from "axios";
import Cryptr from "cryptr";
const hashkey = new Cryptr(`${process.env.API_KEY}`);

export const getchunkdata = (app: express.Application, client: any) => {
  app.post("/api/auth/create", async (req, res) => {
    let { field, fieldname, key } = req.body;
    if (!field || !fieldname || !key)
      return res.status(400).send({ error: "Invalid Shard data" });
    if (key != process.env.API_KEY)
      return res.status(401).send({ error: "Invalid API key" });

    let shards = await ShardSchema.find();
    let chunks: string[] = [];
    shards.forEach((shard: any) => {
      const url = `http://${shard.ip}:${shard.port}/api/auth/create`;
      axios.post(url, {
         key: process.env.API_KEY,
      }).then((response: any) => {
        const decryptedString = hashkey.decrypt(response.data.field);
        chunks.push(decryptedString);
      }).catch((error: any) => {
        console.log(error);
      });
    });
    let finalField = chunks.join("");

    return res.status(200).send({ field: finalField });
  });
};
