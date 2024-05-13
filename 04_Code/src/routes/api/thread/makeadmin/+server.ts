import { supabase } from "$lib/server/supabase_client.server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.auth();
  if (!session?.user) {
    return new (error as any)(401, "You must be logged in to make admin");
  }
  // console.log(session);
  const thread_info = await request.json();
  console.log(thread_info);
  let given_hierarchy_level = "thread";
  let given_hierarchy_level_id = thread_info.threadid;
  let target_userid = thread_info.id;

  if (
    given_hierarchy_level === (undefined || null) ||
    given_hierarchy_level_id === (undefined || null) ||
    target_userid === (undefined || null)
  ) {
    console.error(
      "ERROR @api/thread/makeadmin:26: invalid user input error:\n",
      thread_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while making user thread admin."
    );
  }

  let { data: result, error: _error } = await supabase.rpc("make_admin", {
    given_hierarchy_level,
    given_hierarchy_level_id,
    target_userid,
  });

  if (_error) {
    console.error(
      "ERROR @api/thread/makeadmin:43: supabase making thread adming error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while making thread admin."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
