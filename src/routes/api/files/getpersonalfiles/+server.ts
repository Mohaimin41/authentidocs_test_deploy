import type { RequestEvent } from "./$types";
import { supabase } from "$lib/server/supabase_client.server";

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
  // console.log(session)

  const user_info = await request.json();
  let given_userid = user_info.given_userid;
  let { data: result, error: _error } = await supabase.rpc(
    "get_user_personal_files_userid",
    {
      given_userid,
    }
  );
  if (_error) {
    return new Response(
      JSON.stringify(
        "internal server error while getting user files: " + _error
      ),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }

  // console.log(data)

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
