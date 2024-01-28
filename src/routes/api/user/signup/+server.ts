import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({ request }: RequestEvent): Promise<Response> {
  const user = await request.json();
  // console.log(user);
  let ret_text;
  let given_email = user.given_email;
  let { data: result, error:_error } = await supabase.rpc("can_signup_user", {
    given_email,
  });
  //  if (error) console.error(error)
  //  else console.log(result)
  if (_error) {
    return new Response(JSON.stringify("internal server error while checking user input: "+_error), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }

  if (result == true) {
    let given_email = user.given_email;
    let given_pfp_url = "";
    let given_publickey = "";
    let given_pwd_hash = user.given_pwd_hash;
    let given_username = user.given_username;

    let { data:result1, error:_error1 } = await supabase.rpc("add_user", {
      given_email,
      given_pfp_url,
      given_publickey,
      given_pwd_hash,
      given_username,
    });
    if (_error1) {
      return new Response(JSON.stringify("internal server error while adding user: "+_error), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      });
    }
  
    ret_text = result1;
    // console.log(ret_text);
  } else {
    // console.log("user Already Exists")
    ret_text = -1;
  }

  let response: Response = new Response(JSON.stringify(ret_text), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
