import { json, error } from "@sveltejs/kit"
import type { RequestEvent } from "./$types"

export async function GET({ locals }: RequestEvent) {
  const session = await locals.auth()
  if (!session?.user) {
    throw error(401, "You must sign in to view movies.")
  }
  // console.log(session)
  return json({
    movies: [
      { title: "Alien vs Predator", id: 1 },
      { title: "Reservoir Dogs", id: 2 },
    ],
  })
}