"use client"

import { api } from "~/trpc/react";
import React from "react";
import { useToast } from "../ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { createBotSchema } from "~/server/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function CreateBotDialog({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const createBotMutation = api.bots.create.useMutation();

    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof createBotSchema>>({
        resolver: zodResolver(createBotSchema),
        defaultValues: {
            token: "",
            publicKey: ""
        }
    })

    async function onSubmit(values: z.infer<typeof createBotSchema>) {
        setIsLoading(true)
        try {
            const bot = await createBotMutation.mutateAsync(values) 
            if (bot instanceof TRPCError) throw bot
            form.reset()
            toast({
                title: "Bot Created",
                description: "Your bot has been created successfully.",
                variant: "success"
            })
            setIsOpen(false)
            router.push(`/dashboard/${bot.id}/manage`)
        } catch (error) {
            console.log(error)
            if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
                form.setError("token", { type: "custom", message: "Invalid Token, please ensure your token is correct, and there are no unexpected spaces." })
            } else {
                toast({
                    title: "Failed to create bot",
                    description: error instanceof TRPCError ? error.code : "An error occurred. Contact support.",
                    variant: "destructive"
                })
        }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent onInteractOutside={() => {
                setIsOpen(false)
            }}>
                <DialogHeader>
                    <DialogTitle>Create a Bot</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="token"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bot Token</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            data-1p-ignore
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormDescription>This is your bot's token, it's key to the Discord API.</FormDescription>
                                    <FormMessage />
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
                                            {...field}
                                            data-1p-ignore
                                        />
                                    </FormControl>
                                    <FormDescription>This is your bot's public key, how we verify that requests are coming from your bot.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" variant="default" disabled={isLoading}>Create</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}