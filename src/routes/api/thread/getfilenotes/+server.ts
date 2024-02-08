import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(JSON.stringify("you must be logged in to view file notes"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  // console.log(session);
  const file_info = await request.json();
  // console.log("inside add key",key_info);

  let given_fileid = file_info.fileid;

  let { data: result, error: _error } = await supabase.rpc(
    "get_threadfile_notes_list",
    {
      given_fileid,
    }
  );

  // console.log("add key rps result",result)
  if (_error) {
    console.log(
      "ERROR @api/thread/getfilenotes:34: supabase get file notes error\n",
      _error
    );
    return new Response(
      JSON.stringify("internal server error while getting file notes: " + _error),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
