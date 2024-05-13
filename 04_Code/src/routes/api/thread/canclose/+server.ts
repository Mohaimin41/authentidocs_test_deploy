import { supabase } from "$lib/server/supabase_client.server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.auth();
  if (!session?.user) {
    return new (error as any)(
      401,
      "You must be logged in to view thread condition"
    );
  }
  // console.log(session);
  const thread_info = await request.json();
  let given_threadid = thread_info.given_threadid;
  if (given_threadid === undefined || given_threadid === null) {
    console.error(
      "ERROR @api/thread/canclose:22: invalid user input error:\n",
      thread_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while checking thread closing status."
    );
  }
  let { data: result, error: _error } = await supabase.rpc("can_close_thread", {
    given_threadid,
  });

  
  if (_error) {
    console.error(
      "ERROR @api/thread/canclose:37: supabase checking can close thread error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while checking thread closing status."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
