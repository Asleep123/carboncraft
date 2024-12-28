import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import DashboardContent from "./DashboardContent";

export default async function Dashboard() {
    const bots = await api.bots.getOwnedByUser.query().catch(() => redirect("/api/auth/login"))
    
    return <DashboardContent bots={bots} />
}