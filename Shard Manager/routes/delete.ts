import * as express from "express";
import ShardsSchema from "../Database/Schema/shards";
import clc from "cli-color";
import Cryptr from "cryptr";
const hashkey = new Cryptr(`${process.env.API_KEY}`);

export const registerdelete = (app: express.Application, client: any) => {
  app.post("/api/auth/delete", async (req, res) => {
    let { field, key } = req.body;
    if (!field || !key)
      return res.status(400).send({ error: "Invalid Shard data" });
    if (key != process.env.API_KEY)
      return res.status(401).send({ error: "Invalid API key" });

      
  });
};
