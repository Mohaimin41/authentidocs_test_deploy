import { supabase } from "$lib/server/supabase_client.server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.auth();
  if (!session?.user) {
    return new (error as any)(401, "You must be logged in to add file");
  }
  // console.log(session);
  const team_info = await request.json();
  let given_hierarchy_level = "team";
  let given_hierarchy_level_id = team_info.teamid;
  let target_userid = team_info.id;

  if (
    given_hierarchy_level === (undefined || null) ||
    given_hierarchy_level_id === (undefined || null) ||
    target_userid === (undefined || null)
  ) {
    console.error(
      "ERROR @api/team/makeadmin:25: invalid user input error:\n",
      team_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while making team user admin."
    );
  }

  let { data: result, error: _error } = await supabase.rpc("make_admin", {
    given_hierarchy_level,
    given_hierarchy_level_id,
    target_userid,
  });

  if (_error) {
    console.error(
      "ERROR @api/team/makeadmin:42: supabase making team admin error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while making team admin."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
