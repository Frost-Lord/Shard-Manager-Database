import * as express from "express";
import ShardSchema from "../Database/Schema/shards";
import ShardDataSchema from "Database/Schema/ShardData";
import clc from "cli-color";
import axios from "axios";

export const registerdelete = (app: express.Application, client: any) => {
  app.post("/api/auth/delete", async (req, res) => {
    let { field, key } = req.body;
    if (!field || !key)
      return res.status(400).send({ error: "Invalid Shard data" });
    if (key != process.env.API_KEY)
      return res.status(401).send({ error: "Invalid API key" });

      let shards = await ShardSchema.find();
      shards.forEach((shard: any) => {
        const url = `http://${shard.ip}:${shard.port}/api/auth/delete`;
        axios.post(url, {
          fieldName: field,
          key: process.env.API_KEY
        });
      });
      return res.status(200).send({ message: "Successfully deleted" });
  });
};
