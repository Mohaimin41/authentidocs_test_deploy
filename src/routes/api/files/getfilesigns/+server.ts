import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(JSON.stringify("you must be logged in to add files"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }

  const file_info = await request.json();

  let given_fileid = file_info.fileid;
  // console.log("getfilesigns 19:", given_fileid);

  let { data: result, error: _error } = await supabase.rpc(
    "get_file_signatures_fileid",
    {
      given_fileid,
    }
  );
  // if (error) console.log("getfilesigns 24: ",error.toString());
  // console.log("getfilesigns 25: ", result);
  if (_error) {
    console.log("ERROR @api/files/getfilesigns:32: supabase get file signatuers error\n", _error)
    return new Response(
      JSON.stringify(
        "internal server error while getting file signatures: " + _error
      ),
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
