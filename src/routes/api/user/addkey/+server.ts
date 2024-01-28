import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(JSON.stringify("you must be logged in to add files"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  // console.log(session);
  const key_info = await request.json();
  console.log("inside add key",key_info);
  let given_publickey = key_info.key;
  let given_userid = key_info.user_id;

  let { data: result, error: _error } = await supabase.rpc(
    "add_publickey_user",
    {
      given_publickey,
      given_userid,
    }
  );
  console.log("add key rps result",result)
  if (_error) {
    return new Response(JSON.stringify("internal server error while adding user key: " + _error), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
