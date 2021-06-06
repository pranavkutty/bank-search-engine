const select_city = document.getElementById("select-city");
// select_city.addEventListener('change', () => console.log(select_city.value))
const search_bar = document.getElementById("search-bar");

const prev_button = document.getElementById("prev");
const next_button = document.getElementById("next");
const select_limit = document.getElementById("page-limit");

let offset = 0;
let limit = select_limit.value;

const disableBtn = function (btn) {
    btn.style.backgroundColor = "#00acb548";
    btn.style.cursor = "not-allowed";
}

const enableBtn = function (btn) {
    btn.style.backgroundColor = "#00adb5";
    btn.style.cursor = "pointer";
}

if (offset == 0) {
    disableBtn(prev_button);
}

const searchQuery = function () {
    fetch("http://localhost:3000/api/branches?q=" + search_bar.value + "&limit=" + select_limit.value + "&offset=" + offset)
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
}
search_bar.addEventListener('keyup', searchQuery);
