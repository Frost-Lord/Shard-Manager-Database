import ShardSchema from "./Schema/shards.js"
import ShardDataSchema from "./Schema/ShardData.js"

module.exports.fetchShard = async function(key: any){

    let data = await ShardSchema.findOne({ name: key });

    if(data){
        return data;
    }else{
        data = new ShardSchema({
            name: key,
            ip: "127.0.0.0",
            port: "3000",
            registeredAt: Date.now()
        })
        await data.save().catch((err: any) => console.log(err));
        return data;
    }
};

module.exports.fetchShardata = async function(key: any){

    let data = await ShardDataSchema.findOne({ fieldname: key });

    if(data){
        return data;
    }else{
        data = new ShardDataSchema({
            fieldname: key,
            field: "null",
            registeredAt: Date.now()
        })
        await data.save().catch((err: any) => console.log(err));
        return data;
    }
};