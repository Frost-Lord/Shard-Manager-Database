import * as express from "express";
import ShardsSchema from "../Database/Schema/shards";
import clc from "cli-color";

export const register = (app: express.Application, client: any) => {
  app.post("/api/auth/heartbeat", async (req, res) => {
    let { shard, ip, key, port } = req.body;
    if (!shard || !ip || !key || !port)
      return res.status(400).send({ error: "Invalid Shard data" });
    if (key != process.env.API_KEY)
      return res.status(401).send({ error: "Invalid API key" });
    let user = await ShardsSchema.findOne({ ip: ip });
    if (user) {
      await ShardsSchema.updateOne({ ip: ip }, { $set: { name: shard } });
      await client.set(shard + "_last_heartbeat", Date.now());
      console.log(clc.green("Event [Shard]: " + shard));
      return res.status(200).send({ message: "Shard updated" });
    } else {
      await client.set("Running_shards_count", +1);
      let localshard = new ShardsSchema({
        name: shard,
        ip: ip,
        port: port,
      });
      await localshard.save();
      console.log(clc.green("Event [Shard]: " + shard));
    }
  });
};
