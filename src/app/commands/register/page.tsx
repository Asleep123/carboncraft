"use client";

import { api } from "~/trpc/react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "~/components/ui/form"
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import type { z } from "zod";
import { registerCommandsSchema } from "~/server/schemas";
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";

export default function RegisterCommands() {

    const RegisterCommandsMutation = api.commands.register.useMutation()
  
    const form = useForm<z.infer<typeof registerCommandsSchema>>({
      resolver: zodResolver(registerCommandsSchema)
    })
  
    const router = useRouter();
  
    async function onSubmit(values: z.infer<typeof registerCommandsSchema>) {
      await RegisterCommandsMutation.mutateAsync(values)
      router.refresh()
    }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Bot ID
              </FormLabel>
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
        name="token"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Bot Token
            </FormLabel>
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
        <Button type="submit">
          Register
        </Button>
        </form>
      </Form>
    )
  }