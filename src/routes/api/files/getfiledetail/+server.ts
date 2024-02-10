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
      "You must be logged in to get file details."
    );
  }
  const file_info = await request.json();
  // console.log(key_info);
  let given_fileid = file_info.fileid;
  let given_userid = file_info.user_id;

  if (
    given_fileid === undefined ||
    given_fileid === null ||
    given_userid === undefined ||
    given_userid === null
  ) {
    console.log(
      "ERROR @api/files/getfiledetail:28: invalid user input error:\n",
      file_info
    );
    return new (error as any)(422, "Invalid inputs, while getting file data.");
  }

  let { data: result1, error: _error1 } = await supabase.rpc(
    "get_single_filemetadata_fileid",
    {
      given_fileid,
      given_userid,
    }
  );

  if (_error1) {
    console.log(
      "ERROR @api/files/getfiledetail:47: supabase getting file data error\n",
      _error1
    );
    return new (error as any)(
      500,
      "Internal Server Error, while getting file data."
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
