
document.getElementById("calculate_splits").disabled = true;
document.getElementById("calculate_splits").hidden = true;

// for testing
// document.getElementById("distance").value = 1600;
// document.getElementById("time").value = "6:00";
// localStorage.clear();

if (localStorage.getItem("calculation_count") == null) {
    localStorage.setItem("calculation_count", 0);
};


const calculate = document.getElementById("calculate");

calculate.addEventListener("click", function() {

let distance = document.getElementById("distance").value;
let time = document.getElementById("time").value;
let pace = document.getElementById("pace").value;
let distance_unit = document.getElementById("distance_units").value;
let pace_unit = document.getElementById("pace_units").value;

// Convert distance to meters
function standardizeDistance(distance) {
    let distance_meters = distance;
    if (distance_unit == "mi") {
        distance_meters = distance * 1609.34;
    } else if (distance_unit == "km") {
        distance_meters = distance * 1000;
    };
    return distance_meters;
};

// Convert time to seconds
function standardizeTime(time) {
    let times = time.split(":");
    let time_seconds = time;
    if (times.length == 2) {
        time_seconds = Number(times[0]) * 60 + Number(times[1]);
    } else if (times.length == 3) {
        time_seconds = Number(times[0]) * 3600 + Number(times[1]) * 60 + Number(times[2]);
    };
    return time_seconds;
};

// Convert seconds to time with colons
function reverseStandardizeTime(seconds) {
    let time_reversed = seconds;
    if (seconds > 60 && seconds < 3600) {
        let extra_zero = "";
        if ((seconds % 60) < 10) {
            extra_zero = "0";
        };
        time_reversed = String(Math.trunc(seconds / 60))+ ":" + extra_zero + (seconds % 60).toFixed(2);
    } else if (seconds >= 3600) {
        let extra_zero_minutes = "";
        let extra_zero_seconds = "";
        if ((Math.trunc((seconds % 3600) / 60)) < 10) {
            extra_zero_minutes = "0";
        };
        if (((seconds % 3600) % 60) < 10) {
            extra_zero_seconds = "0";
        };
        time_reversed = String(Math.trunc(seconds / 3600))+ ":" + extra_zero_minutes + String(Math.trunc((seconds % 3600) / 60)) + ":" + extra_zero_seconds + ((seconds % 3600) % 60).toFixed(0);
    };
    return time_reversed;
};


let successful = false;
// Calculate pace

if (distance != "" && time != "" && pace == "") {
    let pace_calculated;
    if (pace_unit == "min/mi") {
        pace_calculated = reverseStandardizeTime(standardizeTime(String((standardizeTime(time) / 60) / (standardizeDistance(distance)/1609.34)) + ":0"));
    } else if (pace_unit == "min/km") {
        pace_calculated = reverseStandardizeTime(standardizeTime(String((standardizeTime(time) / 60) / (standardizeDistance(distance)/1000)) + ":0"));
    } else if (pace_unit == "mi/hr") {
        pace_calculated = ((standardizeDistance(distance)/1609.34) / (standardizeTime(time) / 3600)).toFixed(2);
    } else if (pace_unit == "km/hr") {
        pace_calculated = ((standardizeDistance(distance)/1000) / (standardizeTime(time) / 3600)).toFixed(2);
    } else if (pace_unit == "m/s") {
        pace_calculated = (standardizeDistance(distance) / standardizeTime(time)).toFixed(2);
    };
    document.getElementById("pace").value = pace_calculated;
    pace = pace_calculated;
    successful = true;
};

// Calculate time
if (distance != "" && time == "" && pace != "") {
    let time_calculated;
    if (pace_unit == "min/mi") { // distance * pace = time
        time_calculated = reverseStandardizeTime((standardizeDistance(distance) / 1609.34) * standardizeTime(pace));
    } else if (pace_unit == "min/km") {
        time_calculated = reverseStandardizeTime((standardizeDistance(distance) / 1000) * standardizeTime(pace));
    } else if (pace_unit == "mi/hr") { // distance / speed = time, I used meters / m/s
        time_calculated = reverseStandardizeTime(standardizeDistance(distance) / ((pace / 3600) * 1609.34));
    } else if (pace_unit == "km/hr") {
        time_calculated = reverseStandardizeTime(standardizeDistance(distance) / ((pace / 3600) * 1000));
    } else if (pace_unit == "m/s") {
        time_calculated = reverseStandardizeTime(standardizeDistance(distance) / pace);
    }
    document.getElementById("time").value = time_calculated;
    time = time_calculated;
    successful = true;
};

// Calculate distance
if (distance == "" && time != "" && pace != "") {
    let distance_calculated_meters;
    let distance_calculated;
    if (pace_unit == "min/mi") { // time / pace = distance
        distance_calculated_meters = standardizeTime(time) / (standardizeTime(pace)) * 1609.34;
    } else if (pace_unit == "min/km") {
        distance_calculated_meters = standardizeTime(time) / (standardizeTime(pace)) * 1000;
    } else if (pace_unit == "mi/hr") { // pace * time = distance
        distance_calculated_meters = ((pace / 3600)  * standardizeTime(time)) * 1609.34;
    } else if (pace_unit == "km/hr") {
        distance_calculated_meters = ((pace / 3600)  * standardizeTime(time)) * 1000;
    } else if (pace_unit == "m/s") {
        distance_calculated_meters = pace  * standardizeTime(time);
    };

    if (distance_unit == "m") {
        distance_calculated = distance_calculated_meters;
    } else if (distance_unit == "mi") {
        distance_calculated = distance_calculated_meters / 1609.34;
    } else if (distance_unit == "km") {
        distance_calculated = distance_calculated_meters / 1000;
    };
    document.getElementById("distance").value = distance_calculated.toFixed(2);
    distance = distance_calculated.toFixed(2);
    successful = true;
};

blank_fields = 0
if (distance == "") {blank_fields++};
if (time == "") {blank_fields++};
if (pace == "") {blank_fields++};
if (blank_fields > 1) {
    alert("At least two boxes need to be filled");
}

// Enable splits
if (successful == true) {
    document.getElementById("calculate_splits").disabled = false;

    // save to local storage
    console.log(localStorage.getItem("calculation_count"));

    key = "calculation_" + String(parseInt(localStorage.getItem("calculation_count")) + 1);
    console.log(key)
    localStorage.setItem(key, [distance, distance_unit, time, pace, pace_unit]);
    localStorage.setItem("calculation_count", parseInt(localStorage.getItem("calculation_count")) + 1);

}
// console.log(distance, time, pace);
// console.log(distance_unit, pace_unit)
});


// unfinished
// const calculate_splits = document.getElementById("calculate_splits");

// calculate_splits.addEventListener("click", function() {
//     window.location.href = "splits.html"
//     let distance = document.getElementById("distance").value;
//     let time = document.getElementById("time").value;
//     let pace = document.getElementById("pace").value;
//     let distance_unit = document.getElementById("distance_units").value;
//     let pace_unit = document.getElementById("pace_units").value;

// });

const calculation_history = document.getElementById("calculation_history");

calculation_history.addEventListener("click", function() {
    window.location.href = "calculation_history.html";
});

