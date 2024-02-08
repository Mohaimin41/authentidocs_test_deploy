import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(JSON.stringify("you must be logged in to mark notifications read"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  const noti_info = await request.json();

  let given_userid = noti_info.user_id;
  let given_notificationid = noti_info.notificationid;

  let { data: result, error: _error } = await supabase.rpc(
    "set_user_notification_seen",
    {
      given_notificationid,
      given_userid,
    }
  );

  if (_error) {
    console.log(
      "ERROR @api/user/readnotifications:32: supabase setting notification as read error\n",
      _error
    );
    return new Response(JSON.stringify("internal server error: " + _error), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
