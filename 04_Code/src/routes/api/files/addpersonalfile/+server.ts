import type { RequestEvent } from "./$types";
import { supabase } from "$lib/server/supabase_client.server";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.auth();
  if (!session?.user) {
    //throw error(401, "You must sign in to add files.");
    return new Response(JSON.stringify("you must be logged in to add files"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  // console.log(session);

  // const file_info = await request.json();
  const file_formData = await request.formData();
  if (file_formData === undefined) {
    console.log("ERROR @api/files/addpersonalfile:26: form data undefined\n")
    return new Response(
      JSON.stringify("Invalid Input. No data found in request body"),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 422,
      }
    );
  }
  // console.log(file_info);
  const file_data = file_formData.get("file") as File;

  // const user_file = file_info.file;
  let fileExt = "";
  let file_mimetype = "";
  let ret_mime;
  let temp_ext = await fileTypeFromBuffer(
    new Uint8Array(await file_data.arrayBuffer())
  );

  if (temp_ext === undefined) {
    fileExt = file_data.name?.split(".").pop() as string;
    ret_mime = 3;
  } else {
    fileExt = temp_ext.ext;
    file_mimetype = temp_ext.mime;
    let file_mime = file_mimetype.split("/").reverse().pop();
    if (file_mime === "image") {
      ret_mime = 1;
    } else if (file_mimetype === "application/pdf") {
      ret_mime = 2;
    } else {
      ret_mime = 3;
    }
  }

  // const blob = new Blob([new Uint8Array(user_file)], { type: file_mimetype });
  //
  let temp_name = uuidv4() + "." + fileExt;
  const filePath = "personal_files/" + temp_name;

  const { data: _result, error: _error } = await supabase.storage
    .from("user_personal_files")
    .upload(filePath, file_data);

  if (_error) {
    console.log("ERROR @api/files/addpersonalfile:74: supabase file upload error\n", _error)
    return new Response(
      JSON.stringify(
        "internal server error while uploading to file server" + _error
      ),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }

  let given_file_extension = fileExt,
    given_file_ownerid = file_formData.get("userid") as string,
    given_file_url = filePath,
    given_filename = file_data.name as string,
    given_file_mimetype = ret_mime;

  let { data: _result1, error:_error1} = await supabase.rpc("add_personal_file", {
    given_file_extension,
    given_file_mimetype,
    given_file_ownerid,
    given_file_url,
    given_filename,
  });
  if (_error1) {
    
    console.log("ERROR @api/files/addpersonalfile:103: supabase file data insert error\n", _error1)
    return new Response(
       JSON.stringify(
        "internal server error while adding file data to database" + _error1
      ),
      {
      
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
  // console.log("add_file"+result1);

  let response: Response = new Response(JSON.stringify(_result1), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
