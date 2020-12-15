// constants
const FPS = 30;
const MOVE_DISTANCE = 150;
const MOVE_SPEED = 8;
const CIRCLE_RAD = 100;
const POEM = `What's the difference between escapism and avoidance?
"There isn't one, they're synonyms"
I used to think that too
Because I have been lying to myself for the past three years
"It's just a quick break"
"I'm just winding down and then I'll get things done"
And yet
Night after night
I find myself lying in bed at 1:30 am
Staring blankly at my phone
Watching anything I can get my hands on to escape
And scrambling the next day to get anything I avoided done
I think that I'm simply just escaping into another world
To take a break from reality
When really I'm avoiding everything that I need to get done
I've been lying to myself for 1128 days today
Because I cannot get myself motivated to do anything
I tell myself that I'll get it done in a minute
But I know it won't be done until weeks after it was due
I thought it was simply just escapism
But I am a devout avoidance practicer
There is a difference between escapism and avoidance
Because escapism is a temporary break to set your mind straight
And avoidance is escaping everything at any cost.`;

// global variables
let mousePos = {x: 0, y: 0};
let pres = [];

let button;

function setup() {

    let poemDiv = document.getElementById("poem");

    let lines = POEM.split("\n");
    for (let i = 0; i < lines.length; i++) {
        let pre = document.createElement('pre');
        pre.innerHTML = lines[i];
        poemDiv.appendChild(pre);
        pres.push(pre);
    }

    button = document.getElementById("button")
    rect = button.getBoundingClientRect()
    button.style.left = (window.innerWidth / 2) - (rect.width / 2) + "px";
    button.style.top = (window.innerHeight) - 100 + "px";


    window.setInterval(moveButton, 1000 / FPS);
    window.addEventListener("mousemove", e => mousemove(e));
}

function mousemove(e) {

    mousePos.x = e.x;
    mousePos.y = e.y;

    for (let i = 0; i < pres.length; i++) {
        let pre = pres[i];
        let originalText = POEM.split("\n")[i];
        setText(pre, originalText);
    }
}

// set the text of a pre based on mouse position
// =============================================

function setText(pre, originalText) {

    // get position of pre
    let rect = pre.getBoundingClientRect();
    let y = (rect.top + rect.bottom) / 2;
    let xStart = rect.left;

    // find where the break begins and ends
    let breakPoints = getBreakAtY(y);
    if (breakPoints == null) {
        pre.innerHTML = originalText;
        return;
    }

    // find the position in our string where it starts to hit our break
    let breakStart = null;
    for (let i = 1; i <= originalText.length; i++) {
        let substr = originalText.substr(0, i);
        let strWidth = getTextWidth(substr, getFont(pre))
        if (xStart + strWidth > breakPoints.start) {
            breakStart = i - 1;
            break;
        }
    }

    if (breakStart == null) {
        pre.innerHTML = originalText;
        return;
    }

    // determine how many spaces to add to reach the other side of the break
    let numSpaces = 0;
    while (true) {
        let substr = originalText.substr(0, breakStart);
        let substrWithSpaces = substr + " ".repeat(numSpaces);
        let strWidth = getTextWidth(substrWithSpaces, getFont(pre))
        if (xStart + strWidth >= breakPoints.end) break;
        numSpaces++;
    }

    // set the final string
    let finalString = originalText.substr(0, breakStart) + " ".repeat(numSpaces) + originalText.substr(breakStart);
    pre.innerHTML = finalString;
}

// helper functions
// ================

function getFont(element) {
    return window.getComputedStyle(element, null ).getPropertyValue("font");
}

function getTextWidth(text, font) {

    let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
};

function getBreakAtY(y) {

    let yDiff = Math.abs(y - mousePos.y);
    if (yDiff >= CIRCLE_RAD) return null;

    let offset = Math.sqrt(CIRCLE_RAD ** 2 - yDiff ** 2);
    return {start: mousePos.x - offset, end: mousePos.x + offset}
}

// move the button
// ===============

function moveButton() {

    let rect = button.getBoundingClientRect();
    let x = (rect.left + rect.right) / 2;
    let y = (rect.top + rect.bottom) / 2;

    let deltaX = x - mousePos.x;
    let deltaY = y - mousePos.y;
    let delta = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    if (delta > MOVE_DISTANCE) return;

    let movementX = (deltaX / delta) * MOVE_SPEED;
    let movementY = (deltaY / delta) * MOVE_SPEED;

    let newLeft = rect.left + movementX;
    let newTop = rect.top + movementY;

    if (newLeft < 0) newLeft = 0;
    if (newLeft > window.innerWidth - rect.width) newLeft = window.innerWidth - rect.width;
    if (newTop < 0) newTop = 0;
    if (newTop > window.innerHeight - rect.height) newTop = window.innerHeight - rect.height;

    button.style.left = newLeft + "px";
    button.style.top = newTop + "px";
}