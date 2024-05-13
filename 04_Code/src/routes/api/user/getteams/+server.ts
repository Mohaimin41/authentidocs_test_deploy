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
      "You must be logged in to view user teams."
    );
  }
  // console.log(session);
  const user_info = await request.json();
  let given_userid = user_info.given_userid;

  if (given_userid === undefined || given_userid === null) {
    console.error(
      "ERROR @api/user/getteams:22: invalid user input error:\n",
      user_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while getting user teams."
    );
  }

  let { data:result, error:_error } = await supabase
  .rpc('get_user_teams_userid', {
    given_userid
  })

  if (_error) {
    console.error(
      "ERROR @api/user/getteams:38: supabase get user teams error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while getting user teams."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
