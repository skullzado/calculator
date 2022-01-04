function operator(sign, num1, num2) {
	switch (sign) {
		case '+':
			return num1 + num2;
		case '-':
			return num1 - num2;
		case '*':
			return num1 * num2;
		case '/':
			return num1 / num2;
		default:
			return 'ERROR';
	}
}

console.log(operator('+', 10, 20));
