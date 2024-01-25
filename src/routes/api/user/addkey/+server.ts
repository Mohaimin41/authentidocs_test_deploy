import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";


export async function POST({
  request,
  cookies,
}: RequestEvent): Promise<Response> {
  const key_info = await request.json();
  console.log(key_info);
  let ret_text;
  let given_publickey=key_info.key
  let given_userid=key_info.user_id

    let { data:result, error } = await supabase
    .rpc('add_publickey_user', {
    given_publickey, 
    given_userid
    })
    if (error) console.error(error)
    else console.log(result)

    ret_text=result;
   
   let response: Response = new Response(JSON.stringify(ret_text), {
    headers: {
      "Content-Type": "application/json",
    },
  });


  return response;
}
