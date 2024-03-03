import { supabase } from "$lib/server/supabase_client.server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.auth();
  if (!session?.user) {
    return new (error as any)(401, "You must be logged in to forward file");
  }
  // console.log(session);
  const thread_info = await request.json();

  let given_src_userid = session.user.name;
  let given_target_userid;
  let given_threadid = thread_info.threadid;

  if (
    given_src_userid === undefined ||
    given_src_userid === null ||
    given_threadid === undefined ||
    given_threadid === null
  ) {
    console.error(
      "ERROR @api/thread/forward:28: invalid user input error:\n",
      thread_info
    );
    return new (error as any)(422, "Invalid inputs, while forwarding file.");
  }

  let { data: result1, error: _error1 } = await supabase.rpc(
    "get_thread_member_list",
    {
      given_threadid,
    }
  );

  if (_error1) {
    console.error(
      "ERROR @api/thread/forward:45: supabase forwarding thread error\n",
      _error1
    );
    return new (error as any)(
      500,
      "Internal Server Error, while forwarding thread."
    );
  }

  // console.log(result1);
  for (let i = 0; i < result1.length; i++) {
    if (result1[i].f_userid == given_src_userid) {
      if (i != result1.length - 1) {
        given_target_userid = result1[i + 1].f_userid;
        break;
      }
    }
  }

  let { data: result, error: _error } = await supabase.rpc("forward_thread", {
    given_src_userid,
    given_target_userid,
    given_threadid,
  });

  if (_error) {
    console.error(
      "ERROR @api/thread/forward:72: supabase forward thread error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while forwarding thread."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
