import * as express from "express";
import clc from "cli-color";

export const registercreate = async (app: express.Application, client: any) => {
  app.post("/api/auth/create", async (req, res) => {
    let { field, fieldName, key } = req.body;
    if (!field || !fieldName || !key)
      return res.status(400).send({ error: "Invalid Shard data" });
    if (key != process.env.API_KEY)
      return res.status(401).send({ error: "Invalid API key" });


      client.set(fieldName, field, (err: string, reply: string) => {
        if (err) {
          console.log(clc.red(err));
          return res.status(500).send({ error: "Error saving data" });
        }
        console.log(clc.green(reply));
        return res.status(200).send({ success: "Data saved" });
      });
      
      
  });
};
