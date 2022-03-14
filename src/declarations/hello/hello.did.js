export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Message = IDL.Record({
    'text' : IDL.Text,
    'time' : IDL.Int,
    'author' : IDL.Text,
  });
  return IDL.Service({
    'follow' : IDL.Func([IDL.Principal, IDL.Text], [], []),
    'follows' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'get_name' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'get_other_name' : IDL.Func([IDL.Principal], [IDL.Opt(IDL.Text)], []),
    'post' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'posts' : IDL.Func([Time], [IDL.Vec(Message)], ['query']),
    'set_name' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'specialPosts' : IDL.Func([IDL.Principal, Time], [IDL.Vec(Message)], []),
    'timeline' : IDL.Func([Time], [IDL.Vec(Message)], []),
  });
};
export const init = ({ IDL }) => { return []; };
