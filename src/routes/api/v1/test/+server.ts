export async function GET(): Promise<Response> {
    let ret_text;
    ret_text = {ret_text:"Hello from AuthentiDocs team. The server is alive still ."}
  
    return new Response(JSON.stringify(ret_text), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }