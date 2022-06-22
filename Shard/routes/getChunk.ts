import * as express from "express";
import clc from "cli-color";
import axios from "axios";

export const getchunkdata = (app: express.Application, client: any) => {
  app.post("/api/auth/create", async (req, res) => {
    let { field, fieldname, key } = req.body;
    if (!field || !fieldname || !key)
      return res.status(400).send({ error: "Invalid Shard data" });
    if (key != process.env.API_KEY)
      return res.status(401).send({ error: "Invalid API key" });


    
    
  });
};
