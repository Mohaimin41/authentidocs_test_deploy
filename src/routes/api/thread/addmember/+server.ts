import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(
      JSON.stringify("you must be logged in to add member to threads"),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      }
    );
  }

  // console.log(session);
  const member_info = await request.json();
  // console.log("inside add key",key_info);
  let uid_list = member_info.uid_list;
  let given_threadid = member_info.threadid;
  let { data: sign_serial, error } = await supabase.rpc(
    "get_current_signing_serial",
    {
      given_threadid,
    }
  );

  for (let i = 0; i < uid_list.len(); i++) {
    let given_signing_serial = sign_serial++;
    let given_user_role = "member";
    let given_userid = uid_list[i];
    let current_userid = session.user.name;

    let { data: result, error: _error } = await supabase.rpc(
      "add_thread_member",
      {
        current_userid,
        given_signing_serial,
        given_threadid,
        given_user_role,
        given_userid,
      }
    );

    // console.log("add key rps result",result)
    if (_error) {
      console.log(
        "ERROR @api/thread/addmember:54: supabase add thread member error\n",
        _error
      );
      return new Response(
        JSON.stringify(
          "internal server error while adding thread member: " + _error
        ),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 500,
        }
      );
    }
  }

  let response: Response = new Response(JSON.stringify(sign_serial), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
