import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(JSON.stringify("you must be logged in to view user details"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  const user_info = await request.json();
  //console.log(user_info);
  let given_userid = user_info.userid;
  //console.log(given_userid)

  let { data: result, error: _error } = await supabase.rpc(
    "get_user_details_userid",
    {
      given_userid,
    }
  );
  if (_error) {
    console.log("ERROR @api/user/details:29: supabase getting user data error\n", _error)
    return new Response(JSON.stringify("internal server error while getting user details: " + _error), {
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
