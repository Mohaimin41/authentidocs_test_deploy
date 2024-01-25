import { json, error } from "@sveltejs/kit"
import type { RequestEvent } from "./$types"
import { supabase } from "$lib/server/supabase_client.server";

export async function POST({
    request,
    cookies,
    locals,
  }: RequestEvent): Promise<Response> {
    const session = await locals.getSession()
  if (!session?.user) {
    throw error(401, "You must sign in to view movies.")
  }
  console.log(session)
  
    const provider = await request.json();
    console.log(provider);
    
  
    let ret_text;
    let response: Response = new Response(JSON.stringify(ret_text), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  
  
    return response;
  }
  