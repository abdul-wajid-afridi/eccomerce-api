export type UserProps = {
    user_id?: number | undefined,
    agent_id?: number | undefined,
    role_id?: number | undefined,
    f_name?: string | undefined,
    l_name?: string | undefined,
    mobile_no?:string | undefined,
    email?:string | undefined,
    status?:number | undefined
}

  
  export interface GlobalRequest extends Request {
    user: UserProps
  }