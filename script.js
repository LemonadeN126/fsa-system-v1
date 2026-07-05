console.log("JS CLEAN VERSION");

const btn = document.getElementById("enterButton");

btn.addEventListener("click", () => {
    alert("ENTER WORKS");

    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
});
