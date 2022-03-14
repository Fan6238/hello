import List "mo:base/List";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Principal "mo:base/Principal";

actor {

    var username : Text = "FanPeiZe";
    var followed : List.List<Principal> = List.nil();
    var messages : List.List<Message> = List.nil();

    public type Message = {
        author : Text;
        text : Text;
        time : Int;
    };

    public type Microblog = actor {
        get_name : shared query () -> async ?Text;
        // follow : shared (Principal) -> async ();
        follows : shared query () -> async [Principal];
        // post : shared (Text) -> async ();
        posts : shared query (Int) -> async [Message];
        // timeline : shared () -> async [Message];
    };

    public shared (msgCall) func set_name(name : Text, password : Text) : async () {
        assert(password == "121212");
        username := name;
    };

    public shared query func get_name() : async ?Text {
        return ?username;
    };

    public shared func get_other_name(id : Principal) : async ?Text {
        var name : ?Text = ?"";
        let canister : Microblog = actor(Principal.toText(id));
            try {
                name := await canister.get_name();
            } catch (err) {};
        return name;
    };

    public shared (msgCall) func follow(id : Principal, password : Text,) : async () {
        assert(password == "121212");
        let exist = List.some<Principal>(
            followed, 
            func(element){element == id;}
        );
        if (exist == false) {
            followed := List.push(id, followed);
        };
    };

    public shared query func follows() : async [Principal] {
        List.toArray(followed);
    };

    public shared (msgCall) func post(text : Text, password : Text,) : async () {
        assert(password == "121212");
        let msg : Message = {
            text = text;
            author = username;
            time = Time.now();
        };
        messages := List.push(msg, messages);
    };

    public shared query func posts(since : Time.Time) : async [Message] {
        var all : List.List<Message> = List.nil();
        for (msg in Iter.fromList(messages)) {
            if (msg.time >= since) {
                all := List.push(msg, all);
            };
        };
        List.toArray(all);
    };

    public shared func specialPosts(id : Principal, since : Time.Time) : async [Message] {
        var msgs : [Message] = [];
        let canister : Microblog = actor(Principal.toText(id));
        try {
            msgs := await canister.posts(since);
        } catch (err) {};
        return msgs;
    };

    public shared func timeline(since : Time.Time) : async [Message] {
        var all : List.List<Message> = List.nil();
        for (id in Iter.fromList(followed)) {
            let canister : Microblog = actor(Principal.toText(id));
            try {
                let msgs : [Message] = await canister.posts(since);
                for (msg in Iter.fromArray(msgs)) {
                    if (msg.time >= since) {
                        all := List.push(msg, all);
                    };
                };
            } catch (err) {};
        };
        List.toArray(all);
    };
}