import m, { MomentInput } from "moment-timezone"

export const moment = (input?: MomentInput) => m(input).tz(process.env.TIMEZONE!)
export const momentClient = (input?: MomentInput) => m(input).tz(process.env.NEXT_PUBLIC_TIMEZONE!)