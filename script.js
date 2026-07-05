console.log("JS IS RUNNING");

const loading = document.getElementById("loadingText");
const btn = document.getElementById("enterButton");

const text = [
    "Loading.",
    "Loading..",
    "Loading...",
    "Connection established."
];

let i = 0;

const timer = setInterval(() => {

    if (loading) loading.textContent = text[i];

    if (i === text.length - 1) {
        clearInterval(timer);
        btn.classList.add("show");
    }

    i++;

}, 700);


btn.addEventListener("click", () => {
    alert("ENTER CLICKED");

    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
});