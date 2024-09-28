"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { RefreshCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "~/components/ui/breadcrumb"
import { Button } from "~/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "~/components/ui/card"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"
import { useToast } from "~/components/ui/use-toast"
import { editBotProfileSchema, editBotSchema } from "~/server/schemas"
import { api } from "~/trpc/react"
import type { api as apiServer } from "~/trpc/server"

export default function ManageContent({
	bot
}: { bot: NonNullable<Awaited<ReturnType<typeof apiServer.bots.get.query>>> }) {
	const editBotMutation = api.bots.edit.useMutation()
	const registerCommandsMutation = api.commands.register.useMutation()
	const deleteAllCommandsMutation = api.commands.deleteAll.useMutation()
	const editBotProfileMutation = api.bots.editProfile.useMutation()

	const [file, setFile] = React.useState<File | null>(null)

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files?.[0]) {
			setFile(event.target.files[0])
		}
	}

	const securityForm = useForm<z.infer<typeof editBotSchema>>({
		resolver: zodResolver(editBotSchema),
		defaultValues: {
			token: bot.token,
			publicKey: bot.publicKey,
			botId: bot.id
		}
	})

	const profileForm = useForm<z.infer<typeof editBotProfileSchema>>({
		resolver: zodResolver(editBotProfileSchema),
		defaultValues: {
			botId: bot.id,
			username: bot.username
		}
	})

	const { toast } = useToast()
	const router = useRouter()

	async function securityOnSubmit(values: z.infer<typeof editBotSchema>) {
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

	async function profileOnSubmit(
		values: z.infer<typeof editBotProfileSchema>
	) {
		if (!file) return
		const reader = new FileReader()
		reader.onloadend = async () => {
			const b64 = reader.result as string
			const imageBase64 = b64.split(",")[1]

			await editBotProfileMutation.mutateAsync({
				avatarData: {
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					data: imageBase64!,
					mimeType: file.type
				},
				username: values.username,
				botId: values.botId
			})
		}
		reader.readAsDataURL(file)
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
			<ScrollArea>
				<Card className="my-8">
					<CardHeader>
						<CardTitle>Actions</CardTitle>
						<CardDescription>
							Perform actions on your bot.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col space-y-4">
						<div>
							<p className="text-sm font-medium">Sync Commands</p>
							<Button
								className="my-2 ml-2"
								onClick={async () => {
									await registerCommandsMutation
										.mutateAsync({
											clientId: bot.clientId,
											botToken: bot.token
										})
										.catch((error) =>
											toast({
												title: "Failed to sync commands",
												description: error.code,
												variant: "destructive"
											})
										)
									toast({
										title: "Commands Synced",
										description:
											"Your commands are now in line with Discord.",
										variant: "success"
									})
								}}
							>
								<RefreshCcw className="w-4 h-4 mr-2" />
								Sync
							</Button>
							<p className="text-sm text-muted-foreground">
								Sync your commands with Discord. This only needs
								to be done after you update a commands metadata
								(name, description, options)
							</p>
						</div>
						<div>
							<p className="text-sm font-medium">
								Delete Commands
							</p>
							<Button
								className="my-2 ml-2"
								variant="destructive"
								onClick={async () => {
									await deleteAllCommandsMutation
										.mutateAsync({
											botId: bot.id
										})
										.catch((error) =>
											toast({
												title: "Failed to delete commands",
												description: error.code,
												variant: "destructive"
											})
										)
									toast({
										title: "Deleted All Commands",
										description:
											"All of your commands have been removed from Discord.",
										variant: "success"
									})
								}}
							>
								<RefreshCcw className="w-4 h-4 mr-2" />
								Delete All Commands
							</Button>
							<p className="text-sm text-muted-foreground">
								This will de-register all of your commands on
								Discord. Useful when switching from another
								provider, and you need to start fresh.
							</p>
						</div>
						<p className="text-sm text-muted-foreground">
							No start/stop buttons? That's because we use HTTP
							Interactions. Read more{" "}
							<Link
								href="/about/http-interactions"
								className="font-bold"
							>
								here
							</Link>
							.
						</p>
					</CardContent>
				</Card>
				<Card className="my-8">
					<CardHeader>
						<CardTitle>Security</CardTitle>
						<CardDescription>
							Change your bot's token/public key.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...securityForm}>
							<form
								onSubmit={securityForm.handleSubmit(
									securityOnSubmit
								)}
							>
								<div className="flex flex-col space-y-4">
									<FormField
										control={securityForm.control}
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
												<FormDescription>
													This is your bot's key to
													interact with the Discord
													API. Don't share it!
												</FormDescription>
											</FormItem>
										)}
									/>
									<FormField
										control={securityForm.control}
										name="publicKey"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Public Key
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														data-1p-ignore
													/>
												</FormControl>
												<FormDescription>
													This is how we verify HTTP
													Interactions are actually
													coming from Discord, and not
													an imposter.
												</FormDescription>
											</FormItem>
										)}
									/>
								</div>
								<Button type="submit" className="mt-4">
									Save
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
				<Card className="my-8">
					<CardHeader>
						<CardTitle>Bot</CardTitle>
						<CardDescription>
							Customize your bot's username, avatar, banner
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...profileForm}>
							<form
								onSubmit={profileForm.handleSubmit(
									profileOnSubmit
								)}
							>
								<div className="flex flex-col space-y-4">
									<FormField
										control={profileForm.control}
										name="username"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Username</FormLabel>
												<FormControl>
													<Input
														{...field}
														data-1p-ignore
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={profileForm.control}
										name="avatarForm"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Avatar</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="file"
														accept="image/jpeg, image/png"
														onChange={
															handleFileChange
														}
														value={undefined}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
								<Button type="submit" className="mt-4">
									Save
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</ScrollArea>
		</main>
	)
}
