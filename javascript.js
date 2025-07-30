let inputText = document.querySelector(".inputText");
let numBtns = document.querySelectorAll(".numBtn");
let expBtns = document.querySelectorAll(".expBtn")
let clearBtn = document.querySelector(".clearBtn");
let delBtn = document.querySelector(".delBtn");

let lastOperand = "";
let lastInput = "";
let operators = "+-/x"

function getLastInput() { return lastInput; };
function isOperator(value) { return operators.includes(value); };
function updateLastInput() { lastInput = inputText.value.slice(-1); };


numBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        inputText.value += e.target.textContent;
        lastOperand += e.target.textContent;
        updateLastInput()
        inputText.scrollLeft = inputText.scrollWidth;
        console.log(lastInput);
        console.log(`This is the last Operand ${lastOperand}`);
    })
})

expBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        if (isOperator(getLastInput())) { // if clicking expressionBtn twice - remove the last one
            inputText.value = inputText.value.slice(0, -1);
        }

        if (lastInput == "") return; // disallows operator as first input

        if (e.target.textContent == "X") {
            inputText.value += "x"; 
        } else {
            inputText.value += e.target.textContent;
        }

        updateLastInput()
        inputText.scrollLeft = inputText.scrollWidth;
        console.log(lastInput);
    })
})

clearBtn.addEventListener("click", (e) => {
    inputText.value = "";
    lastInput = "";
})

delBtn.addEventListener("click", (e) => {
    if (inputText.value == "") return;
    inputText.value = inputText.value.slice(0, -1);
    updateLastInput()
    console.log(lastInput);
})