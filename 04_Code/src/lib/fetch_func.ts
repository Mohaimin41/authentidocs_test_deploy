export async function common_fetch(
  fetch_path: string,
  fetch_body: any,
  fetch_callback: (response: Response) => PromiseLike<void>
) {
  
  let response: Response = await fetch(fetch_path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fetch_body),
  });
  await fetch_callback(response);
}
