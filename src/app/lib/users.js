import {clientPromise} from "mongodb"

export async function getUsers() {
    const client = await clientPromise
    const db = client.db("Chat-With-Us")
    const users = await db.collection("users").find({}).toArray()
    return users
}

