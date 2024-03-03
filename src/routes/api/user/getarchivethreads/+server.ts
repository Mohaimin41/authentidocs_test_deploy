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
      "You must be logged in to view user threads."
    );
  }
  // console.log(session);
  const user_info = await request.json();
  let given_userid = user_info.given_userid;

  if (given_userid === undefined || given_userid === null) {
    console.error(
      "ERROR @api/user/getarchivedthreads:22: invalid user input error:\n",
      user_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while getting user threads."
    );
  }

  let { data:result, error:_error } = await supabase
  .rpc('get_user_archived_threads', {
    given_userid
  })
 
  if (_error) {
    console.error(
      "ERROR @api/user/getarchivedthreads:38: supabase get user threads error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while getting user threads."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
