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
      JSON.stringify("you must be logged in to forward threads"),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      }
    );
  }
  // console.log(session);
  const file_info = await request.json();
  // console.log("inside add key",key_info);

  let given_src_userid = file_info.srcuserid;
  let given_target_userid = file_info.targetuserid;
  let given_threadid = file_info.threadid;

  let { data: result, error: _error } = await supabase.rpc("forward_thread", {
    given_src_userid,
    given_target_userid,
    given_threadid,
  });

  // console.log("add key rps result",result)
  if (_error) {
    console.log(
      "ERROR @api/thead/forward:35: supabase forward thread error\n",
      _error
    );
    return new Response(
      JSON.stringify(
        "internal server error while forwarding thread: " + _error
      ),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
