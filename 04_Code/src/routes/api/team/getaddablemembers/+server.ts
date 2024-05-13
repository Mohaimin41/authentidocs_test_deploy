import { supabase } from "$lib/server/supabase_client.server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.auth();
  if (!session?.user) {
    return new (error as any)(401, "You must be logged in to add team members");
  }

  // console.log(session);
  const team_info = await request.json();
  let given_teamid = team_info.teamid;

  if (given_teamid === undefined || given_teamid === null) {
    console.error(
      "ERROR @api/team/getaddablemembers:21: invalid user input error:\n",
      team_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while getting team addable members."
    );
  }

  let { data: result, error: _error } = await supabase.rpc(
    "get_team_addable_member_list",
    {
      given_teamid,
    }
  );

  
  if (_error) {
    console.error(
      "ERROR @api/team/getaddablemembers:40: supabase get addable team members error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while getting addable member to team."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
//team/getaddablemembers