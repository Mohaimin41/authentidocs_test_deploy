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
  const member_info = await request.json();
  // console.log("inside add key",key_info);

  let given_signing_serial=member_info.signing_serial;
  let given_threadid=member_info.thread_id;
  let given_user_role=member_info.user_role;
  let given_userid=member_info.user_id;

  let { data:result, error:_error } = await supabase
  .rpc('add_thread_member', {
    given_signing_serial, 
    given_threadid, 
    given_user_role, 
    given_userid
  })


  // console.log("add key rps result",result)
  if (_error) {
    console.log("ERROR @api/user/addkey:33: supabase add user publickey error\n", _error)
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
