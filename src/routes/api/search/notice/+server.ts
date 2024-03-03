import { supabase } from "$lib/server/supabase_client.server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  // const session = await locals.auth();
  // if (!session?.user) {
  //   return new (error as any)(401, "You must be logged in to get notice details");
  // }
  const notice_info = await request.json();
  //console.log(notice_info);
  let term = notice_info.term;
  //console.log(given_noticeid)
  if (term === undefined || term === null) {
    console.error(
      "ERROR @api/search/notice:19: invalid search term input error:\n",
      notice_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while searching notice."
    );
  }

  let { data: result, error: _error } = await supabase.rpc("search_notices", {
    term,
  });

  if (_error) {
    console.error(
      "ERROR @api/search/notice:36: supabase searching notice error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while searching notice."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
