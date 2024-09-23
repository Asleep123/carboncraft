"use client";

import type { api as apiServer } from "~/trpc/server";
import { api } from "~/trpc/react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
    FormDescription
} from "~/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "~/components/ui/breadcrumb"
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import type { z } from "zod";
import { editBotSchema } from "~/server/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";

export default function ManageContent({ bot }: { bot: NonNullable<Awaited<ReturnType<typeof apiServer.bots.get.query>>> }) {
    const editBotMutation = api.bots.edit.useMutation()
    const registerCommandsMutation = api.commands.register.useMutation()
    const deleteAllCommandsMutation = api.commands.deleteAll.useMutation()

    const form = useForm<z.infer<typeof editBotSchema>>({
        resolver: zodResolver(editBotSchema),
        defaultValues: {
          token: bot.token,
          publicKey: bot.publicKey,
          botId: bot.id
        },
      })

    const { toast } = useToast();
    const router = useRouter();

    async function onSubmit(values: z.infer<typeof editBotSchema>) {
        await editBotMutation.mutateAsync(values).catch((error) => {
            toast({
                title: "Failed to save changes",
                description: error.code,
                variant: "destructive"
            })
        })
        toast({
            title: "Changes Saved",
            description: "Your edits have been stored.",
            variant: "success"
        })
        router.refresh()
      }

    return (
        <main className="flex flex-col space-y-8 p-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>General</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Manage Bot</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Perform actions on your bot.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2">
                    <div>
                        <p className="text-sm font-medium">Sync Commands</p>
                        <Button className="my-2 ml-2" onClick={async () => {
                            await registerCommandsMutation.mutateAsync({
                            clientId: bot.clientId,
                            botToken: bot.token
                        }).catch((error) => toast({
                            title: "Failed to sync commands",
                            description: error.code,
                            variant: "destructive"
                        }))
                        toast({
                            title: "Commands Synced",
                            description: "Your commands are now in line with Discord.",
                            variant: "success"
                        })
                        }}><RefreshCcw className="w-4 h-4 mr-2" />Sync</Button>
                        <p className="text-sm text-muted-foreground">Sync your commands with Discord. This only needs to be done after you update a commands metadata (name, description, options, NOT response)</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Delete Commands</p>
                        <Button className="my-2 ml-2" variant="destructive" onClick={async () => {
                            await deleteAllCommandsMutation.mutateAsync({
                            botId: bot.id
                        }).catch((error) => toast({
                            title: "Failed to delete commands",
                            description: error.code,
                            variant: "destructive"
                        }))
                        toast({
                            title: "Deleted All Commands",
                            description: "All of your commands have been removed from Discord.",
                            variant: "success"
                        })
                        }}><RefreshCcw className="w-4 h-4 mr-2" />Delete All Commands</Button>
                        <p className="text-sm text-muted-foreground">This will de-register all of your commands on Discord. It will not remove your commands' blocks, but you will not be able to use your commands on Discord anymore until you sync again. Useful when switching from another provider, and you need to start fresh.</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Change your bot's token/public key.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="token"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bot Token</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="123456789012345678"
                                                {...field}
                                                data-1p-ignore
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormDescription>This is your bot's key to interact with the Discord API. Don't share it!</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="publicKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Public Key</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="ABCDEFGabcdefg1234567890"
                                                {...field}
                                                data-1p-ignore
                                            />
                                        </FormControl>
                                        <FormDescription>This is how we verify HTTP Interactions are actually coming from Discord, and not an imposter.</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="mt-4">Save</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    )
}