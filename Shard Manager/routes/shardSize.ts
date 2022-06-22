import * as express from "express";
import ShardSchema from "../Database/Schema/shards";
import clc from "cli-color";

export const ShardSize = (app: express.Application, client: any) => {
  app.post("/api/shardsize", async (req, res) => {
    let { key } = req.body;
    if (!key)
      return res.status(400).send({ error: "Invalid Shard data" });
    if (key != process.env.API_KEY)
      return res.status(401).send({ error: "Invalid API key" });

      let shards = await ShardSchema.find();
      let shardsSize = shards.length;
      console.log(clc.green("Event [ShardSize]: " + shardsSize));
      if (shardsSize == 0) {
        let shardsSize = 0;
        return res.json({shardsSize});    
      }
      return res.json({shardsSize});    
  });
};
