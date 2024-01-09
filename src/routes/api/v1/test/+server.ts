export async function GET(): Promise<Response> {
    let ret_text;
    ret_text = "hemlo"
  
    return new Response(JSON.stringify(ret_text), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }