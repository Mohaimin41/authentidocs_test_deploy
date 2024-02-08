import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(JSON.stringify("you must be logged in to view notifications"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  const user_info = await request.json();

  let given_userid = user_info.user_id;
  let notifications_list : any[] = [];

  do {
    let { data: result, error: _error } = await supabase.rpc(
      "get_user_live_notifications",
      {
        given_userid,
      }
    );
  
    if (_error) {
      console.log(
        "ERROR @api/user/getnotifications:32: supabase getting user notification error\n",
        _error
      );
      return new Response(JSON.stringify("internal server error: " + _error), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      });
    }
    notifications_list = result;  
  } while (notifications_list?.length === 0);
  

  let response: Response = new Response(JSON.stringify(notifications_list), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
