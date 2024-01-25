import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";


export async function POST({
  request,
  cookies,
}: RequestEvent): Promise<Response> {
  const user = await request.json();
  console.log(user);
  let ret_text;
  let given_email = ''
  let { data: result, error } = await supabase
    .rpc('can_signup_user', {
      given_email
    })
  if (error) console.error(error)
  else console.log(result)
  if (result == true) {
    let given_email = user.given_email
    let given_pfp_url = ''
    let given_publickey = ''
    let given_pwd_hash = user.given_pwd_hash
    let given_username = user.given_username

    let { data: result, error } = await supabase
      .rpc('add_user', {
        given_email,
        given_pfp_url,
        given_publickey,
        given_pwd_hash,
        given_username
      })
    if (error) console.error(error)
    else console.log(result)
    ret_text = result
    console.log(ret_text);

  }
  else {
    console.log("user Already Exists")
    ret_text = -1;
  }


  let response: Response = new Response(JSON.stringify(ret_text), {
    headers: {
      "Content-Type": "application/json",
    },
  });


  return response;
}
