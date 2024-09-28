"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "~/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { createCommandSchema } from "~/server/schemas"
import { api } from "~/trpc/react"

export default function Commands() {
	const CreateCommandMutation = api.commands.create.useMutation()

	const form = useForm<z.infer<typeof createCommandSchema>>({
		resolver: zodResolver(createCommandSchema)
	})

	const router = useRouter()

	async function onSubmit(values: z.infer<typeof createCommandSchema>) {
		await CreateCommandMutation.mutateAsync(values)
		router.refresh()
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="botId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bot ID</FormLabel>
							<FormControl>
								<Input
									placeholder="123123123123"
									{...field}
									data-1p-ignore
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder="123abc123abc123abc"
									{...field}
									data-1p-ignore
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Command Description</FormLabel>
							<FormControl>
								<Input
									placeholder="123abc123abc123abc"
									{...field}
									data-1p-ignore
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Add</Button>
			</form>
		</Form>
	)
}
