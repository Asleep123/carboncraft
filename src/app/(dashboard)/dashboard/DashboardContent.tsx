import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "~/components/ui/card";
import CreateBotDialog from "~/components/dialogs/CreateBot";
import { PlusIcon, ArrowRight } from "lucide-react";
import type { api as apiServer } from "~/trpc/server"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import Link from "next/link";


export default function DashboardContent({ bots }: { bots: Awaited<ReturnType<typeof apiServer.bots.getOwnedByUser.query>> }) {
    return (
        <main>
            <h1 className="pl-12 pt-12 pb-6 text-4xl font-bold">Dashboard</h1>
            <Card className="mx-8">
                <CardHeader className="flex justify-between flex-row">
                    <div>
                        <CardTitle>Your Bots</CardTitle>
                        <CardDescription>Manage the bots you own here.</CardDescription>
                    </div>
                    <CreateBotDialog>
                        <Button><PlusIcon className="mr-2" />New</Button>
                    </CreateBotDialog>
                </CardHeader>
                <CardContent>
                    {bots.length === 0 ? (
                        <p className="text-center py-2 text-sm">It's looking pretty lonely in here... Why not create a bot?</p>
                    ) : (
                        <div className="flex flex-col space-y-2">
                            {bots.map((bot) => (
                                <Card key={bot.id} className="flex flex-row justify-between p-4 items-center">
                                    <div className="flex space-x-4 justify-between items-center">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={bot.avatar || undefined} />
                                            <AvatarFallback>{bot.username.substring(0, 1)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-bold text-lg">{bot.username}</p>
                                    </div>
                                    <Link href={`/dashboard/${bot.id}/manage`} className={buttonVariants({ variant: "outline", size: "sm" })}>View<ArrowRight className="ml-2" /></Link>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}