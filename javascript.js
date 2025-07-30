let inputText = document.querySelector(".inputText");
let numBtns = document.querySelectorAll(".numBtn");
let expBtns = document.querySelectorAll(".expBtn");
let clearBtn = document.querySelector(".clearBtn");
let delBtn = document.querySelector(".delBtn");
let dotBtn = document.querySelector(".dotBtn");
let oppSignBtn = document.querySelector(".oppositeSignBtn");


let equation = "";
let lastInput = "";
let lastOperand = "";
let operators = "+-/x"

function getLastInput() { return lastInput; };
function isOperator(value) { return operators.includes(value); };
function updateLastInput() { lastInput = inputText.value.slice(-1); };
function updateLastOperand(currInput) {
    if (currInput == "X") currInput = "x";
    if (operators.includes(lastInput) || operators.includes(currInput)) {
        lastOperand = currInput;
    } else {
        lastOperand += currInput;
    }
}


numBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        inputText.value += e.target.textContent;
        equation += e.target.textContent;
        updateLastOperand(e.target.textContent);
        updateLastInput()
        inputText.scrollLeft = inputText.scrollWidth;
        console.log(`this is the lastoperand ${lastOperand}`);
    })
})

expBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        if (isOperator(getLastInput())) { // if clicking expressionBtn twice - remove the last one
            inputText.value = inputText.value.slice(0, -1);
            equation = inputText.value.slice(0,-1);
        };

        if (getLastInput() == ".") return;

        if (lastInput == "") return; // disallows operator as first input

        if (e.target.textContent == "X") {
            inputText.value += "x"; 
            equation += "x";
        } else {
            inputText.value += e.target.textContent;
            equation += e.target.textContent;
        };
        updateLastOperand(e.target.textContent);
        updateLastInput();
        inputText.scrollLeft = inputText.scrollWidth;
        console.log(`this is the lastOperand ${lastOperand}`);
    });
})

clearBtn.addEventListener("click", (e) => {
    inputText.value = "";
    lastInput = "";
    equation = "";
    lastOperand = "";
})

delBtn.addEventListener("click", (e) => {
    if (inputText.value == "") return;
    inputText.value = inputText.value.slice(0, -1);
    equation = inputText.value;
    currLastInput = lastInput;
    updateLastInput()
    let indexNewLastOperand = -1;
    if (operators.includes(currLastInput)) {
        for (let i = equation.length - 1; i >= 0; --i) {
            if (operators.includes(equation[i])) {
                indexNewLastOperand = i;
            }
        }

        if (indexNewLastOperand == -1) {
            lastOperand = equation;
        } else {
            lastOperand = equation.slice(indexNewLastOperand + 1);
        }
    } else {
        for (let i = equation.length - 1; i >= 0; --i) {
            if (operators.includes(equation[i])) {
                indexNewLastOperand = i;
            }
        }
        lastOperand = equation.slice(indexNewLastOperand + 1);
    }
    console.log(`this is the lastOperand ${lastOperand}`);
})

oppSignBtn.addEventListener("click", (e) => {
    let index = equation.lastIndexOf(lastOperand);
    if (lastOperand == "" || operators.includes(lastOperand)) {
        return;
    } else if (index == 0) {
        if (equation[index] == "-") {
            equation = equation.slice(1);
            inputText.value = equation;
        } else {
            equation = "-" + equation;
            inputText.value = equation;
        }
    } else {
        if (equation[index - 1] == "x" || equation[index - 1] == "/") {
            return;
        } else if (equation[index - 1] == "+") {
        equation = equation.slice(0, index - 1) + "-" + equation.slice(index);
        inputText.value = equation;
        } else {
            if (equation[0] == "-") {
                equation = equation.slice(1);
                inputText.value = equation;
                return;
            }
            equation = equation.slice(0, index - 1) + "+" + equation.slice(index);
            inputText.value = equation; 
        }
    }
    updateLastInput();

})

dotBtn.addEventListener("click", (e) => {
    equation += e.target.textContent;
    updateLastOperand(e.target.textContent);
    updateLastInput();
    if (lastInput != "." ) inputText.value += e.target.textContent;
    inputText.scrollLeft = inputText.scrollWidth;
})