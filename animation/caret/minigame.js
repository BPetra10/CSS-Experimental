let x = 20, y = 20;
const step = 10;

let movementEnabled = true;

const player = document.getElementById("player");
const house = document.getElementById("house");
const targetInput = document.getElementById("myAnimatedCaret");
const successTooltip = document.getElementById("successTooltip");

function movePlayer() {
    player.style.left = x + "px";
    player.style.top = y + "px";
}

function isColliding(el1, el2) {
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();

    return !(
        r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom
    );
}

document.addEventListener("keydown", (e) => {

    if (!movementEnabled) return;

    if (e.key === "ArrowRight") x += step;
    if (e.key === "ArrowLeft") x -= step;
    if (e.key === "ArrowDown") y += step;
    if (e.key === "ArrowUp") y -= step;

    movePlayer();

    if (isColliding(player, targetInput)) {
        targetInput.focus();
    }

    if (house.style.display === "block" && isColliding(player, house)) {

        movementEnabled = false; 

        player.classList.add("player-fade");

        setTimeout(() => {
            successTooltip.classList.add("show");
        }, 800);
    }
});

targetInput.addEventListener("input", (e) => {
    if (e.target.value.toLowerCase() === "home") {
        house.style.display = "block";
    }
});

movePlayer();