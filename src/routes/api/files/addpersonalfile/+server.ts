import { json, error } from "@sveltejs/kit"
import type { RequestEvent } from "./$types"
import { supabase } from "$lib/server/supabase_client.server";
import {fileTypeFromFile} from 'file-type';
const { v4: uuidv4 } = require('uuid');

export async function POST({
    request,
    cookies,
    locals,
  }: RequestEvent): Promise<Response> {
    const session = await locals.getSession()
  if (!session?.user) {
    throw error(401, "You must sign in to add files.")
  }
  console.log(session)
  
    const file_info = await request.json();
    console.log(file_info);

    const user_file = file_info.file
    let fileExt = ''
    let temp_ext = await fileTypeFromFile(user_file)
    if ( temp_ext === undefined) {
      const fileExt = user_file.name.split('.').pop()
    } else {
      fileExt = temp_ext.ext
    }
		//
		const filePath =uuidv4() + fileExt  

  
    const { data:result} = await supabase.storage
      .from('public_files')
      .upload(filePath, user_file)
    
    
  
    let ret_text;
    let response: Response = new Response(JSON.stringify(ret_text), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  
  
    return response;
  }
  