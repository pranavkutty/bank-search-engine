const select_city = document.getElementById("select-city");
// select_city.addEventListener('change', () => console.log(select_city.value))
const search_bar = document.getElementById("search-bar");

const prev_button = document.getElementById("prev");
const next_button = document.getElementById("next");
const select_limit = document.getElementById("page-limit");
const table = document.getElementById("results");
const noTable = document.getElementById("no-table");
const tableBody = document.getElementById("table-body");


let offset = 0;
let lastPage = false;
let prevSearch = {
    "searchStr": search_bar.value,
    "page": select_limit.value,
    "offset": offset
};
let prevResult = {};
const disableBtn = function (btn) {
    btn.style.backgroundColor = "#00acb548";
    btn.style.cursor = "not-allowed";
}
disableBtn(prev_button);
disableBtn(next_button);

const enableBtn = function (btn) {
    btn.style.backgroundColor = "#00adb5";
    btn.style.cursor = "pointer";
}

const enableTable = function () {
    table.style.display = "block";
    noTable.style.display = "none";
}

const disableTable = function () {
    table.style.display = "none";
    noTable.style.display = "block";
}

if (offset == 0) {
    disableBtn(prev_button);
}

let checkBranchLocalStorage = function (data) {
    result = false;
    let currCityData = JSON.parse(localStorage.getItem(data["city"]));
    if (currCityData == null) return false;
    currCityData.forEach((branch) => {
        if (branch["ifsc"] == data["ifsc"]) {
            result = true;
            return;
        }
    })
    return result;
}

let addBranchLocalStorage = function (data) {
    let currCityData = JSON.parse(localStorage.getItem(data["city"]));
    if (currCityData == null)
        currCityData = [];
    currCityData.push(data);
    localStorage.setItem(data["city"], JSON.stringify(currCityData));
}

let deleteBranchLocalStorage = function (data) {
    let currCityData = JSON.parse(localStorage.getItem(data["city"]));
    currCityData.forEach((branch, index) => {
        if (branch["ifsc"] == data["ifsc"])
            currCityData.splice(index, 1);
    })
    localStorage.setItem(data["city"], JSON.stringify(currCityData));
}


addFav = function (node) {
    branchDetails = JSON.parse(decodeURIComponent(node.dataset.bankDetails));
    addBranchLocalStorage(branchDetails);
    node.src = "images/fav.png";
    node.onclick = "deleteFav(this)";
    node.alt = "fav-icon";
}

deleteFav = function (node) {
    branchDetails = JSON.parse(decodeURIComponent(node.dataset.bankDetails));
    deleteBranchLocalStorage(branchDetails);
    node.src = "images/unfav.png";
    node.onclick = "addFav(this)";
    node.alt = "unfav-icon";
}

const insertRow = function (branch) {
    let branchStr = encodeURIComponent(JSON.stringify(branch));
    tableBody.innerHTML += `
    <tr>
        <td>${branch["ifsc"]}</td>
        <td>${branch["bank_name"]}</td>
        <td>${branch["address"]}</td>
        <td>${branch["city"]}</td>
        <td>${branch["state"]}</td>
        ${checkBranchLocalStorage(branch) ? `<td><img class="fav" src="images/fav.png" alt="fav-icon" data-bank-details=${branchStr} onclick="deleteFav(this)"></td>` : `<td><img class="unfav" src="images/unfav.png" alt="unfav-icon" data-bank-details=${branchStr} onclick="addFav(this)"></td>`}
    </tr>
    `
}

const searchQuery = function () {
    if (search_bar.value == "") {
        prevSearch["searchStr"] = "";
        disableTable();
        disableBtn(next_button);
        disableBtn(prev_button);
        return;
    }
    if (prevSearch["searchStr"] == search_bar.value &&
        prevSearch["offset"] == offset &&
        prevSearch["page"] == select_limit.value &&
        prevSearch["city"] == select_city.value) {
        return;
    }

    fetch("http://localhost:3000/api/branches?q=" + search_bar.value + "&limit=" + select_limit.value + "&offset=" + offset + "&city=" + select_city.value)
        .then((res) => res.json())
        .then((data) => {
            if (data["branches"].length == 0) {
                disableTable();
                disableBtn(next_button);
                disableBtn(prev_button);
            }
            else {
                if (data["branches"].length < select_limit.value) {
                    lastPage = true;
                    disableBtn(next_button);
                }
                else {
                    enableBtn(next_button);
                }
                enableTable();
                tableBody.innerHTML = "";
                prevResult = data["branches"];
                data["branches"].forEach(branch => {
                    insertRow(branch);
                });
            }
        })
        .catch((err) => console.log(err));

    prevSearch["searchStr"] = search_bar.value;
    prevSearch["offset"] = offset;
    prevSearch["page"] = select_limit.value;
    prevSearch["city"] = select_city.value;
}
search_bar.addEventListener('keyup', () => {
    if (prevSearch["searchStr"] == search_bar.value &&
        prevSearch["offset"] == offset &&
        prevSearch["page"] == select_limit.value) {
        return;
    }
    offset = 0;
    lastPage = false;
    disableBtn(prev_button);
    enableBtn(next_button);
    searchQuery();
});

// prev offset
prev_button.addEventListener('click', () => {
    if (offset == 0) {
        return;
    }
    else if (offset == 1) {
        disableBtn(prev_button);
    }
    enableBtn(next_button);
    lastPage = false;
    offset--;
    searchQuery();
});

//next offset
next_button.addEventListener('click', () => {
    if (lastPage) {
        return;
    }
    enableBtn(prev_button);
    offset++;
    searchQuery();
});


select_limit.addEventListener('change', () => {
    offset = 0;
    lastPage = false;
    disableBtn(prev_button);
    enableBtn(next_button);
    searchQuery();
});

select_city.addEventListener('change', () => {
    offset = 0;
    lastPage = false;
    disableBtn(prev_button);
    enableBtn(next_button);
    searchQuery();
});

