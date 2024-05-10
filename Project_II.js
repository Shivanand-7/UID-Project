let classesNames = new Array;
let select = document.getElementById("select");
let popup = document.getElementById("pop-up");
let selectedClass;
let tbody = document.getElementById("table-body");
let data = JSON.parse(localStorage.getItem(selectedClass));
setOptions();
makeTable();
updateFeeStatusDisplay();

function checks() {
    let curDate = localStorage.getItem("currentDate");
    let preDate = localStorage.getItem("previousDate");
    if (curDate < preDate) {
        resetCondition();
    }
}
function classChange(classValue) {
    selectedClass = classValue;
}
function remove(arr, element) {
    let newArr = [];
    for (const elem of arr) {
        if (elem[0] === element)
            continue;
        newArr.push(elem)
    }
    return newArr;
}
function setOptions() {
    if (localStorage.getItem('classesNames')) {
        let options = JSON.parse(localStorage.getItem("classesNames"));
        let selectedOption;
        select.innerHTML = ``;
        if (localStorage.getItem("selectedOption")) {
            selectedClass = localStorage.getItem("selectedOption");
            selectedOption = localStorage.getItem("selectedOption");

        }
        for (const option of options) {
            if (selectedOption == option[0]) {
                select.innerHTML += `<option value="${option[0]}" selected>${option[0]}</option>`;
                continue;
            }
            select.innerHTML += `<option value="${option[0]}">${option[0]}</option>`;
        }
    }
    if (selectedClass === undefined || selectedClass === null) {
        try { selectedClass = select.firstChild.value; }
        catch (e) { }
    }
}
function showAddClassPopup() {
    popup.classList.replace("hidden", "popup");
    popup.innerHTML = `<div class="popupElements">
        <label for="">Enter Class name:</label>
        <input type="text" class="input" id="class-name">
        <br>
        <label for="">Fee per subject:</label>
        <input type="number" class="input" id="class-fee">
        <button class="btn" style="position: relative;  top: 25px;" onclick="hideAddClassPopup()">Done</button>
    </div>`;
}
function hideAddClassPopup() {
    let className = document.getElementById("class-name");
    let classFee = document.getElementById("class-fee");
    selectedClass = className.value;
    localStorage.setItem("selectedOption", selectedClass);
    popup.classList.replace("popup", "hidden");
    if (className.value == "") {
        return
    }
    if (localStorage.getItem("classesNames")) {
        classesNames = JSON.parse(localStorage.getItem("classesNames"));
    }
    classesNames.push([className.value, classFee.value]);
    localStorage.setItem("classesNames", JSON.stringify(classesNames));
    localStorage.setItem(className.value, JSON.stringify([]));
    popup.innerHTML = ``;
    location.reload();
}
function deleteCurrentClass() {
    if (select.innerHTML == "") {
        return;
    }
    if (confirm("Are you sure you want to delete this class:")) {
        let arrays = JSON.parse(localStorage.getItem("classesNames"));
        arrays = remove(arrays, selectedClass);
        localStorage.removeItem(selectedClass);
        localStorage.setItem("classesNames", JSON.stringify(arrays));
        selectedClass = select.firstChild.value;
        localStorage.setItem("selectedOption", selectedClass);
    }
    location.reload();
}
function feeOfSelectedClass() {
    return fee;
}
function showAddStudentPopup() {
    popup.classList.replace("hidden", "popup");
    popup.innerHTML = `<div class="popupElements">
    <form id="form">
        <label for="name">Enter Student name:</label>
        <br>
        <input type="text" id="name" class="input">
        <br>
        <label for="noOfSub">NO of subjects:</label>
        <br>
        <input type="number" id="noOfSub" class="input">
        <br>
        <label for="contact">Contact number:</label>
        <br>
        <input type="number" id="contact" class="input">
        <br>
        </form>
        <button class="btn right" style="position: relative;  top: 25px;" onclick = "hideAddStudentPopup()">Add Student</button>
</div>`;
}
function hideAddStudentPopup() {
    let name = document.getElementById("name");
    if (select.innerHTML == "" || name.value == "") {
        popup.classList.replace("popup", "hidden");
        popup.innerHTML = ``;
        location.reload();
        return
    }
    let noOfSub = document.getElementById("noOfSub");
    let contact = document.getElementById("contact");
    let studentDataArray = JSON.parse(localStorage.getItem(selectedClass));
    let studentData = makeObj(name.value, noOfSub.value, contact.value);
    if (studentDataArray === null) {
        studentDataArray = [];
    }
    studentDataArray.push(studentData);
    localStorage.setItem(selectedClass, JSON.stringify(studentDataArray));
    popup.classList.replace("popup", "hidden");
    popup.innerHTML = ``;
    location.reload();
}
function makeTableRow(studentData) {
    let tr = ``;
    if (studentData.condition == "Pending" && (new Date).getDate() > 5) {
        tr += `<tr class="bg-lightRed">`
    }
    else if (studentData.condition == "Received") {
        tr += `<tr class="bg-lightGreen">`;
    }
    else {
        tr += `<tr>`;
    }
    tr += `<td>${getSrNO()}</td>
            <td>${studentData.name}</td>
            <td>${studentData.condition}</td>
            <td>${studentData.noOfSub}</td>
            <td>${studentData.fee}</td>
            <td>${studentData.contact}</td>
            <td>
                <button class="btn bg-green" onclick="feeReceived(this)">Receive</button>
                <button class="btn" onclick="resetFeeStatus(this)">Reset Fee</button>
                <br>
                <button class="btn bg-red" onclick="deleteStudent(this)">Delete Student</button>                       
            </td>
        </tr>`;

    tbody.innerHTML += tr;

}
function getSrNO() {
    try {
        let tr = tbody.lastElementChild;
        let td = tr.firstElementChild;
        let srNO = Number(td.innerHTML);
        return (srNO + 1).toString();
    } catch (e) {
        return "1";
    }
}
function makeTable() {
    try {
        selectedClass = localStorage.getItem("selectedOption");
    } catch (e) { }
    data = JSON.parse(localStorage.getItem(selectedClass));
    tbody.innerHTML = "";
    try {
        for (const obj of data) {
            makeTableRow(obj);
        }
    }
    catch (e) {
        return;
    }
}
function setDate() {
    if (localStorage.getItem("currentDate")) {
        let curDate = localStorage.getItem("currentDate");
        localStorage.setItem("previousDate", curDate);
    }
    localStorage.setItem("currentDate", (new Date).getDate());
    checks();
}
function feeReceived(btnElem) {
    let tr = btnElem.parentElement.parentElement;
    let srNO = Number(tr.firstElementChild.innerHTML);
    for (let i = 0; i < data.length; i++) {
        if ((srNO - 1) === i) {
            data[i].condition = "Received";
            localStorage.setItem(selectedClass, JSON.stringify(data));
            location.reload();
            break;
        }
    }
}
function deleteStudent(value) {
    if (confirm("Are you sure to delete this student.")) {
        let tr = value.parentElement.parentElement;
        let srNO = Number(tr.firstElementChild.innerHTML);
        let newData = [];
        for (let i = 0; i < data.length; i++) {
            if ((srNO - 1) === i) {
                continue;
            }
            newData.push(data[i]);
        }
        localStorage.setItem(selectedClass, JSON.stringify(newData));
        location.reload();
    }
}
function resetFeeStatus(btnElem) {
    let tr = btnElem.parentElement.parentElement;
    let srNO = Number(tr.firstElementChild.innerHTML);
for (let i = 0; i < data.length; i++) {
if ((srNO - 1) === i) {
    data[i].condition = "Pending";
    localStorage.setItem(selectedClass, JSON.stringify(data));
    location.reload();
    break;
    }
}
}
function displayFeeStatus() {
    let paidCount = 0;
    let pendingCount = 0;
    for (const obj of data) {
        if (obj.condition === "Received") {
            paidCount++;
        } else {
            pendingCount++;
        }
    }
    return { paidCount, pendingCount };
}

function updateFeeStatusDisplay() {
    const { paidCount, pendingCount } = displayFeeStatus();
    document.getElementById("fee-status").innerHTML = `Paid: ${paidCount}  | Pending: ${pendingCount}`;
}

function makeObj(name, noOfSub, contact) {
    let feePerSubject;
    let arrays = JSON.parse(localStorage.getItem("classesNames"));
    if (selectedClass === undefined || selectedClass === null) {
        selectedClass = select.firstChild.value;
    }
    console.log(selectedClass);
    for (const arr of arrays) {
        if (arr[0] === selectedClass) {
            feePerSubject = arr[1];
        }
    }

    return {
        name: name,
        noOfSub: noOfSub,
        contact: contact,
        condition: "Pending",
        fee: feePerSubject * noOfSub
    }
}
function selectOnLoad(value) {
    localStorage.setItem("selectedOption", value);
    setOptions();
}
function removeData() {
    if (confirm("Are you sure you want to erase all the data.")) {
        localStorage.clear();
        location.reload();
    }
}
function resetCondition() {
    if (confirm("Are you sure you reset all the conditions.")) {
        try {
            for (const obj of data) {
                obj.condition = "Pending";
            }
        } catch (e) { }
        localStorage.setItem(selectedClass, JSON.stringify(data));
        location.reload();
    }
}