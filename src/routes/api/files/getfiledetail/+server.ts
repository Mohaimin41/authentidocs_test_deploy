import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(JSON.stringify("you must be logged in to view files"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  const file_info = await request.json();
  // console.log(key_info);
  let given_fileid = file_info.fileid;
  let given_userid = file_info.user_id;

  let { data: result1, error: _error1 } = await supabase.rpc(
    "get_single_filemetadata_fileid",
    {
      given_fileid,
      given_userid,
    }
  );

  if (_error1) {
    console.log(
      "ERROR @api/files/getfiledetail:32: supabase getting file data error\n",
      _error1
    );
    return new Response(
      JSON.stringify(
        "internal server error while getting file metadata: " + _error1
      ),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }

  let response: Response = new Response(
    JSON.stringify({
      result1,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response;
}
