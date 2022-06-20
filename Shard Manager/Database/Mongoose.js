UserSchema = require("./Schema/shards.js"),
module.exports.fetchGuild = async function(key){

    let guildDB = await UserSchema.findOne({ name: key });

    if(guildDB){
        return guildDB;
    }else{
        guildDB = new UserSchema({
            name: key,
            ip: "127.0.0.0",
            port: "3000",
            registeredAt: Date.now()
        })
        await guildDB.save().catch(err => console.log(err));
        return guildDB;
    }
};