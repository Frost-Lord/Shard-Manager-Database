import ShardSchema from "./Schema/shards.js"

module.exports.fetchGuild = async function(key: any){

    let guildDB = await ShardSchema.findOne({ name: key });

    if(guildDB){
        return guildDB;
    }else{
        guildDB = new ShardSchema({
            name: key,
            ip: "127.0.0.0",
            port: "3000",
            registeredAt: Date.now()
        })
        await guildDB.save().catch((err: any) => console.log(err));
        return guildDB;
    }
};