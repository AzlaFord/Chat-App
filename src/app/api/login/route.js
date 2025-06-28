import clientPromise from "@/lib/mongodb";


export async function POST(request, response) {
    const body = await request.json();
    const { login, password } = body;

    if (!password) {
        return new Response(
            JSON.stringify({ message: "parola nu exista" }),
            {
                status: 406,
                headers: { "Content-Type": "application/json" }
            }
        );
    }

    if (!login) {
        return new Response(
            JSON.stringify({ message: "login nu exista" }),
            {
                status: 406,
                headers: { "Content-Type": "application/json" }
            }
        );
    }

    return new Response(
        JSON.stringify({ message: "autentificare reusita", login, password }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" }
        }
    );
}
