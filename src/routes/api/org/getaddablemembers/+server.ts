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
      "You must be logged in to view thread members"
    );
  }

  // console.log(session);
  const org_info = await request.json();
  // console.log("inside add key",key_info);
  let given_orgid = org_info.orgid;

  if (given_orgid === undefined || given_orgid === null) {
    console.log(
      "ERROR @api/thread/getaddablemembers:24: invalid user input error:\n",
      org_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while getting thread addable members."
    );
  }


  let { data:result, error:_error } = await supabase
  .rpc('get_org_addable_member_list', {
    given_orgid
  })



  // console.log("add key rps result",result)
  if (_error) {
    console.log(
      "ERROR @api/thread/getaddablemembers:43: supabase get addable thread members error\n",
      _error
    );
    return  new (error as any)(500, "Internal Server Error, while getting addable member to thread.");
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
