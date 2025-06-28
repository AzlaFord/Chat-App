import { getUsers } from "./../../lib/users";

export async function GET(request) {
  const users = await getUsers();
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

