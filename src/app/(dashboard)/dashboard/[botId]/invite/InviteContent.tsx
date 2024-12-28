"use client"

import type { api as apiServer } from "~/trpc/server"
import { useState } from 'react';
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Breadcrumb, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbItem } from "~/components/ui/breadcrumb";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

export default function InviteContent({
	bot
}: { bot: NonNullable<Awaited<ReturnType<typeof apiServer.bots.get.query>>> }) {
    const [permissionsSelected, setPermissionsSelected] = useState<bigint>(BigInt(8));
    const [clientId, setClientId] = useState<string>(bot.clientId);
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=${permissionsSelected}`

    const permissions = [
        { name: 'Administrator', value: BigInt(0x8) },
        { name: 'Create Instant Invite', value: BigInt(0x1) },
        { name: 'Kick Members', value: BigInt(0x2) },
        { name: 'Ban Members', value: BigInt(0x4) },
        { name: 'Manage Channels', value: BigInt(0x10) },
        { name: 'Manage Guild', value: BigInt(0x20) },
        { name: 'Add Reactions', value: BigInt(0x40) },
        { name: 'View Audit Log', value: BigInt(0x80) },
        { name: 'Priority Speaker', value: BigInt(0x100) },
        { name: 'Stream', value: BigInt(0x200) },
        { name: 'View Channel', value: BigInt(0x400) },
        { name: 'Send Messages', value: BigInt(0x800) },
        { name: 'Send TTS Messages', value: BigInt(0x1000) },
        { name: 'Manage Messages', value: BigInt(0x2000) },
        { name: 'Embed Links', value: BigInt(0x4000) },
        { name: 'Attach Files', value: BigInt(0x8000) },
        { name: 'Read Message History', value: BigInt(0x10000) },
        { name: 'Mention Everyone', value: BigInt(0x20000) },
        { name: 'Use External Emojis', value: BigInt(0x40000) },
        { name: 'Connect', value: BigInt(0x100000) },
        { name: 'Speak', value: BigInt(0x200000) },
        { name: 'Mute Members', value: BigInt(0x400000) },
        { name: 'Deafen Members', value: BigInt(0x800000) },
        { name: 'Move Members', value: BigInt(0x1000000) },
        { name: 'Use Voice Activity', value: BigInt(0x2000000) },
        { name: 'Change Nickname', value: BigInt(0x4000000) },
        { name: 'Manage Nicknames', value: BigInt(0x8000000) },
        { name: 'Manage Roles', value: BigInt(0x10000000) },
        { name: 'Manage Webhooks', value: BigInt(0x20000000) },
        { name: 'Manage Emojis And Stickers', value: BigInt(0x40000000) },
        { name: 'Use Application Commands', value: BigInt(0x80000000) },
        { name: 'Request To Speak', value: BigInt(0x100000000) },
        { name: 'Manage Events', value: BigInt(0x200000000) },
        { name: 'Manage Threads', value: BigInt(0x400000000) },
        { name: 'Create Public Threads', value: BigInt(0x800000000) },
        { name: 'Create Private Threads', value: BigInt(0x1000000000) },
        { name: 'Use External Stickers', value: BigInt(0x2000000000) },
        { name: 'Send Messages In Threads', value: BigInt(0x4000000000) },
        { name: 'Use Embedded Activities', value: BigInt(0x8000000000) },
        { name: 'Time Out Members', value: BigInt(0x10000000000) },
        { name: 'Use Soundboard', value: BigInt(0x40000000000) },
        { name: 'Create Guild Expressions', value: BigInt(0x80000000000) },
        { name: 'Create Events', value: BigInt(0x100000000000) },
        { name: 'Use External Sounds', value: BigInt(0x200000000000) },
        { name: 'Send Voice Messages', value: BigInt(0x400000000000) },
      ];

      const handlePermissionChange = (checked: boolean | "indeterminate", value: bigint) => {
        setPermissionsSelected(prevPermissions => 
          checked === true ? prevPermissions | value : prevPermissions & ~value
        );
      };

    const { toast } = useToast()

    const copyText = async ({ text }: { text: string }) => {
        try {
            await navigator.clipboard.writeText(text)
            toast({
                title: "Copied to Clipboard",
                description: "Successfully copied text to clipboard",
                variant: "success"
            })
        } catch (error) {
            toast({
                title: "Failed to Copy",
                description: `${error}`,
                variant: "destructive"
            })
        }
    }


    return (
        <main className="flex flex-col h-full">
            <div className="flex-shrink-0 p-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>General</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Invite Bot</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
			<ScrollArea className="flex-1 p-4">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions Calculator</CardTitle>
                            <CardDescription>This is what permissions your bot will have in your server when you invite it. If this is just for one server, or for testing, you can select Administrator. It's good practice to only give your bot the permissions that it needs to function, though.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col space-y-4">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
                                {permissions.map((permission) => (
                                    <div className="flex items-center space-x-2" key={permission.name}>
                                        <Checkbox
                                            id={permission.name}
                                            checked={(permissionsSelected & permission.value) !== BigInt(0)}
                                            onCheckedChange={(checked) => handlePermissionChange(checked === true, permission.value)}
                                        />
                                        <Label htmlFor={permission.name}>{permission.name}</Label>
                                    </div>
                                ))}
                                </div>
                            <div className="flex flex-col space-y-2">
                                <Label>Permission Value</Label>
                                <div className="flex w-full space-x-2">
                                    <Input disabled value={permissionsSelected.toString()} className="font-mono" />
                                    <Button variant="outline" onClick={() => copyText({ text: permissionsSelected.toString() })}>Copy</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Link Generator</CardTitle>
                            <CardDescription>Generate an invite link based on the permissions above.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-2">
                                <Label>Client ID</Label>
                                <Input value={clientId} onChange={(input) => setClientId(input.currentTarget.value)} />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label>Invite Link</Label>
                                <div className="flex w-full space-x-2">
                                    <Input disabled value={inviteLink} />
                                    <Button variant="outline" onClick={() => copyText({ text: inviteLink })}>Copy</Button>
                                </div>
                            </div>
                            
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </main>
    )
}