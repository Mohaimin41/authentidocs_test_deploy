import { get } from "svelte/store";
import { notifications } from "../stores";

export class LiveNotification
{
    public id: string = "";
    public content: string = "";
    public seen: boolean = false;
    public thread_id: string = "";
}

export function get_notifications(user_id: string | null |undefined): void
{
    fetch("/api/user/getnotifications",
    {
        method: "POST",
        headers:
        {
            "content-type": "application/json"
        },
        body: JSON.stringify(
        {
            user_id: user_id
        })
    }).then(async (response: Response): Promise<void> =>
    {
        let response_obj: any = await response.json();

        notifications.set(new Array(response_obj.length));

        for(let i: number = 0; i < get(notifications).length; ++i)
        {
            get(notifications)[i] = new LiveNotification();
            get(notifications)[i].id = response_obj[i].f_notificationid;
            get(notifications)[i].content = response_obj[i].f_content;
            get(notifications)[i].seen = response_obj[i].f_is_seen;
            get(notifications)[i].thread_id = response_obj[i].f_threadid;
        }
    });
}