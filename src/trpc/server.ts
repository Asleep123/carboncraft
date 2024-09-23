import { createTRPCClient, unstable_httpBatchStreamLink } from "@trpc/client"
import { cookies } from "next/headers"

import type { AppRouter } from "~/server/api/root"
import { getUrl, transformer } from "~/trpc/shared"

export const api = createTRPCClient<AppRouter>({
	links: [
		unstable_httpBatchStreamLink({
			url: getUrl(),
			transformer,
			headers() {
				return {
					cookie: cookies().toString(),
					"x-trpc-source": "rsc"
				}
			}
		})
	]
})