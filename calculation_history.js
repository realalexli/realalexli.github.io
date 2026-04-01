
for (let i = 1;; i++) {
    x = localStorage.getItem("calculation_" + i);
    if (x == null) {
        break;
    };

    data = x.split(",");

    console.log(data);

    let div = document.createElement("div");
    div.setAttribute("class", "card");

    // number
    let number = document.createElement("h");
    number.append(i + ".");
    number.setAttribute("class", "number");

    // [distance, distance_unit, time, pace, pace_unit]
    let d = document.createElement ("p");
    d.append("Distance: " + data[0] + " " + data[1]);

    let t = document.createElement("p");
    t.append("Time: " + data[2]);

    let p = document.createElement("p");
    p.append("Pace: " + data[3] + " " + data[4]);

    div.append(number);
    div.append(d);
    div.append(t);
    div.append(p);

    let history_container = document.getElementById("history_container");

    history_container.prepend(div);

};


clear = document.getElementById("clear");
clear.addEventListener("click", function() {
    localStorage.clear();
    history_container.hidden = true;
});
