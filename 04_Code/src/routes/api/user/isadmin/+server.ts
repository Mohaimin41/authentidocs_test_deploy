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
      "You must be logged in to check admin status"
    );
  }
  // console.log(session);
  const user_info = await request.json();
  let given_hierarchy_level = user_info.level;
  let given_hierarchy_level_id = user_info.level_id;
  let target_userid = user_info.id;

  if (
    given_hierarchy_level === undefined ||
    given_hierarchy_level === null ||
    given_hierarchy_level_id === undefined ||
    given_hierarchy_level_id === null ||
    target_userid === undefined ||
    target_userid === null
  ) {
    console.error(
      "ERROR @api/user/isadmin:31: invalid user input error:\n",
      user_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while checking user admin status."
    );
  }

  let { data: result, error: _error } = await supabase.rpc("is_admin", {
    given_hierarchy_level,
    given_hierarchy_level_id,
    target_userid,
  });

  if (_error) {
    console.error(
      "ERROR @api/user/isadmin:48: supabase isadmin user error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while isadmin user."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
