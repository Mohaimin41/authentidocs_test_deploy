import { supabase } from "$lib/server/supabase_client.server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.auth();
  if (!session?.user) {
    return new (error as any)(401, "You must be logged in to get post ");
  }

  // console.log(session);
  const forum_info = await request.json();
  let given_postid = forum_info.postid;

  if (given_postid === undefined || given_postid === null) {
    console.error(
      "ERROR @api/forum/getpost:21: invalid user input error:\n",
      forum_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while getting thread post."
    );
  }

  let { data: result, error: _error } = await supabase.rpc("get_post", {
    given_postid,
  });

  
  if (_error) {
    console.error(
      "ERROR @api/forum/getpost:37: supabase getting thread post error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while getting thread post."
    );
  }
  // BUGSRC
  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
//forum/getpost
