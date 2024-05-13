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
      "You must be logged in to do org operations"
    );
  }
  // console.log(session);
  const org_info = await request.json();
  let given_orgid = org_info.given_orgid;
  let given_userid = session.user.name;
  //console.log(org_info);
  //console.log(session.user.name);
  if (given_orgid === undefined || given_orgid === null) {
    console.error(
      "ERROR @api/org/leaveorg:22: invalid user input error:\n",
      org_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while leaving org."
    );
  }
  let { data: result, error: _error } = await supabase.rpc("leave_org", {
    given_orgid,
    given_userid,
  });

  if (_error) {
    console.error(
      "ERROR @api/org/leaveorg:37: supabase leaving org error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while leaving org."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
