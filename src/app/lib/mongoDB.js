import { error } from "console";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri);

if(!process.env.MONGODB_URI){
    throw new Error("Please add the MONGODV_URI to .env")
}

let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise
} else {
  clientPromise = client.connect()
}

export default clientPromise;
