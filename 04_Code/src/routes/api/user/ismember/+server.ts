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
      "You must be logged in to view user membership status"
    );
  }
  // console.log(session);
  const user_info = await request.json();
  let given_hierarchy_name = user_info.level;
  let given_hierarchy_id = user_info.level_id;
  let given_userid = user_info.id;
  if (
    given_hierarchy_name === undefined ||
    given_hierarchy_name === null ||
    given_hierarchy_id === undefined ||
    given_hierarchy_id === null ||
    given_userid === undefined ||
    given_userid === null
  ) {
    console.error(
      "ERROR @api/user/ismember:27: invalid user input error:\n",
      user_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while checking user membership status."
    );
  }

  let { data: result, error: _error } = await supabase.rpc("is_member_of", {
    given_hierarchy_id,
    given_hierarchy_name,
    given_userid,
  });

  if (_error) {
    console.error(
      "ERROR @api/user/ismember:44: supabase checking user membership error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while checking user membership."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
