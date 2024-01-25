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
      throw error(401, "You must sign in to add files.")
    }
    console.log(session)
  
    const user_info = await request.json()
    let given_userid=user_info.given_userid
    let { data } = await supabase
    .rpc('get_user_personal_files_userid', {
    given_userid
    })
    console.log(data)

    
  
    let ret_text = data;
    let response: Response = new Response(JSON.stringify(ret_text), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  
  
    return response;
  }
  