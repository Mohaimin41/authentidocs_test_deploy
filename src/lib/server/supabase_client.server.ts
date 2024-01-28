import { createClient } from "@supabase/supabase-js";


import dotenv from 'dotenv'
dotenv.config()
let {DEV_DB_ANON_LINK,DEV_DB_ANON_KEY,PROD_DB_ANON_LINK,PROD_DB_ANON_KEY,NODE_ENV,VERCEL_ENV} = process.env

let DB_LINK,DB_KEY

if(VERCEL_ENV == undefined)
{
  if(NODE_ENV=='production')
{
  DB_LINK=PROD_DB_ANON_LINK
  DB_KEY=PROD_DB_ANON_KEY
}
else
{
  DB_LINK=DEV_DB_ANON_LINK
  DB_KEY=DEV_DB_ANON_KEY
}
}
else
{
  if(VERCEL_ENV=='production')
  {
    DB_LINK=PROD_DB_ANON_LINK
    DB_KEY=PROD_DB_ANON_KEY
  }
  else
  {
    DB_LINK=DEV_DB_ANON_LINK
    DB_KEY=DEV_DB_ANON_KEY
  }

}


export const supabase = createClient(
    <string>DB_LINK,
    <string>DB_KEY
  );