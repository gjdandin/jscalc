class Calculator {

    //constructor, has two operand variables. Clears at start.
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
    }

    // Resets operands to '' and operation to undefined
    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    delete() {
        //Slices off the last number.
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    // Appends number, has to be string because we want to append 
    // to current operand, not add these numbers.
    appendNumber(number) {
        // Stops you from adding multiple periods - only 1 period allowed.
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    // Sets the operation from Event listener.
    // Moves current operand to previousOperand 
    // clear current operand
    chooseOperation(operation) {
        // If the currentoperand is empty, chooseoperation does nothing
        if (this.currentOperand === '') return
        // Allows previous result to be brought over to new computation
        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    compute() {
        let computation // this is the variable for the result
        const prev = parseFloat(this.previousOperand) //floatversion of previousoperand
        const current = parseFloat(this.currentOperand)

        // If current or prev constant is somehow empty then do nothing
        if (isNaN(prev) || isNaN(current)) return
        
        // If statement.
        switch (this.operation) {
            case '+':
                computation = prev + current
                break
            case '-':
                computation = prev - current
                break
            case '*':
                computation = prev * current
                break
            case '/':
                computation = prev / current
                break
            // if operand is none of these - do nothing
            default: 
                return
        }

        // Updates result to current operand and resets rest.
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
    }

    // separates integers and decimals.
    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0]) // puts the digits before a decimal into var
        const decimalDigits = stringNumber.split('.')[1] // Puts the digits after a decimal into var
        let integerDisplay
        
        if (isNaN(integerDigits)) {
            // if integer is not a number, do nothing
            integerDisplay = '' 
        }
        else {
            // turns integers to strings with maximum fraction of 0 (not a decimal)
            integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0}) 
        }

        // if decimals are actually inputted, return integer.decimal format
        if (decimalDigits != null) { 
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        } // else return integer only.
        
    }


    // Updates the display in html with currentOperand
    updateDisplay() {
        this.currentOperandTextElement.innerText =
         this.getDisplayNumber(this.currentOperand)
        // if operation is not null, update previous text with previous operand and operation.
        if (this.operation != null ) {
            this.previousOperandTextElement.innerText =
            `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = '' // if operation is null, reset previous operand
        }
    }
}

// Create constant variables from data-selectors in HTML.
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

// Create new instance of calculator class.
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

//Adds an event listener(click) to each number button
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText) // Update operand
        calculator.updateDisplay() // Update display with operand
    })
}) 

//Adds an event listener(click) to each number button
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText) // Update chooseoperation func
        calculator.updateDisplay() // Update display with operand
    })
}) 

//Compute then update
equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

// clear calculator
allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})