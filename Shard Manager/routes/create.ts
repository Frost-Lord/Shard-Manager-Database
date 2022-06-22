import * as express from "express";
import ShardsSchema from "../Database/Schema/ShardData";
import clc from "cli-color";
import Cryptr from "cryptr";
const hashkey = new Cryptr(`${process.env.API_KEY}`);

export const registercreate = (app: express.Application, client: any) => {
  app.post("/api/auth/create", async (req, res) => {
    let { field, fieldname, key } = req.body;
    if (!field || !fieldname || !key)
      return res.status(400).send({ error: "Invalid Shard data" });
    if (key != process.env.API_KEY)
      return res.status(401).send({ error: "Invalid API key" });

      let shards = await ShardsSchema.find();
      let shardsSize = shards.length;
      let chunks = [];
      for (let i = 0; i < shardsSize; i++) {
        chunks.push(field.slice(i * (field.length / shardsSize), (i + 1) * (field.length / shardsSize)));
      }
      chunks.forEach((chunk: any) => {
        
        console.log(chunk);
      });


      const encryptedString = hashkey.encrypt('bacon');
      
  });
};
