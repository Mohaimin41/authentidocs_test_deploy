import { supabase } from "$lib/server/supabase_client.server";

export async function POST(): Promise<Response> {
  let ret_text;
  ret_text = {
    ret_text: "Hello from AuthentiDocs team. The server is alive still .",
  };

  return new Response(JSON.stringify(ret_text), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
