import * as express from "express";
import clc from "cli-color";

export const register = (app: express.Application, client: any) => {
  app.post("/heartbeat", async (req, res) => {
    let {ip , key} = req.body;
    if(!ip || !key) return res.status(400).send({ error: "Invalid Shard data" });
    if(key != process.env.API_KEY) return res.status(401).send({ error: "Invalid API key" });
    console.log(clc.green("::> Heartbeat: Online"));
    return res.status(200).send({ message: "Shard is online" });
    });
};
