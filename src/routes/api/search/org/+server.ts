import { supabase } from "$lib/server/supabase_client.server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  // const session = await locals.auth();
  // if (!session?.user) {
  //   return new (error as any)(401, "You must be logged in to get org details");
  // }
  const org_info = await request.json();
  //console.log(org_info);
  let term = org_info.term;
  //console.log(given_orgid)
  if (term === undefined || term === null) {
    console.error(
      "ERROR @api/search/org:19: invalid org input error:\n",
      org_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while searching org details."
    );
  }

  let { data:result, error:_error } = await supabase
  .rpc('search_orgs', {
    term
  })

  if (_error) {
    console.error(
      "ERROR @api/org/details:36: supabase searching org error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while searching orgs."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
