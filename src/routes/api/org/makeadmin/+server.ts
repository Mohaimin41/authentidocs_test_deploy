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
      "You must be logged in to make an org admin"
    );
  }
  // console.log(session);
  const org_info = await request.json();
  let given_hierarchy_level = "org";
  let given_hierarchy_level_id = org_info.orgid;
  let target_userid = org_info.id;

  if (
    given_hierarchy_level_id === undefined ||
    given_hierarchy_level_id === null ||
    target_userid === undefined ||
    target_userid === null
  ) {
    console.error(
      "ERROR @api/org/makeadmin:29: invalid user input error:\n",
      org_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while making admin in org."
    );
  }

  let { data: result, error: _error } = await supabase.rpc("make_admin", {
    given_hierarchy_level,
    given_hierarchy_level_id,
    target_userid,
  });

  if (_error) {
    console.error(
      "ERROR @api/org/makeadming:46: supabase making admin in org error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while making admin in org."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
