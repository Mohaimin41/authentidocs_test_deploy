import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(JSON.stringify("you must be logged in to close threads"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  // console.log(session);
  const file_info = await request.json();
  // console.log("inside add key",key_info);

  let given_closing_comment = file_info.closing_comment;
  let given_threadid = file_info.threadid;
  let given_current_userid = session.user.name;

  let { data: result, error: _error } = await supabase.rpc(
    "make_thread_archived",
    {
      given_closing_comment,
      given_current_userid,
      given_threadid,
    }
  );

  // console.log("add key rps result",result)
  if (_error) {
    console.log(
      "ERROR @api/thread/makearchive:38: supabase make thread archived error\n",
      _error
    );
    return new Response(
      JSON.stringify("internal server error while archiving thread: " + _error),
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
