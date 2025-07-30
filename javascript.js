let inputText = document.querySelector(".inputText");
let numBtns = document.querySelectorAll(".numBtn");
let expBtns = document.querySelectorAll(".expBtn");
let clearBtn = document.querySelector(".clearBtn");
let delBtn = document.querySelector(".delBtn");
let dotBtn = document.querySelector(".dotBtn");
let oppSignBtn = document.querySelector(".oppositeSignBtn");
let modBtn = document.querySelector(".modBtn");
let equalBtn = document.querySelector(".equalBtn");
let outputTxt = document.querySelector(".outputText");


let equation = "";
let lastInput = "";
let lastOperand = "";
let operators = "+-/x";
let equalSignLastClicked = false;


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
function isHigherPrecendence(topOp, newOp) {
    let prios = {
        "+": 1,
        "-": 1,
        "x": 2,
        "/": 2,
    }

    if (prios[topOp] >= prios[newOp]) return true;
    return false;
}


numBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        if (equalSignLastClicked) {
            clearBtn.click();
            equalSignLastClicked = false;
        }
        inputText.value += e.target.textContent;
        equation += e.target.textContent;
        updateLastOperand(e.target.textContent);
        updateLastInput()
        inputText.scrollLeft = inputText.scrollWidth;
    })
})

expBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        if (equalSignLastClicked) {
            equalSignLastClicked = false;
        }
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
    });
})

clearBtn.addEventListener("click", (e) => {
    inputText.value = "";
    lastInput = "";
    equation = "";
    lastOperand = "";
    outputTxt.textContent = "";
})

delBtn.addEventListener("click", (e) => {
    if (equalSignLastClicked) {
        clearBtn.click();
        equalSignLastClicked = false;
    }
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

modBtn.addEventListener("click", (e) => {
    alert("will implement later");
    clearBtn.click();
})

equalBtn.addEventListener("click", (e) => {
    if (equation == "") return;
    if (equation[0] == "-") equation = "0" + equation;
    if (equation.includes("/0")) {
        inputText.value = "Invalid";
        setTimeout(() => {
            clearBtn.click();
        }, 1000);
        return;
    }
    if (equation.at(-1) == ".") equation += "0";
    if (operators.includes(equation.at(-1))) equation = equation.slice(0, -1);


    let rpnQueue = [];
    let operatorStack = [];

    let value = "";
    for (let i = 0; i < equation.length; ++i) {
        if (!operators.includes(equation[i])) {
            value += equation[i];
        } else if (operators.includes(equation[i])) {
            rpnQueue.push(+value);
            if (operatorStack.length == 0) {
                operatorStack.push(equation[i]);
            } else {
                let isTopOpHigher = isHigherPrecendence(operatorStack.at(-1), equation[i]);
                if (isTopOpHigher) {
                    rpnQueue.push(operatorStack.pop());
                    operatorStack.push(equation[i]);
                } else {
                    operatorStack.push(equation[i]);
                }
            }
            value = "";
        }
    }

    if (value !== "") {
        rpnQueue.push(+value);
    }

    while (operatorStack.length != 0) {
        rpnQueue.push(operatorStack.pop());
    }


    let total = 0;
    let stack = [];
    for (let i = 0; i < rpnQueue.length; ++i) {
        if (typeof rpnQueue.at(i) == "number") {
            stack.push(rpnQueue.at(i));
        } else {
            let num1 = stack.pop();
            let num2 = stack.pop();
            let result = 0;
            switch (rpnQueue.at(i)) {
                case "x": 
                    result = num2 * num1;
                    break;
                case "/":
                    result = num2 / num1;
                    break;
                case "+":
                    result = num2 + num1;
                    break;
                case "-":
                    result = num2 - num1;
                    break;
            }
        stack.push(result);
        }
    }

    let result = stack[0].toString();

    if (result.includes(".")) {
        let decimalIndex = result.indexOf(".");
        let decimalPortion = result.slice(decimalIndex + 1);
        if (decimalPortion.length > 10) {
            result = (+result).toFixed(10);
        }
    }
    inputText.value = result;
    outputTxt.textContent = equation + " = " + result;
    outputTxt.scrollLeft = outputTxt.scrollWidth;
    equation = result;
    equalSignLastClicked = true;


})