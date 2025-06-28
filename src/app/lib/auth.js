import clientPromise from "./mongoDB";
import bcrypt from "bcrypt";

const saltRounds = 10;

export async function register(userName, password) {
    const client = await clientPromise
    const db = client.db("Chat-With-Us")
    const exists = await  db.collection("users").findOne({userName})
    
    if(exists){
        return { success: false, message: "User există" };
    }else{
        const hash = await bcrypt.hash(password, saltRounds)
        await db.collection("users").insertOne({ userName, password: hash })
    }
}
