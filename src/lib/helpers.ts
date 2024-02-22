const all_colors: string[] = ["red", "green", "blue", "purple"];

export function gen_random_color(): string
{
    return all_colors[Math.round(Math.random() * (all_colors.length - 1))];
}