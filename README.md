# Sharding:
This code will alow you to shard data across multiable shards/servers remotly in a fast an efficent manner


# Process
- CLient -> Shard manager -> Shards

# Info
Sharding is a method for distributing a single dataset across multiple databases, which can then be stored on multiple machines. This allows for larger datasets to be split in smaller chunks and stored in multiple data nodes, increasing the total storage capacity of the system. See more on the basics of sharding here. 

Similarly, by distributing the data across multiple machines, a sharded database can handle more requests than a single machine can. Sharding is a form of scaling known as horizontal scaling or scale-out, as additional nodes are brought on to share the load. Horizontal scaling allows for near-limitless scalability to handle big data and intense workloads. In contrast, vertical scaling refers to increasing the power of a single machine or single server through a more powerful CPU, increased RAM, or increased storage capacity.

# Advantages of Sharding
Sharding allows you to scale your database to handle increased load to a nearly unlimited degree by providing increased read/write throughput, storage capacity, and high availability. Let’s look at each of those in a little more detail.
