import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { supabase } from "$lib/server/supabase_client.server";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";

export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    //throw error(401, "You must sign in to add files.");
  }
  // console.log(session);

  const file_info = await request.json();
  // console.log(file_info);

  const user_file = file_info.file;
  let fileExt = "";
  let file_mimetype = "";
  let temp_ext = await fileTypeFromBuffer(new Uint8Array(user_file));

  if (temp_ext === undefined) {
    fileExt = file_info.filename.split(".").pop();
  } else {
    fileExt = temp_ext.ext;
    file_mimetype = temp_ext.mime;
  }


  const blob = new Blob([new Uint8Array(user_file)], { type: file_mimetype });
  //
  let temp_name = uuidv4() +"."+ fileExt;
  const filePath = "personal_files/" + temp_name;

  const { data,error } = await supabase.storage
    .from("user_personal_files")
    .upload(filePath, blob);
     if(error)console.log("04",error)
     else console.log("supabaseupload"+data)
  let given_file_extension = fileExt,
    given_file_ownerid = file_info.userid,
    given_file_url = filePath,
    given_filename = file_info.filename;

  let { data: result1 } = await supabase.rpc("add_personal_file", {
    given_file_extension,
    given_file_ownerid,
    given_file_url,
    given_filename,
  });
  console.log("add_file"+result1);

  let ret_text = result1;
  let response: Response = new Response(JSON.stringify(ret_text), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}