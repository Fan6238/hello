import type { Principal } from '@dfinity/principal';
export interface Message { 'text' : string, 'time' : bigint, 'author' : string }
export type Time = bigint;
export interface _SERVICE {
  'follow' : (arg_0: Principal, arg_1: string) => Promise<undefined>,
  'follows' : () => Promise<Array<Principal>>,
  'get_name' : () => Promise<[] | [string]>,
  'get_other_name' : (arg_0: Principal) => Promise<[] | [string]>,
  'post' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'posts' : (arg_0: Time) => Promise<Array<Message>>,
  'set_name' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'specialPosts' : (arg_0: Principal, arg_1: Time) => Promise<Array<Message>>,
  'timeline' : (arg_0: Time) => Promise<Array<Message>>,
  'unfollow' : (arg_0: Principal, arg_1: string) => Promise<undefined>,
}
