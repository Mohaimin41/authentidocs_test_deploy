/**
 * Common class for all types of objects with similar behaviour
 */
export class Entity
{
    public uid: string = "";
    public name: string = "";
}

export class Member
{
    public uid: string = "";
    public name: string = "";
    public checked: boolean = false;
}