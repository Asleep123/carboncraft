"use server";

import { auth } from "~/server/auth"
import { redirect } from "next/navigation";

export default async function AuthTestPage() {
    const { user } = await auth()
    if (!user) redirect("/api/auth/login/")

    return (
        <main>
            <p>Avatar:{user.avatar}</p>
            <p>Username: {user.username}</p>
            <p>ID: {user.id}</p>
        </main>
    )
}