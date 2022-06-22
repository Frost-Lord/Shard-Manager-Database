import * as express from "express";
import clc from "cli-color";

export const registerdelete = async (app: express.Application, client: any) => {
  app.post("/api/auth/delete", async (req, res) => {
    let { fieldName, key } = req.body;
    if (!fieldName || !key)
      return res.status(400).send({ error: "Invalid Shard data" });
    if (key != process.env.API_KEY)
      return res.status(401).send({ error: "Invalid API key" });

    client.del(fieldName, (err: string, reply: string) => {
      if (err) {
        console.log(clc.red(err));
        return res.status(500).send({ error: "Error deleting data" });
      }
      console.log(clc.green(reply));
      return res.status(200).send({ success: "Data deleted" });
    });
      
  });
};
