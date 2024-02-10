import { supabase } from "$lib/server/supabase_client.server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new (error as any)(
      401,
      "You must be logged in to view team threads."
    );
  }
  // console.log(session);
  const org_info = await request.json();
  // console.log("inside add key",key_info);
  let given_orgid = org_info.teamid;

  if (given_orgid === undefined || given_orgid === null) {
    console.log(
      "ERROR @api/team/getthreads:23: invalid user input error:\n",
      org_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while getting team threads."
    );
  }


  let { data:result, error:_error } = await supabase
  .rpc('get_org_team_list', {
    given_orgid
  })


  // console.log("add key rps result",result)
  if (_error) {
    console.log(
      "ERROR @api/team/getthreads:42: supabase get team threads error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while getting team threads."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
