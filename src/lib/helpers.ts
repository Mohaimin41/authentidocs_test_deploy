const all_colors: string[] = ["red", "green", "blue", "purple"];
const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function gen_random_color(): string
{
    return all_colors[Math.round(Math.random() * (all_colors.length - 1))];
}

export function make_date(date: Date): string
{
    if(date === null || date === undefined)
    {
        return "";
    }

    return months[date.getMonth()] + " " + date.getDate().toString().padStart(2, "0") + ", " + date.getFullYear();
}

export function make_time(date: Date): string
{
    if(date === null || date === undefined)
    {
        return "";
    }

    let hours: number = date.getHours();
    let ampm: string = (hours >= 12) ? " PM" : " AM";
    hours %= 12;

    return hours.toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0") + ampm;
}

export async function make_hash(password: string): Promise<string>
{
    let subtle_crypto: SubtleCrypto = window.crypto.subtle;
    let text_encoder: TextEncoder = new TextEncoder();
    let password_buffer: ArrayBuffer = await subtle_crypto.digest(
    "SHA-256",
    text_encoder.encode(password),
    );

      return [...new Uint8Array(password_buffer)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");
}