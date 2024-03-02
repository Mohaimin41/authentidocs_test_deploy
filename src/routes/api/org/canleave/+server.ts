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
      "You must be logged in to view org condition"
    );
  }
  // console.log(session);
  const org_info = await request.json();
  // console.log("inside add key",key_info);
  let given_orgid = org_info.given_orgid;
  let given_userid = session.user.name;
  if (given_orgid === undefined || given_orgid === null) {
    console.log(
      "ERROR @api/org/canclose:22: invalid user input error:\n",
      org_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while checking org closing status."
    );
  }
  let { data:result, error:_error } = await supabase
  .rpc('can_leave_org', {
    given_orgid, 
    given_userid,
  })

  // console.log("add key rps result",result)
  if (_error) {
    console.log(
      "ERROR @api/org/canclose:37: supabase checking can close org error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while checking org closing status."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
