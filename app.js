const buttons = document.querySelectorAll('.btn');
const history = document.querySelector('.history');
const current = document.querySelector('.current');

let operandStr = '0';
let historyStr = '';
const ERROR_MESSAGE = "[SNARKILY]: CAN'T DIVIDE BY 0";
const operationArr = [];

const keyCodeObj = {
	Numpad0: '0',
	Numpad1: '1',
	Numpad2: '2',
	Numpad3: '3',
	Numpad4: '4',
	Numpad5: '5',
	Numpad6: '6',
	Numpad7: '7',
	Numpad8: '8',
	Numpad9: '9',
	NumpadDivide: '/',
	NumpadMultiply: '*',
	NumpadSubtract: '-',
	NumpadAdd: '+',
	NumpadEnter: '=',
	NumpadDecimal: '.',
	Minus: 'posneg',
	Backspace: 'erase',
	Delete: 'clear',
};

current.textContent = operandStr;

window.addEventListener('keydown', (event) => keyDownHandler(event));
window.addEventListener('keyup', (event) => keyUpHandler(event));

[...buttons].forEach((button) =>
	button.addEventListener('click', (event) => clickHandler(event.target))
);

function clickHandler(data) {
	let dataInput = data.dataset['input'];
	let dataType = data.classList[1];

	if (current.textContent === ERROR_MESSAGE) {
		reset();
	}

	switch (dataType) {
		case 'operand':
			operandHandler(dataInput);
			break;
		case 'operator':
			operatorHandler(dataInput);
			break;
		case 'evaluate':
			evaluate();
			break;
		case 'function':
			handleFunctions(dataInput);
			break;
		default:
			break;
	}

	updateDisplay();
}

function keyDownHandler(data) {
	const dataInput = keyCodeObj[data.code];

	if (!dataInput) {
		return;
	}

	const [button] = [...buttons].filter(
		(button) => button.dataset['input'] === dataInput
	);
	const dataType = button ? button.classList[1] : null;

	button.classList.add('active');

	if (current.textContent === ERROR_MESSAGE) {
		reset();
	}

	switch (dataType) {
		case 'operand':
			operandHandler(dataInput);
			break;
		case 'operator':
			operatorHandler(dataInput);
			break;
		case 'evaluate':
			evaluate();
			break;
		case 'function':
			handleFunctions(dataInput);
			break;
		default:
			break;
	}

	updateDisplay();
}

function keyUpHandler(data) {
	const dataInput = keyCodeObj[data.code];

	if (!dataInput) return;

	const [button] = [...buttons].filter(
		(button) => button.dataset['input'] === dataInput
	);

	button.classList.remove('active');
}

function operandHandler(input) {
	if (operandStr === '0') {
		if (input === '0') {
			operandStr = '0';
		} else if (input !== '0') {
			operandStr = input;
		} else if (input === '.') {
			operandStr = '0.';
		}
	} else if (input === '.') {
		decimalHandler(input);
	} else {
		operandStr += input;
	}
}

function decimalHandler(input) {
	if (operandStr.includes('.')) {
		return;
	} else {
		operandStr += input;
	}
}

function operatorHandler(input) {
	if (operationArr.length === 1) {
		operandStr = operationArr[0].toString();
		operationArr.push(input);
	} else {
		operationArr.push(Number(operandStr), input);
	}
	operandStr = '';
}

function evaluate() {
	let result = 0;

	if (operandStr.length && !operationArr.length) {
		return;
	}

	operationArr.push(Number(operandStr));
	historyStr = operationArr.join('');
	result = operation(operationArr);
	operandStr = result.toString();
}

function operation(arr) {
	let result = 0;
	while (arr.length !== 1) {
		const firstThreeIdx = arr.slice(0, 3);
		result = Math.round(operate(...firstThreeIdx) * 1000) / 1000;
		arr.splice(0, 3, Math.round(result * 1000) / 1000);
	}

	return result;
}

function operate(num1, operator, num2) {
	let result = 0;

	switch (operator) {
		case '+':
			result = num1 + num2;
			break;
		case '-':
			result = num1 - num2;
			break;
		case '*':
			result = num1 * num2;
			break;
		case '/':
			result = num1 / num2;
			break;
		default:
			break;
	}

	return result;
}

function reset() {
	historyStr = '';
	operandStr = '0';
	operationArr.length = 0;
	history.textContent = historyStr;
	current.textContent = operandStr;
	current.style.fontSize = '36px';
}

function handleFunctions(funcType) {
	switch (funcType) {
		case 'clear':
			reset();
			break;
		case 'posneg':
			toggleNegative();
			break;
		case 'erase':
			handleErase();
			break;
		default:
			break;
	}
}

function toggleNegative() {
	if (operandStr === '0' || !operandStr.length) {
		return;
	}

	if (operationArr.length === 1) {
		operandStr = '-' + operationArr[0].toString();
	} else if (!operandStr.includes('-')) {
		operandStr = '-' + operandStr;
	} else {
		operandStr = operandStr.substring(1);
	}
}

function handleErase() {
	if (operandStr === '0' || operationArr.length === 1) {
		return;
	} else {
		operandStr = operandStr.substring(0, operandStr.length - 1);
	}
}

function updateDisplay() {
	if (operandStr === 'Infinity') {
		current.textContent = ERROR_MESSAGE;
		current.style.fontSize = '20px';
	} else if (operationArr.length === 1) {
		current.textContent = `=${operandStr}`;
	} else {
		current.textContent = operationArr.join('') + operandStr;
	}
	history.textContent = historyStr;
}
