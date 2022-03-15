import { hello } from "../../declarations/hello";
import { Principal } from "@dfinity/principal";

$(function(){

    $(".label").click(function(){

        $(".label").addClass("gray");
        $(".text").addClass("hide");
        $(this).removeClass("gray");
        $(".text").eq($(this).index()).removeClass("hide");
    })

    $("#post").click(post);
    $("#follow").click(follow)
    $("#unfollow").click(unFollow);
    $("#setname").click(setName);

    $("#followsList").on("click","a", function() {

        let principal = $(this).next("span").find("pid").text();
        specialPosts(principal);
        $(".label").addClass("gray");
        $("#follows").addClass("hide");
        $(".label").eq(3).removeClass("gray");
        $("#special").removeClass("hide");
     });

    $("#followsList").on("click","pid", function() {

        $("#principal").val($(this).text());
     });

    async function setName() {

        $("#setname").attr("disabled", true);
        $("#nameErr").text("");

        let name = $("#name").val();
        let password = $("#password").val();

        try {
            await hello.set_name(name, password);
        } catch(err) {
            console.log(err);
            $("#nameErr").text("Set name Faild !");
        }

        $("#setname").attr("disabled", false);
    }

    async function getName() {

        try {
            let name = await hello.get_name();
            $("#current").text(name);
        } catch(err) {
            console.log(err);
            $("#current").text("Get name Faild !");
        }
    }

    async function follow() {

        $("#follow").attr("disabled", true);
        $("#followErr").text("");

        let principal = Principal.fromText($("#principal").val());
        let password = $("#password").val();

        try {
            await hello.follow(principal, password);
        } catch(err) {
            console.log(err);
            $("#followErr").text("Follow Faild !");
        }

        $("#follow").attr("disabled", false);
    }

    async function unFollow() {

        $("#unfollow").attr("disabled", true);
        $("#followErr").text("");

        let principal = Principal.fromText($("#principal").val());
        let password = $("#password").val();

        try {
            await hello.unfollow(principal, password);
        } catch(err) {
            console.log(err);
            $("#followErr").text("UnFollow faild !");
        }

        $("#unfollow").attr("disabled", false);
    }

    var num = 0;
    async function follows() {

        try {
            let follows = await hello.follows();
            if (follows.length == num) {return;} else {num = follows.length;}
            $("#followsList").text("");
            for (let i = follows.length - 1; i >= 0; i --) {
                let name = await hello.get_other_name(follows[i]);
                let html = '<a>@ ' + name + '</a><span class="time"><br>Pid : <pid>' + follows[i] + "</pid></span><br><br>";
                $("#followsList").append(html);
            }
        } catch(err) {
            console.log(err);
            $("#follows").html('<p style="color:red;">Get follows faild !</p>');
        }
    }

    async function post() {

        $("#post").attr("disabled", true);
        $("#error").text("");

        let text = $("#message").val();
        let password = $("#password").val();

        try {
            await hello.post(text, password);
        } catch(err) {
            console.log(err);
            $("#error").text("Post faild !");
        }

        $("#post").attr("disabled", false);
    }

    async function posts() {

        try {
            let posts = await hello.posts(0);
            $("#postsList").text("");
            for (let i = posts.length - 1; i >= 0; i --) {
                let html = posts[i].text + '<br><span class="time">Author : ' 
                    + posts[i].author + "&nbsp;&nbsp;&nbsp;&nbsp;Time : " 
                    + formatDate(posts[i].time.toString()/1000000) + "</span><br><br>";
                $("#postsList").append(html);
            }
        } catch(err) {
            console.log(err);
            $("#postsList").html('<p style="color:red;">Get my posts faild !</p>');
        }
    }

    async function specialPosts(pid) {

        $("#specialPosts").text("Posts is loading ......");

        try {
            let principal = Principal.fromText(pid);
            let posts = await hello.specialPosts(principal, 0);
            $("#specialPosts").text("");
            for (let i = posts.length - 1; i >= 0; i --) {
                let html = posts[i].text + '<br><span class="time">Author : ' 
                    + posts[i].author + "&nbsp;&nbsp;&nbsp;&nbsp;Time : " 
                    + formatDate(posts[i].time.toString()/1000000) + "</span><br><br>";
                $("#specialPosts").append(html);
            }
        } catch(err) {
            console.log(err);
            $("#specialPosts").html('<p style="color:red;">Get special posts faild !</p>');
        }
    }

    async function timeLine() {

        try {
            let posts = await hello.timeline(0);
            $("#timeList").text("");
            for (let i = 0; i < posts.length; i ++) {
                let html = posts[i].text + '<br><span class="time">Author : ' 
                    + posts[i].author + "&nbsp;&nbsp;&nbsp;&nbsp;Time : " 
                    + formatDate(posts[i].time.toString()/1000000) + "</span><br><br>";
                $("#timeList").append(html);
            }
        } catch(err) {
            console.log(err);
            $("#timeList").html('<p style="color:red;">Get timeline faild !</p>');
        }
    }

    function formatDate(nanoSecond) { 

        var now = new Date(nanoSecond);
        var year = now.getFullYear();  //取得4位数的年份
        var month = now.getMonth() + 1;  //取得日期中的月份，其中0表示1月，11表示12月
        if (month < 10) {month = "0" + month;}
        var date = now.getDate();      //返回日期月份中的天数（1到31）
        if (date < 10) {date = "0" + date;}
        var hour = now.getHours();     //返回日期中的小时数（0到23）
        if (hour < 10) {hour = "0" + hour;}
        var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
        if (minute < 10) {minute = "0" + minute;}
        var second = now.getSeconds(); //返回日期中的秒数（0到59）
        if (second < 10) {second = "0" + second;}
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second; 
    } 

    posts();
    timeLine();
    follows();
    getName();
    setInterval(posts, 2000);
    setInterval(timeLine, 2000);
    setInterval(follows, 2000);
    setInterval(getName, 2000);

})