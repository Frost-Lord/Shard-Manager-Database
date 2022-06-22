import * as express from "express";
import ShardSchema from "../Database/Schema/shards";
import ShardDataSchema from "Database/Schema/ShardData";
import clc from "cli-color";
import axios from "axios";
import Cryptr from "cryptr";
const hashkey = new Cryptr(`${process.env.API_KEY}`);

export const registercreate = (app: express.Application, client: any) => {
  app.post("/api/auth/create", async (req, res) => {
    let { field, fieldname, key } = req.body;
    if (!field || !fieldname || !key)
      return res.status(400).send({ error: "Invalid Shard data" });
    if (key != process.env.API_KEY)
      return res.status(401).send({ error: "Invalid API key" });

      let shards = await ShardSchema.find();
      let shardsSize = shards.length;
      let chunks = [];
      for (let i = 0; i < shardsSize; i++) {
        chunks.push(field.slice(i * (field.length / shardsSize), (i + 1) * (field.length / shardsSize)));
      }
      console.log(clc.bgGreenBright("Event [Shard]: Creating shards..."));
      chunks.forEach((chunk: string) => {
        const encryptedString = hashkey.encrypt(chunk);
        shards.forEach((shard: any) => {
          const url = `http://${shard.ip}:${shard.port}/api/auth/create`;
          axios.post(url, {
            field: encryptedString,
            fieldname: fieldname,
            key: process.env.API_KEY
          });
        });
      });  
      return res.status(200).send({ message: "Successfully Created data" });    
  });
};
