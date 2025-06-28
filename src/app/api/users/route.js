import { getUsers } from "@/lib/users";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const users = await getUsers();
    res.status(200).json(users);
  } else {
    res.status(405).end();
  }
}
