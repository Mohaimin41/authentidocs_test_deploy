import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";
import { json, error } from "@sveltejs/kit";



export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    throw error(401, "You must sign in to add file signatures.");
  }
  const file_info = await request.json();
  // console.log(key_info);
  let ret_text;
  let given_fileid=file_info.fileid
  let given_userid=file_info.user_id

    

  let { data:result} = await supabase
  .rpc('get_user_personal_file_single_userid', {
    given_fileid, 
    given_userid
  })
if (error) console.error(error)
else console.log(result)

// console.log(result)

const { data:result1} = await supabase
  .storage
  .from("user_personal_files")
  .download(result.file_url)

  let file_buffer: ArrayBuffer | undefined = await result1?.arrayBuffer();

  ret_text= Array.from(new Uint8Array(file_buffer as ArrayBuffer));
   
  let response: Response = new Response(JSON.stringify(ret_text), {
  headers: {
    "Content-Type": "application/json",
  },
});


  return response;
}
