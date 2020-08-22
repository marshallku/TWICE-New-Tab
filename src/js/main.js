const ko = "ko-KR" === navigator.language,
    greetings = document.getElementById("greetings"),
    todoinput = document.getElementById("toDoInput"),
    searchinput = document.getElementById("search-input"),
    todolist = document.getElementById("toDoList"),
    labeltarget = document.querySelectorAll("label[data-target]"),
    bmlist = document.getElementById("bookmark-list"),
    focus = document.getElementById("focus");
    
let p,
    playerState,
    tmpnumber = 1,
    bmknumber = 1,
    urlnumber = 1,
    carouseli = 0,
    todoarray = [],
    bookmarkarray = [],
    time,
    focusing,
    user = {
        name: "",
        location: {
            latitude: 0,
            longitude: 0,
            city: ""
        },
        toDo: [],
        bookmark: [],
        bgOpacity: 50,
        dDay: 0,
        searchEngine: "google",
        hiddenElem: [],
        setting: {
            clock24: 0,
            mvbg: 0,
            carousel: 0,
            carouselNum: 3,
            carouselSpeed: 5,
            bgMV: 1,
            bgB: 0,
            bgSM: 0,
            displayDone: 1,
            importantDone: 1,
            pauseVisibility: 0,
            pauseFocus: 0,
            playRandom: 1
        },
        focus: {
            state: 0,
            pausedTime: 0,
            time: 0,
            ms: 0
        }
    };

Array.prototype.remove = function () {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function init() {
    const data = localStorage.getItem("TNT-userData");

    data === null || (
        user = JSON.parse(data)
    )
}

function saveData() {
    localStorage.setItem("TNT-userData", JSON.stringify(user))
}

function reset() {
    localStorage.removeItem("TNT-userData")
}

function carousel() {
    let a;
    const b = document.getElementsByClassName("carousel-item"),
        timing = Number(document.getElementById("carouselSpeed").value * 1000);
    if (!document.getElementById("mvbg").checked && document.getElementById("carousel").checked) {
        for (a = 0; a < b.length; a++)
        b[a].classList.remove("reveal");
        carouseli++,
        carouseli > b.length && (carouseli = 1),
        b[carouseli - 1].classList.add("reveal"),
        setTimeout(carousel, timing)
    }
}

function loadsetting() {
    setttrue("clock24"),
    setttrue("mvbg"),
    setttrue("carousel"),
    settval("carouselNum"),
    settval("carouselSpeed"),
    settfalse("bgMV"),
    setttrue("bgB"),
    setttrue("bgSM"),
    settfalse("displayDone"),
    settfalse("importantDone"),
    setttrue("pauseVisibility"),
    setttrue("pauseFocus"),
    setttrue("playRandom")
}

function setttrue(a) {
    1 === user.setting[a] && (document.getElementById(a).checked = 1)
}

function settval(a) {
    document.getElementById(a).value = +user.setting[a]
}

function settfalse(a) {
    0 === user.setting[a] && (document.getElementById(a).checked = 0)
}

function savesetting(item, boolean) {
    user.setting[item] = +boolean,
    saveData(),

    toast(`${ko
        ? "변경사항이 저장되었습니다."
        : "Saved"
    }`)
}

function saveradio(id, name) {
    user[name] = id,
    saveData(),

    toast(`${ko
        ? "변경사항이 저장되었습니다."
        : "Saved"
    }`)
}

function loadradio() {
    document.getElementById(user.searchEngine).checked = 1
}

function initelem() {
    Array.from(labeltarget).forEach(a => {
        const target = a.getAttribute("data-target");
        if (-1 !== user.hiddenElem.indexOf(target)) {
            document.getElementById(target).classList.add("instant-hide"),
            a.querySelector("input").checked = 0
        }
    })
}

function hideelem(t) {
    const elem = document.getElementById(t),
        trigger = document.querySelector(`label[data-target="${t}"]`).querySelector("input");
    if (!elem.classList.contains("hiding") && !trigger.checked && !elem.classList.contains("instant-hide")) {
        elem.style.opacity = "0",
        elem.classList.add("hiding"),
        user.hiddenElem.push(t),
        saveData()
    }
    else {
        elem.removeAttribute("style"),
        elem.classList.remove("hiding", "instant-hide"),
        user.hiddenElem.remove(t),
        saveData()
    }
}

function randombg() {
    const bgarray=700<=window.innerWidth?["CDNoBuI", "yQB78pP", "pb9HDW0", "EBHFvt0", "5UvsvlI", "YB4ft4S", "ucHTu5A", "RJKA8cA", "7It9gpI", "yRKJmbD", "FZh41Ox", "MsFrNXc", "OFMw9OT", "0NMgc4S", "SQL6zxU", "8m2qwTw", "GSgHNYR", "q7wmxfH", "iPFRBZN", "ZmmYlBn", "PSNiw7U", "P7EEhcz", "8N5TwtW", "JZfuclW", "iCTdv1D", "Yi1NJH2", "wMQZeTv"]:["PPLTeMk","xS3MHeE","XQMtLXx","ZuFeZOk","aR0c3AZ","EiBsqa5","xovtmVG","7TTzmPj"],
        random = bgarray[Math.round(Math.random() * (bgarray.length - 1))],
        mvcheck = document.getElementById("mvbg").checked,
        carcheck = document.getElementById("carousel").checked,
        count = Number(document.getElementById("carouselNum").value),
        wrapper = document.createElement("div"),
        vidwrapper = document.createElement("div");
    let bg, arrandom, x;

    if (mvcheck || carcheck) {
        if (mvcheck) {
            bg = document.createElement("div");
            bg.id = "videoWrapper",
            vidwrapper.id = "player",
            wrapper.id = "bg",
            bg.append(vidwrapper),
            wrapper.append(bg),
            document.body.prepend(wrapper)
        }
        if (carcheck && !mvcheck) {
            for(let i = 0; i < count; i++)
            {
                x = Math.round(Math.random() * (bgarray.length - 1)),
                arrandom = bgarray[x],
                bg = document.createElement("img"),
                bg.src = `https://i.imgur.com/${arrandom}.jpg`,
                bg.className = "carousel-item",
                wrapper.append(bg),
                bgarray.splice(x, 1)
                
            }

            wrapper.id = "bg",
            document.body.prepend(wrapper),
            bg.onload = function() {
                loadbgopacity()
            },
            window.onload = function() {
                carousel()
            }
        }
    }
    else {
        bg = document.createElement("img"),
        bg.id = "bg",
        bg.src = `https://i.imgur.com/${random}.jpg`,
        document.body.prepend(bg),
        bg.onload = function () {
            loadbgopacity()
        }
    }
}

function bgopacity() {
    const value = document.getElementById("bgopacity").value / 100,
        bg = document.getElementById("bg");

    bg.style.opacity = value,
    document.getElementById("bgo-value").innerText = value
}

function loadbgopacity() {
    const bgopacity = document.getElementById("bgopacity"),
        bg = document.getElementById("bg"),
        value = +user.bgOpacity;

        bg.style.opacity = value / 100,
        bgopacity.value = value,
        document.getElementById("bgo-value").innerText = value / 100
}

function savebgopacity() {
    user.bgOpacity = document.getElementById("bgopacity").value,
    saveData(),
    toast(`${ko
        ? "변경사항이 저장되었습니다."
        : "Saved"
    }`)
}

function getname() {
    const name = user.name,
        nameless = document.getElementById("nameless");

    "" === name
    ? (document.body.classList.add("nameplz"),
        document.getElementById("name").addEventListener("keypress", function (b) {
            "Enter" === b.key && setname(), getname()
        })
    )
    : (
        greetings.querySelector(".name").innerText = `${ko ? `${name} 님` : name}`,
        nameless !== null && nameless.remove()
    )
}

function setname() {
    const value = document.getElementById("name").value;

    "" !== value && (
        user.name = value,
        saveData(),
        toast(`${ko
            ? `${value}로 이름이 저장되었습니다.`
            : `Name has saved to ${value}`
        }`),
        document.body.classList.remove("nameplz")
    )
}

function rename() {
    const value = document.getElementById("rename").value;

    "" !== value && (
        user.name = value,
        saveData(),
        toast(`${ko
            ? `${value}로 이름이 저장되었습니다.`
            : `Name has saved to ${value}`
        }`),
        document.body.classList.remove("nameplz")
    )
}

function clock() {
    const today = new Date(),
        hour = today.getHours(),
        minutes = today.getMinutes(),
        seconds = today.getSeconds(),
        clock = document.getElementById("clock");
    clock.innerText = `${
        0 === hour
        ? "12"
        : hour > 12 && !document.getElementById("clock24").checked
        ? `${hour - 12}`
        : hour
    } : ${minutes < 10 ? `0${minutes}` : minutes} : ${seconds < 10 ? `0${seconds}` : seconds}`,

    document.getElementById("clock24").checked
    ? clock.classList.remove("pm", "am")
    : 12 < hour
    ? (clock.classList.add("pm"), clock.classList.remove("am"))
    : (clock.classList.add("am"), clock.classList.remove("pm"));
}

function setgreetings() {
    const today = new Date(),
        hour = today.getHours(),
        day = ["일", "월", "화", "수", "목", "금", "토"][today.getDay()];
    let arr, result;

    if (0 <= hour && hour <= 5) {
        ko
        ? arr = ["시간이 많이 늦었어요", "주무실 시간이 되지 않았나요"]
        : arr = ["It's too late", "I think you'd better go to bed"]
    }
    if (6 <= hour && hour <= 7) {
        ko
        ? arr = [`${day}요일 하루가 시작되네요`]
        : arr = ["Good Morning"]
    }
    if (8 <= hour && hour <= 10) {
        ko
        ? arr = ["좋은 아침입니다"]
        : arr = ["Good morning"]
    }
    if (11 <= hour && hour <= 17) {
        ko
        ? arr = ["안녕하세요", "오후 일정도 힘내세요"]
        : arr = ["Hello", "Good afternoon"]
    }
    if (18 <= hour && hour <= 23) {
        ko
        ? arr = ["오늘 하루는 잘 마무리하고 계신가요"]
        : arr = ["Did you have a great day", "Good night"]
    }

    result = arr[Math.round(Math.random() * (arr.length - 1))];

    greetings.querySelector(".punctuation").innerText = /가요|나요|Did you/g.test(result) ? "?" : ".";

    greetings.querySelector(".text").innerText = result;
}

function checktodo() {
    const a = document.querySelector(".clearallwrapper");
    0 === todoarray.length
    ? a.classList.remove("reveal")
    : (186 < toDoList.scrollHeight && todolist.classList.add("expand"), a.classList.add("reveal"));
}

function addtodo(text, important, done) {
    const li = document.createElement("div"),
        doneli = document.createElement("div"),
        span = document.createElement("span"),
        wrap = document.createElement("span"),
        ell = document.createElement("span"),
        del = document.createElement("span"),
        mod = document.createElement("span"),
        imp = document.createElement("span"),
        input = document.createElement("span"),
        id = tmpnumber,
        todoitem = {
            text : text,
            id : id,
            important : important,
            done: done
        };

    let doneinput, donespan;
        
    // for to do list
    span.innerText = text,
    span.className = "todo-text",
    wrap.className = "ico-wrap",
    ell.className = "icon-ellipsis-h",
    del.className = "icon-trash",
    mod.className = "icon-pencil",
    imp.className = "icon-exclamation",
    input.className = "checkbox",
    del.addEventListener("click", deletetodo),
    mod.addEventListener("click", modifytodo),
    input.addEventListener("click", donetodo),
    ell.addEventListener("click", function() {
        const parent = this.parentNode;
        Array.from(document.querySelectorAll(".todo-item.option")).forEach(a => {
            a !== parent && a.classList.remove("option");
        }),
        parent.classList.toggle("option")
    }),
    done === "true" && (input.checked = 1),
    imp.addEventListener("click", importanttodo),
    li.setAttribute("data-id", id),
    li.setAttribute("data-important", important),
    li.setAttribute("data-done", done),
    li.classList.add("todo-item", "darkbg"),
    wrap.append(del, mod, imp),
    li.append(input, span, wrap, ell),
    todolist.appendChild(li),

    // for done to do list
    doneinput = input.cloneNode(),
    donespan = span.cloneNode(),
    donespan.innerText = text,
    doneinput.addEventListener("click", donetodo),
    doneinput.addEventListener("click", donecheck),
    done === "true" && (doneli.className = "done"),
    doneli.setAttribute("data-id", id),
    doneli.setAttribute("data-important", important),
    doneli.setAttribute("data-done", done),
    doneli.append(doneinput, donespan),
    document.getElementById("toDoDone").querySelector(".done-inner").append(doneli)

    todoinput.value = "",
    todoarray.push(todoitem),
    tmpnumber++,
    checktodo(),
    savetodo();
}

function deletetodo(e) {
    const target = e.target.parentNode.parentNode.getAttribute("data-id"),
        filter = todoarray.filter(function(a) {
            return a.id !== Number(target)
        });
    Array.from(document.querySelectorAll(`[data-id="${target}"]`)).forEach(a => {
        a.remove()
    }),
    todoarray = filter,
    checktodo(),
    savetodo(),
    toast(`${ko
        ? "삭제했습니다."
        : "Removed"
    }`)
}

function deletedonetodo() {
    const filter = todoarray.filter(function(a) {
        return a.done === "false"
    });
    Array.from(document.querySelectorAll("[data-done='true']")).forEach(a => {
        a.remove()
    }),
    todoarray = filter,
    checktodo(),
    savetodo(),
    toast(`${ko
        ? "삭제했습니다."
        : "Removed"
    }`)
}

function displaydone() {
    document.getElementById("displayDone").checked === true
    ? document.body.classList.add("hidedone")
    : document.body.classList.remove("hidedone"),
    document.getElementById("importantDone").checked === true
    ? document.body.classList.add("importantdone")
    : document.body.classList.remove("importantdone")
}

function importanttodo(a) {
    const target = a.target.parentNode.parentNode;
    "true" === todoarray.find(x => x.id === +target.getAttribute("data-id")).important
    ? (todoarray.find(x => x.id === +target.getAttribute("data-id")).important = "false", target.setAttribute("data-important", "false"))
    : (todoarray.find(x => x.id === +target.getAttribute("data-id")).important = "true", target.setAttribute("data-important", "true")),
    savetodo()
}

function donetodo(a) {
    const target = a.target.parentNode,
        num = target.getAttribute("data-id"),
        btn = document.getElementById("openToDo");

        "true" === target.getAttribute("data-done")
        ? (target.classList.contains("todo-item") && btn.classList.remove("vibrate"), todoarray.find(x => x.id === +num).done = "false", Array.from(document.querySelectorAll(`[data-id="${num}"]`)).forEach(a => {
            a.setAttribute("data-done", "false")
        }))
        : (target.classList.contains("todo-item") && btn.classList.add("vibrate"), todoarray.find(x => x.id === +num).done = "true", Array.from(document.querySelectorAll(`[data-id="${num}"]`)).forEach(a => {
            a.setAttribute("data-done", "true")
        })),
        checktodo(),
        savetodo(),
        setTimeout(function() {
            btn.classList.remove("vibrate")
        }, 1000)
}

function donecheck() {
    const div = document.createElement("div"),
        done = document.getElementById("toDoDone"),
        btn = document.getElementById("removeDone");

    div.innerText = `${ko ? "완료한 일정이 없습니다." : "Nothing has done yet."}`,
    div.className = "nothing",

    0 === done.querySelectorAll("[data-done='true']").length
    ? (0 === done.getElementsByClassName("nothing").length && done.prepend(div), btn.classList.add("hide"))
    : (0 !== done.getElementsByClassName("nothing").length && done.removeChild(done.querySelector(".nothing")), btn.classList.remove("hide"))
}

function modifytodo(e) {
    const target = e.target.parentNode.parentNode,
        input = document.getElementById("modify"),
        popup = document.getElementById("modify-popup"),
        num = target.getAttribute("data-id");

        function modifysubmit(e) {
            e.preventDefault(),
            "" !== input.value && (
                todoarray.find(x => x.id === +num).text = input.value,
                Array.from(document.querySelectorAll(`[data-id="${num}"]`)).forEach(a => {
                    a.querySelector(".todo-text").innerText = input.value
                }),
                input.value = "",
                savetodo(),
                popup.classList.remove("reveal")
            )
        }

        popup.classList.add("reveal");
        popup.querySelector(".btn.submit").addEventListener("click", modifysubmit),
        document.getElementById("modifyForm").addEventListener("submit", modifysubmit),

        Array.from(popup.querySelectorAll(".btn")).forEach(a => {
            a.addEventListener("click", function() {
                a.parentNode.parentNode.classList.remove("reveal"),
                input.value = ""
            })
        }),

        setTimeout(function() {
            input.value = target.querySelector(".todo-text").innerText,
            input.focus()
        }, 100)
}

function todosubmit(e) {
    const todovalue = todoinput.value;
    e.preventDefault();
    "" !== todovalue && addtodo(todovalue, "false", "false")
}

function search(e) {
    const value = searchinput.value;
    e.preventDefault();
    
    if ("" !== value) {
        if (document.getElementById("google").checked) {
            location.href= `https://www.google.com/search?q=${value}`
        }
        if (document.getElementById("duckduckgo").checked) {
            location.href= `https://duckduckgo.com/?q=${value}`
        }
        if (document.getElementById("bing").checked) {
            location.href= `https://www.bing.com/search?q=${value}`
        }
        if (document.getElementById("naver").checked) {
            location.href= `https://search.naver.com/search.naver?ie=UTF-8&query=${value}`
        }
    }
}

function savetodo() {
    user.toDo = todoarray,
    saveData()
}

function loadtodo() {
    user.toDo.length !== 0 && (
        user.toDo.forEach(b => {
            addtodo(b.text, b.important, b.done)
        })
    )
}

function cleartodo() {
    todoarray = [],
    todolist.innerHTML = "",
    checktodo(),
    savetodo()
}

function checkGeo() {
    if (0 === user.location.latitude && "" === user.location.city) {
        navigator.geolocation.getCurrentPosition(getGeolocation, geoError)
    }
    else {
        getWeather(`${"" !== user.location.city ? "city" : "coord"}`)
    }
}

function getGeolocation(position) {
    user.location.latitude = position.coords.latitude,
    user.location.longitude = position.coords.longitude,
    console.log(position),
    saveData(),
    getWeather("coord")
}

function geoError() {
    user.location.city = "seoul",
    saveData(),
    getWeather("city")
}

function handleLocation(e) {
    e.preventDefault(),
    user.location.city = document.getElementById("location").value,
    saveData(),
    getWeather("city")
}

function getWeather(method) {
    document.getElementById("weather").innerHTML = "",
    fetch(`${"coord" === method ?`https://api.openweathermap.org/data/2.5/weather?lat=${user.location.latitude}&lon=${user.location.longitude}&appid=efe04316ea5b327e995a9b5e40d9ab34&units=metric`:`https://api.openweathermap.org/data/2.5/weather?q=${user.location.city}&appid=efe04316ea5b327e995a9b5e40d9ab34&units=metric`}`).then((a) => {
        return a.json()
    }).then((a) => {
        const weather = a.weather[0],
            ico = document.createElement("span"),
            wrapper = document.createElement("span"),
            text = document.createElement("span"),
            text2 = document.createElement("span"),
            detail = document.createElement("div");

        ico.className = weatherico(weather.icon),
        ico.setAttribute("title", weather.description),
        text.innerText = `${a.main.temp}°C`,
        text2.innerText = a.name,
        wrapper.className = "txt-wrapper",
        wrapper.append(text, text2),
        document.getElementById("weather").append(ico, wrapper),
        detail.id = "detailWeather",
        detail.classList.add("dropdown_content"),
        detail.append(ico.cloneNode()),
        document.body.append(detail);
    })
}

function weatherico(i) {
    let ico;

    "01d" === i && (ico = "sun2"),
    "01n" === i && (ico = "moon1"),
    "02d" === i && (ico = "cloudy2"),
    "02n" === i && (ico = "cloud3"),
    ("03d" === i || "03n" === i) && (ico = "cloud4"),
    ("04d" === i || "04n" === i) && (ico = "cloudy3"),
    ("09d" === i || "09n" === i) && (ico = "rainy3"),
    ("10d" === i || "10n" === i) && (ico = "rainy2"),
    ("11d" === i || "11n" === i) && (ico = "lightning4"),
    ("13d" === i || "13n" === i) && (ico = "snowy4"),
    "50d" === i && (ico = "weather"),
    "50n" === i && (ico = "weather1");

    return `icon-${ico}`

}

function toast(text) {
    const toast = document.getElementById("toast");

    toast.classList.add("reveal"),
    toast.innerText = text,
    setTimeout(function() {
        toast.classList.remove("reveal")
    }, 3000);
}

function checksure(text, type) {
    const sure = document.getElementById("rusure"),
        title = document.createElement("div"),
        btnwrap = document.createElement("div"),
        submit = document.createElement("span"),
        cancel = document.createElement("span");

    sure.innerHTML = "",
    title.innerHTML = text,
    submit.innerText = `${ko ? "확인" : "Yes"}`,
    cancel.innerText = `${ko ? "취소" : "Cancel"}`,
    title.className = "title",
    btnwrap.classList.add("btn-wrapper", "right"),
    submit.className = "btn",
    cancel.className = "btn",
    submit.addEventListener("click", function() {
        type === "todo" && cleartodo(),
        type === "reset" && (reset(), setTimeout(function(){location.reload()},500)),
        sure.classList.remove("reveal")
    }),
    cancel.addEventListener("click", function() {
        sure.classList.remove("reveal")
    }),
    sure.classList.add("reveal"),
    btnwrap.append(submit, cancel),
    sure.append(title, btnwrap)
}

function savedday() {
    const dday = document.getElementById("dateInput").value;

    dday === ""
    ? toast(`${ko
        ? "날짜를 입력해주세요."
        : "It's not a valid date."
    }`)
    : (
        user.dDay = dday,
        saveData(),
        toast(`${ko ? "저장됐습니다" : "Saved"}`),
        loaddday()
    )
}

function removedday() {
    user.dDay = 0,
    saveData(),
    toast(`${ko ? "삭제했습니다." : "Removed"}`),
    document.getElementById("header").querySelector(".flex-center").innerHTML = ""
}

function loaddday() {
    const header = document.getElementById("header").querySelector(".flex-center"),
        dday = user.dDay,
        datetext = document.createElement("div");
            
    let loaded, today, dist, fixed;
    document.getElementById("header").querySelector(".flex-center").innerHTML = "",
    0 !== dday && "" !== dday &&
    (
        loaded = new Date(dday).getTime(),
        today = new Date().getTime(),
        dist = loaded - today,
        fixed = Math.floor(dist / 864e5),
        datetext.className = "d-day",
        datetext.innerText = 0 <= fixed ? 0 < fixed ? `D - ${fixed}` : "D- Day" : `D + ${-fixed}`,
        datetext.setAttribute("title", dday),
        header.append(datetext)
    );
}

function dropdown(t) {
    const target = document.getElementById(t);

    Array.from(document.querySelectorAll(".dropdown_content.reveal")).forEach(a => {
        a !== target && a.classList.remove("reveal");
    }),
    target.classList.toggle("reveal")
}

function randomquotes() {
    let tw = "TWICE",
        ny = "나연",
        jy = "정연",
        mm = "모모",
        sn = "사나",
        jh = "지효",
        mn = "미나",
        dh = "다현",
        cy = "채영",
        ty = "쯔위";
    ko || (
        ny = "Nayeon",
        jy = "Jeongyeon",
        mm = "Momo",
        sn = "Sana",
        jh = "Jihyo",
        mn = "Mina",
        dh = "Dahyeon",
        cy = "Chaeyoung",
        ty = "Tzuyu"
    );
    const quotes = [
            {
                name: tw,
                text: `${ko ? "One in a million, 안녕하세요 트와이스입니다." : "One in a million, Hello we are TWICE."}`
            },
            {
                name: sn,
                text: `${ko ? "인생은 모르는 것" : "Life is something you don't know."}`
            },
            {
                name: sn,
                text: `${ko ? "인생은 눈치" : "Sense is the most important thing in life."}`
            },
            {
                name: cy,
                text: `${ko ? "이게 행복이지 모" : "That's what happiness is."}`
            },
            {
                name: cy,
                text: `${ko ? "주어진 일해 최선을 다하자" : "Do the best."}`
            },
            {
                name: ty,
                text: `${ko ? "넘어졌을 땐 알아서 일어나라" : "Just jump up when you fall down."}`
            },
            {
                name: ty,
                text: `${ko ? "나쁜 사람을 만나면 피하라" : "Avoid bad people when you face them."}`
            }
        ],
        random = quotes[Math.round(Math.random() * (quotes.length - 1))],
        target = document.getElementById("quotes");

        target.querySelector(".name").innerText = random.name,
        target.querySelector(".text").innerText = `"${random.text}"`
}

function toggleadd() {
    document.getElementById("links-list").classList.toggle("add"),
    document.getElementById("url-name").value = "",
    document.getElementById("url-url").value = ""
}

function addbookmark(name, url) {
    const id = bmknumber,
        wrapper = document.createElement("div"),
        del = document.createElement("span"),
        a = document.createElement("a"),
        item = {
            name: name,
            url: url,
            id : id
        };

    del.className = "icon-close",
    a.innerText = name,
    a.href = url,
    a.setAttribute("target", "_blank"),
    del.addEventListener("click", deletebookmark),
    wrapper.setAttribute("data-id", id),
    wrapper.append(a, del),
    bmlist.append(wrapper),
    document.getElementById("url-name").value = "",
    document.getElementById("url-url").value = "",
    bookmarkarray.push(item),
    savebookmark(),
    bmknumber++
}

function loadbookmark() {
    const bookmark = user.bookmark;

    0 !== bookmark.length &&
    (bookmark.forEach((a) => {
        addbookmark(a.name, a.url)
    }));
}

function bookmarksubmit(e) {
    let name = document.getElementById("url-name").value,
        url = document.getElementById("url-url").value;
    const http = /https?:\/\//g;

    e.preventDefault();

    if (url !== "") {
        if (name === "") {
            name = url
        }
        if (!http.test(url)) {
            url = `http://${url}`
        }
        
        addbookmark(name, url)
    }
}

function deletebookmark(e) {
    const target = e.target.parentNode,
        filter = bookmarkarray.filter(function(a) {
            return a.id !== Number(target.getAttribute("data-id"))
        });
    console.log(e.target.parentNode),
    bookmarkarray = filter,
    savebookmark(),
    setTimeout(function() {
        bmlist.removeChild(target)
    }, 10)
}

function savebookmark() {
    user.bookmark = bookmarkarray,
    saveData()
}

function youtubeVideo() {
    const main = [],
        mvarray = ["c7rCyll5AeY", "ePpPVE-GGJw", "8A2t_tAjMz8", "VQtonf1fv_s", "V2hlQkVJZhE", "rRzxEiBLQCA", "Fm5iP0S1z9w", "CfUGjK6gGgs", "kOHB85vDuow", "0rtV5esQT6I", "zi_6oaQyckM", "i0p1bmr0EmE", "mAKsZ26SabQ", "3ymwOvzhwHs"],
        barray = ["nY7Kyl9XnNM", "D_0qYiQN9ck", "6J-2s2h45v8"],
        smarray = ["2BlwXXVCAFM", "akV2TlH38oY", "qY22HPfafSQ", "3L0M9qLhLzs", "u2bFGPsxep4", "OkGay7vlWIY"];

    !0 === document.getElementById("bgMV").checked && main.pushArray(mvarray),
    !0 === document.getElementById("bgB").checked && main.pushArray(barray),
    !0 === document.getElementById("bgSM").checked && main.pushArray(smarray)
    
    return main[Math.round(Math.random() * (main.length - 1))];
}

function onYouTubePlayerAPIReady() {
    const video = youtubeVideo(),
        smallmv = ["c7rCyll5AeY", "0rtV5esQT6I", "zi_6oaQyckM", "i0p1bmr0EmE", "mAKsZ26SabQ", "3ymwOvzhwHs"],
        vid = document.getElementById("videoWrapper");
    document.getElementById("mvbg").checked && (
        smallmv.includes(video) && vid.classList.add("expand"),
        p = new YT.Player('player', {
            height: '100%',
            width: '100%',
            playerVars: {
                rel: 0,
                playsinline: 1,
                vq: 'hd1080',
                autoplay: 1,
                loop: 1,
                playlist: video,
                controls: 0,
                autohide: 1,
                showinfo: 0,
                wmode: 'opaque'
            },
            videoId: video,
            events: {
                onReady: onPlayerReady
            }
        }),
        p.addEventListener("onStateChange", function(e) {
            let tmp;
            if(e.data === 0 && document.getElementById("playRandom").checked === true) { 
                tmp = youtubeVideo();       
                p.loadVideoById (tmp),
                smallmv.includes(tmp)
                ? vid.classList.add("expand")
                : vid.classList.remove("expand")
            }
        })
    )
}

function onPlayerReady(a) {
    a.target.playVideo(), a.target.mute(),
    document.getElementById("bg").classList.add("loaded"),
    loadbgopacity()
}

function toggleSound() {
    p.isMuted() ? p.unMute() : p.mute()
}

function toggleplay() {
    p.getPlayerState() === 1
    ? p.pauseVideo()
    : p.playVideo()
}

function handleVisibilityChange() {
    document.getElementById("mvbg").checked === true && (document["hidden"] && document.getElementById("pauseVisibility").checked === true
    ? p.pauseVideo()
    : p.playVideo())
}


function toggleFullScreen() {
    const a = window.document,
        b = a.documentElement,
        c = b.requestFullscreen || b.mozRequestFullScreen || b.webkitRequestFullScreen || b.msRequestFullscreen,
        d = a.exitFullscreen || a.mozCancelFullScreen || a.webkitExitFullscreen || a.msExitFullscreen;
    a.fullscreenElement || a.mozFullScreenElement || a.webkitFullscreenElement || a.msFullscreenElement ? d.call(a) : c.call(b)
}

function initFocus() {
    if (user.focus.time - new Date().getTime() >= 0 && 1 === user.focus.state) {
        focus.classList.add("focusing", "reveal"),
        focusTimer(),
        focusInterval()
    }
    if (2 === user.focus.state) {
        focus.classList.add("paused", "reveal"),
        document.getElementById("focusCircle").style.strokeDashoffset = ((user.focus.ms - (user.focus.time - user.focus.pausedTime)) / user.focus.ms) * 440
    }
}

function focusTimer() {
    const target = user.focus.time - new Date().getTime(),
        svg = document.getElementById("focusCircle"),
        opt = {
            type: "basic",
            title: `${ko?"수고하셨습니다!":"Well Done!"}`,
            message: `${ko?"설정하신 시간이 모두 흘렀습니다. 잠시 휴식을 취하시는 게 어떨까요?":"Your focus time has done. Why don't you take a break?"}`,
            iconUrl: "icon128.png"
        };

    if (target >= 0) {
        svg.style.strokeDashoffset = ((user.focus.ms - target) / user.focus.ms) * 440
    }
    else {
        clearInterval(focusing),
        user.focus.state = 0,
        saveData(),
        focus.classList.remove("focusing"),
        svg.style.strokeDashoffset = 0
        // chrome.notifications.create("focusNoti", opt)
    }
}

function focusInterval() {
    focusing = setInterval(function() {
        focusTimer()
    }, 1000);
}

function focusSubmit(e) {
    e.preventDefault(),
    time = +document.getElementById("focusTime").value;
    const tmp = new Date().getTime() + time * 60000;

    if (time >= 0) {
        user.focus.state = 1,
        user.focus.time = tmp,
        user.focus.ms = time * 60000,
        saveData(),
        user.focus.time = tmp,
        user.focus.ms = time * 60000,
        focus.classList.add("focusing"),
        focusInterval()
        // chrome.notifications.clear("focusNoti")
    }
    else {
        toast(`${ko ? "1 이상의 수를 입력해주세요" : "Numerber should be bigger than 0"}`)
    }
}

function focusPause() {
    clearInterval(focusing),
    user.focus.state = 2,
    user.focus.pausedTime = new Date().getTime(),
    saveData(),
    focus.classList.remove("focusing"),
    focus.classList.add("paused");
}

function focusReStart() {
    user.focus.state = 1,
    user.focus.time = user.focus.time + new Date().getTime() - user.focus.pausedTime,
    saveData(),
    focus.classList.remove("paused"),
    focus.classList.add("focusing"),
    focusInterval()
}

function focusStop() {
    clearInterval(focusing),
    user.focus.state = 0,
    user.focus.pausedTime = 0,
    saveData(),
    focus.classList.remove("focusing", "paused"),
    document.getElementById("focusCircle").style.strokeDashoffset = 0
}

init(),
checkGeo(),
initelem(),loadsetting(),loadradio(),randombg(),clock(),getname(),setgreetings(),loadtodo(),loaddday(),randomquotes(),loadbookmark(),displaydone(),initFocus(),
document.addEventListener("visibilitychange", handleVisibilityChange, !1),
document.getElementById("toDoForm").addEventListener("submit", todosubmit),
document.getElementById("searchForm").addEventListener("submit", search),
document.getElementById("bookmarkForm").addEventListener("submit", bookmarksubmit),
document.getElementById("bookmarkForm2").addEventListener("submit", bookmarksubmit),
document.getElementById("focusTimeForm").addEventListener("submit", focusSubmit),
setInterval(function() {
    clock()
}, 500),
document.getElementById("opensett").addEventListener("click", function() {
    this.classList.toggle("actv")
}),
Array.prototype.pushArray = function(arr) {
    this.push.apply(this, arr);
},
Array.from(document.querySelectorAll(".dropdown_btn")).forEach(a => {
    a.addEventListener("click", function() {
        dropdown(this.getAttribute("data-target"))
    })
}),
Array.from(document.querySelectorAll(".switch")).forEach(a => {
    const b = a.querySelector("input"),
        c = b.getAttribute("type");
    c === "checkbox" && a.addEventListener("click", function() {
        savesetting(b.id, `${b.checked ? 1 : 0}`)
    }),
    c === "radio" && a.addEventListener("click", function() {
        saveradio(b.id, b.name)
    })
}),
Array.from(document.querySelectorAll(".s_input")).forEach(a => {
    a.addEventListener("input", function() {
        savesetting(a.id, a.value)
    })
}),
ko 
? (
    Array.from(document.querySelectorAll("[data-en]")).forEach(a => {
        a.removeAttribute("data-en")
    }),
    Array.from(document.querySelectorAll("[data-enpl]")).forEach(a => {
        a.removeAttribute("data-enpl")
    })
)
: (
    document.title = "New tab",
    document.documentElement.setAttribute("lang", "en"),
    Array.from(document.querySelectorAll("[data-en]")).forEach(a => {
        a.innerText = a.getAttribute("data-en"),
        a.removeAttribute("data-en")
    }),
    Array.from(document.querySelectorAll("[data-enpl]")).forEach(a => {
        a.setAttribute("placeholder", a.getAttribute("data-enpl")),
        a.removeAttribute("data-enpl")
    })
),
Array.from(labeltarget).forEach(a => {
    a.addEventListener("click", function() {
        hideelem(this.getAttribute("data-target"))
    })
}),
document.querySelector(".clearAll").addEventListener("click", function() {
    checksure(`${ko ? "모두 삭제하시겠습니까?" : "Clear to do list"}`, "todo")
}),
document.getElementById("reset").addEventListener("click", function() {
    checksure(`${ko ? "초기화 후에는 복구가 불가능합니다.<br>계속 진행하시겠습니까?" : "This will reset everything.<br>Are you sure you want to do that?"}`, "reset")
}),
document.getElementById("removeDone").addEventListener("click",deletedonetodo),
document.getElementById("datesubmit").addEventListener("click", savedday),
document.getElementById("dateremove").addEventListener("click", removedday),
document.getElementById("bgopacity").addEventListener("input", bgopacity),
document.getElementById("bgopacity").addEventListener("change", savebgopacity),
document.getElementById("add-new").addEventListener("click", toggleadd),
document.getElementById("cancel-add-new").addEventListener("click", toggleadd),
document.getElementById("openToDo").addEventListener("click", donecheck),
document.getElementById("renameSubmit").addEventListener("click", rename),
document.getElementById("focusStart").addEventListener("click", focusSubmit),
document.getElementById("focusPause").addEventListener("click", focusPause),
document.getElementById("focusStop").addEventListener("click", focusStop),
document.getElementById("focusReStart").addEventListener("click", focusReStart),
document.getElementById("locationForm").addEventListener("submit", handleLocation),
document.getElementById("locationSubmit").addEventListener("click", handleLocation),
document.getElementById("main").addEventListener("click", toggleFullScreen),
window.onclick = function(e) {
    const target = e.target;
    donecheck(),
    target.matches("#modify-popup, #modify-popup *, .icon-pencil") || document.getElementById("modify-popup").classList.remove("reveal"),
    target.matches(".todo-item.option, .todo-item.option *") || Array.from(document.querySelectorAll(".todo-item.option")).forEach(a => {
        a.classList.remove("option")
    }),
    target.matches(".dropdown_btn, .dropdown_btn *, .dropdown_content, .dropdown_content *") || Array.from(document.querySelectorAll(".dropdown_content")).forEach(a => {
        a.classList.remove("reveal")
    }),
    target.matches("#opensett, #setting, #setting *") || document.getElementById("opensett").classList.remove("actv"),
    target.matches(".clearAll, #rusure, #rusure *, #reset") || document.getElementById("rusure").classList.remove("reveal");
},
window.onblur = function() {
    document.getElementById("mvbg").checked === !0 && document.getElementById("pauseFocus").checked === !0 && p.pauseVideo()
},
window.onfocus = function() {
    document.getElementById("mvbg").checked === !0 && document.getElementById("pauseFocus").checked === !0 && p.playVideo()
},
document.addEventListener("keydown", function(e) {
    const k = e.code;
    e.target.nodeName === "INPUT" || (
        "Space" === k && document.body.classList.toggle("bgonly"),
        "KeyM" === k && toggleSound(),
        "KeyF" === k && toggleFullScreen(),
        "KeyP" === k && toggleplay()
    ),
    "Escape" === k && (Array.from(document.querySelectorAll(".reveal")).forEach(a => {
        a !== document.querySelector(".clearallwrapper") && a !== document.body && a.classList.remove("reveal")
    }), Array.from(document.querySelectorAll(".todo-item")).forEach(a => {
        a.classList.remove("option")
    }), Array.from(document.querySelectorAll("input")).forEach(a => {
        a.blur()
    }), document.getElementById("opensett").classList.remove("actv"))
}),
document.addEventListener("keyup", function(e) {
    const k = e.code;
    e.target.nodeName === "INPUT" || (
        "KeyA" === k && todoinput.focus(),
        "KeyS" === k && searchinput.focus()
    )
}),
document.body.classList.add("reveal");