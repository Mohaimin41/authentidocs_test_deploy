import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";
import { json, error } from "@sveltejs/kit";


export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {

  const session = await locals.getSession();
  if (!session?.user) {
    throw error(401, "You must sign in to add file signatures.");
  }
  // console.log(session);
  const key_info = await request.json();
  // console.log(key_info);
  let ret_text;
  let given_publickey=key_info.key
  let given_userid=key_info.user_id

    let { data:result, } = await supabase
    .rpc('add_publickey_user', {
    given_publickey, 
    given_userid
    })
    // console.log(result)

    ret_text=result;
   
   let response: Response = new Response(JSON.stringify(ret_text), {
    headers: {
      "Content-Type": "application/json",
    },
  });


  return response;
}
