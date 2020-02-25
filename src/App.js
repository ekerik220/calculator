import React from "react";
import "./App.css";
import { evaluate } from "mathjs";

const BASIC_BUTTONS = [
  {
    button: "=",
    id: "equals",
    format: null
  },
  {
    button: "+",
    id: "add",
    format: "+"
  },
  {
    button: "-",
    id: "subtract",
    format: "-"
  },
  {
    button: "×",
    id: "multiply",
    format: "*"
  },
  {
    button: "÷",
    id: "divide",
    format: "/"
  },
  {
    button: ".",
    id: "decimal",
    format: "."
  },
  {
    button: ")",
    id: "r-bracket",
    format: ")"
  },
  {
    button: "(",
    id: "l-bracket",
    format: "("
  },
  {
    button: "0",
    id: "zero",
    format: "0"
  },
  {
    button: "1",
    id: "one",
    format: "1"
  },
  {
    button: "2",
    id: "two",
    format: "2"
  },
  {
    button: "3",
    id: "three",
    format: "3"
  },
  {
    button: "4",
    id: "four",
    format: "4"
  },
  {
    button: "5",
    id: "five",
    format: "5"
  },
  {
    button: "6",
    id: "six",
    format: "6"
  },
  {
    button: "7",
    id: "seven",
    format: "7"
  },
  {
    button: "8",
    id: "eight",
    format: "8"
  },
  {
    button: "9",
    id: "nine",
    format: "9"
  },
  {
    button: "CE",
    id: "clear-ele",
    format: null
  },
  {
    button: "C",
    id: "clear",
    format: null
  }
];
const ADV_BUTTONS = [
  {
    button: "mod",
    id: "mod",
    format: "%"
  },
  {
    button: "x!",
    id: "factorial",
    format: "!"
  },
  {
    button: "ln",
    id: "ln",
    format: "log(" // math.js log() defaults to base e
  },
  {
    button: "log",
    id: "log",
    format: "log10("
  },
  {
    button: "√",
    id: "sqrt",
    format: "sqrt("
  },
  {
    button: "x\u207F",
    id: "exponent",
    format: "^"
  },
  {
    button: "sin",
    id: "sin",
    format: "sin("
  },
  {
    button: "cos",
    id: "cos",
    format: "cos("
  },
  {
    button: "tan",
    id: "tan",
    format: "tan("
  },
  {
    button: "π",
    id: "pi",
    format: "pi"
  },
  {
    button: "e",
    id: "e",
    format: "e"
  },
  {
    button: "Ans",
    id: "ans",
    format: "Ans"
  }
];
const EVENT_KEY_MAP = new Map([
  ['0', 'zero'],
  ['1', 'one'],
  ['2', 'two'],
  ['3', 'three'],
  ['4', 'four'],
  ['5', 'five'],
  ['6', 'six'],
  ['7', 'seven'],
  ['8', 'eight'],
  ['9', 'nine'],
  ['(', 'l-bracket'],
  [')', 'r-bracket'],
  ['=', 'equals'],
  ['Enter', 'equals'],
  ['Backspace', 'clear-ele'],
  ['Delete', 'clear'],
  ['+', 'add'],
  ['-', 'subtract'],
  ['*', 'multiply'],
  ['/', 'divide'],
  ['%', 'mod'],
  ['.', 'decimal'],
  ['p', 'pi'],
  ['e', 'e'],
  ['q', 'sqrt'],
  ['l', 'ln'],
  ['g', 'log'],
  ['c', 'cos'],
  ['s', 'sin'],
  ['t', 'tan'],
  ['a', 'ans'],
  ['!', 'factorial'],
  ['^', 'exponent']
]);
const DECIMAL_PLACES = 10;

class App extends React.Component {
  render() {
    return (
      <div>
        <Calculator />
      </div>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      equation: [],
      answer: "",
      prevEquation: [],
      showingAnswer: false,
      history: [],
      historyIsVisible: false
    };

    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.toggleHistory = this.toggleHistory.bind(this);
    this.setAnswerFromHistory = this.setAnswerFromHistory.bind(this);
    this.setEquationFromHistory = this.setEquationFromHistory.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    const inputID = EVENT_KEY_MAP.get(event.key);

    if(inputID) {
      event.preventDefault();
      this.handleInput(inputID);
    }
  }

  handleButtonPress(event) {
    this.handleInput(event.target.id);
  }

  handleInput(inputID) {
    let format = [...BASIC_BUTTONS, ...ADV_BUTTONS].find(obj => obj.id === inputID)
      .format;
    let updateState = {};
    let equationString = this.state.equation.join("");

    switch (inputID) {
      case "equals":
        if (!/[*%(/+-]$/.test(equationString)) {
          let evaluationString = equationString
            .replace(/\(*$/, "")
            .replace(/Ans/g, this.state.answer);

          evaluationString += ")".repeat(
            this.checkOpenParenthesis(evaluationString)
          );

          if (evaluationString.length > 0) {
            let ans = evaluate(evaluationString);

            // if evaluate failed...
            if (isNaN(ans)) {
              updateState = {
                answer: "error",
                showingAnswer: true,
                prevEquation: this.state.equation,
                equation: []
              };
            } else {
              // if ans is exponential format -> reconvert it with decimal places limited
              // else -> limit decimal places normally
              if (/e\+/.test(ans)) ans = ans.toExponential(DECIMAL_PLACES);
              else ans = parseFloat(ans.toFixed(DECIMAL_PLACES));
              // Update answer state, toggle the showingAnswer bool to true,
              // move the equation to prevEquation, and reset the equation string.
              const equationWithRealAns = this.state.equation.map(ele =>
                ele === "Ans" ? this.state.answer : ele
              );
              updateState = {
                answer: ans.toString(),
                prevEquation: equationWithRealAns,
                equation: [],
                showingAnswer: true,
                history: this.state.history.concat({
                  equation: equationWithRealAns,
                  answer: ans.toString()
                })
              };
            }
          }
        }
        break;
      case "clear-ele":
        // Remove last element from equation array
        updateState = {
          equation: this.state.equation.slice(0, -1),
          showingAnswer: false
        };
        break;
      case "clear":
        // Reset equation array
        updateState = { equation: [], showingAnswer: false };
        break;
      case "decimal":
        // If the equation DOESN'T already have a decimal in the last number, add a decimal.
        if (!/(\d*\.\d*)$/.test(equationString))
          updateState = {
            equation: this.state.equation.concat(format),
            showingAnswer: false
          };
        break;
      case "r-bracket":
        // Only insert if there are any open parenthesis, and the preceding character is a number or a bracket.
        if (
          this.checkOpenParenthesis(equationString) &&
          /[\d)]$|(Ans|e|pi)$/.test(equationString)
        )
          updateState = { equation: this.state.equation.concat(format) };
        break;
      case "divide":
      case "multiply":
      case "add":
      case "mod":
        if (!/[*/+%]-$|\($|\(-$|\^$/.test(equationString)) {
          // If previous character is a function symbol already change simply swap it with
          // the inputted function symbol.
          if (/(\*|\+|-|\/|%)$/.test(equationString))
            updateState = {
              equation: this.state.equation.slice(0, -1).concat(format),
              showingAnswer: false
            };
          // If we just pressed '=' and are now inputting an operator, we want to chain
          // the previous answer into this new equation.
          else if (this.state.showingAnswer)
            updateState = {
              equation: [this.state.answer, format],
              showingAnswer: false
            };
          else if (this.state.equation.length === 0)
            updateState = { equation: [0, format], showingAnswer: false };
          else
            updateState = {
              equation: this.state.equation.concat(format),
              showingAnswer: false
            };
        }
        break;
      case "subtract":
        // Don't allow input if previous char is '-' or % (no negative number mod with this calc).
        if (!/[-%]$/.test(equationString))
          if (this.state.showingAnswer)
            updateState = {
              equation: [this.state.answer, format],
              showingAnswer: false
            };
          // If previous char is a + just switch it with this '-' since there's no point
          // doing 3 + -3 instead of just 3 - 3, for example.
          else if (/\+$/.test(equationString))
            updateState = {
              equation: this.state.equation.slice(0, -1).concat(format),
              showingAnswer: false
            };
          else if (this.state.showingAnswer)
            updateState = {
              equation: [this.state.answer, format],
              showingAnswer: false
            };
          else
            updateState = {
              equation: this.state.equation.concat(format),
              showingAnswer: false
            };
        break;
      case "exponent":
        // If either of these situations exist in the equation, don't allow another exponent:
        // 1: A ^ is present followed by brackets that don't close
        // 2: A ^ is present followed by numbers straight to the end of the string
        if (!/\^$|\($|[*%/+-.]$/.test(equationString)) {
          // If equation is empty, add 0 and exponent and then break, we're done.
          if (this.state.equation.length === 0) {
            updateState = {
              equation: this.state.equation.concat([0, format]),
              showingAnswer: false
            };
            break;
          }
          // Make sure we're not currently typing in an exponent... if we are, don't allow another
          // exponent input (this calculator won't handle exponents of exponents).
          let brackets = false;
          let openBrackets = 0;
          let expFound = false;
          let expEnded = true;
          // If we find a ^ in the equation then an exponent has been started.
          // It might be using brackets ^() or just a number ^123. We decide which
          // case it is here.
          for (let i = 0; i < this.state.equation.length; i++) {
            if (this.state.equation[i] === "^") {
              expFound = true;
              expEnded = false;
              this.state.equation[i + 1] === "("
                ? (brackets = true)
                : (brackets = false);
              i++; // We can progress to the index after the ^ immediately
            }
            // If it's a bracket exponent, track the opening and closing of brackets until
            // they match up (openBrackets == 0)... once they match up the exponent has ended.
            if (expFound && brackets) {
              if (this.state.equation[i] === "(") openBrackets++;
              if (this.state.equation[i] === ")") openBrackets--;
              if (openBrackets === 0) {
                brackets = false;
                expEnded = true;
                expFound = false;
              }
            }
            // If it's a non-bracket exponent we just have to look out for the next
            // non number... at that point the exponent ended.
            else if (
              expFound &&
              isNaN(this.state.equation[i]) &&
              !/Ans|e|pi/.test(this.state.equation[i])
            ) {
              expEnded = true;
              expFound = false;
            }
          }
          // If we've gone through the whole equation and we're not currently in an un-ended exponent
          // we can go ahead and add an exponent to the equation.
          if (expEnded)
            updateState = {
              equation: this.state.equation.concat(format),
              showingAnswer: false
            };
        }
        break;
      case "factorial":
        if (/[)\d]$|(Ans|e|pi)$/.test(equationString))
          updateState = {
            equation: this.state.equation.concat(format),
            showingAnswer: false
          };
        break;
      case "ans":
        if (this.state.answer !== "" && this.state.answer !== "error") {
          if (/[)\d]$|(Ans|e|pi)$/.test(equationString))
            updateState = {
              equation: this.state.equation.concat(["*", format]),
              showingAnswer: false
            };
          // Don't allow Ans following % if Ans is negative!
          else if (!(/%$/.test(equationString) && this.state.answer[0] === "-"))
            updateState = {
              equation: this.state.equation.concat(format),
              showingAnswer: false
            };
        }
        break;
      default:
        // If last digit is 0 and the preceding element isn't a number or '.', change
        // the 0 to our input because we don't want to have leading 0s on a number.
        if (
          this.state.equation[this.state.equation.length - 1] === "0" &&
          isNaN(this.state.equation[this.state.equation.length - 2]) &&
          this.state.equation[this.state.equation.length - 2] !== "."
        )
          updateState = {
            equation: this.state.equation.slice(0, -1).concat(format),
            showingAnswer: false
          };
        else if (
          this.state.equation[this.state.equation.length - 1] === ")" &&
          !isNaN(format)
        )
          updateState = {
            equation: this.state.equation.concat(["*", format]),
            showingAnswer: false
          };
        else if (
          this.state.equation[this.state.equation.length - 1] === "e" ||
          this.state.equation[this.state.equation.length - 1] === "Ans" ||
          this.state.equation[this.state.equation.length - 1] === "pi"
        ) {
          updateState = {
            equation: this.state.equation.concat(["*", format]),
            showingAnswer: false
          };
        } else
          updateState = {
            equation: this.state.equation.concat(format),
            showingAnswer: false
          };
        break;
    }
    this.setState(updateState);
  }
  
  // Calculate number of open parenthesis
  checkOpenParenthesis(str) {
    var stack = [];
    for (var i = 0; i < str.length; i++) {
      if (str[i] === "(" || str[i] === "{" || str[i] === "[")
        stack.push(str[i]);
      else if (str[i] === ")") {
        if (stack.pop() !== "(") {
          return false;
        }
      } else if (str[i] === "}") {
        if (stack.pop() !== "{") {
          return false;
        }
      } else if (str[i] === "]") {
        if (stack.pop() !== "[") {
          return false;
        }
      }
    }
    return stack.length;
  }

  toggleHistory() {
    this.setState({ historyIsVisible: !this.state.historyIsVisible });
  }

  setEquationFromHistory(event) {
    const index = event.target.parentElement.id;
    this.setState({
      equation: this.state.history[index].equation,
      showingAnswer: false,
      answer: ""
    });
  }

  setAnswerFromHistory(event) {
    const index = event.target.parentElement.id;
    const equationLastChar = this.state.equation.join("").slice(-1);
    let addToEquation = this.state.history[index].answer;
    if (equationLastChar !== "(" && this.state.equation.length > 0)
      addToEquation = "*" + addToEquation;
    this.setState({
      equation: this.state.equation.concat(addToEquation),
      showingAnswer: false,
      answer: ""
    });
  }

  render() {
    return (
      <div id="calculator">
        <Display
          answer={this.state.answer}
          equation={this.state.equation.join("")}
          prevEquation={this.state.prevEquation.join("")}
          showAnswer={this.state.showingAnswer}
        />
        <div id="button-container">
          <CalcKeys
            id="adv-calc-keys"
            keysArray={ADV_BUTTONS}
            onClick={this.handleButtonPress}
          />
          <CalcKeys
            id="basic-calc-keys"
            keysArray={BASIC_BUTTONS}
            onClick={this.handleButtonPress}
          />
          <div id="history-button-area">
            {this.state.historyIsVisible && (
              <div id="history">
                {this.state.history.map((ele, index) => {
                  const visibleEquationLength = 30;
                  let equationStr = ele.equation.join("");
                  if (equationStr.length > visibleEquationLength)
                    equationStr =
                      equationStr.slice(0, visibleEquationLength) + "...";
                  return (
                    <div className="history-item" id={index} key={index}>
                      {equationStr.length > visibleEquationLength ? (
                        <p
                          title={ele.equation.join("")}
                          onClick={this.setEquationFromHistory}
                        >
                          {equationStr}
                        </p>
                      ) : (
                        <p onClick={this.setEquationFromHistory}>
                          {equationStr}
                        </p>
                      )}
                      <p onClick={this.setAnswerFromHistory}>
                        {"=" + ele.answer}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={this.toggleHistory}>History</button>
          </div>
        </div>
      </div>
    );
  }
}

class CalcKeys extends React.Component {
  render() {
    let buttons = this.props.keysArray.map(button => {
      return (
        <button
          className="calc-button"
          id={button.id}
          key={button.id}
          onClick={this.props.onClick}
        >
          {button.button}
        </button>
      );
    });
    return <div id={this.props.id}>{buttons}</div>;
  }
}

class Display extends React.Component {
  constructor(props) {
    super(props);

    this.formatEquationStr = this.formatEquationStr.bind(this);
    this.checkOpenParenthesis = this.checkOpenParenthesis.bind(this);
  }

  formatEquationStr(equation) {
    // -- REGEX GENERAL FORMATTING --
    let retStr = equation
      .replace(/\//g, " ÷ ")
      .replace(/\*/g, " × ")
      .replace(/\+/g, " + ")
      .replace(/-/g, " - ") // '-' -> ' - '
      .replace(/^\s-\s/g, "-") // '^ - ' -> '-'
      .replace(/\(\s-\s/g, "(-") // '( - ' -> '(-'
      .replace(/%/g, " % ")
      .replace(/-\D\.|^-\./g, " -0.") // (-.21 -> -0.21)
      .replace(/(\D)\.|^\./g, " $10.") // (.21 -> 0.21)
      .replace(/\)(?=\d)/g, ") × ") // (8)6 -> (8) * 6
      .replace(/\^\s-\s(\d+\.?\d*|Ans|e|pi)?/g, "<sup>-$1</sup>")
      .replace(/\^(\d+\.?\d*|Ans|e|pi)/g, "<sup>$1</sup>")
      .replace(/\^$/, "<sup>□</sup>")
      .replace(/log\(/g, "ln(")
      .replace(/log10\(/g, "log(")
      .replace(/sqrt/g, "√")
      .replace(/pi/g, "π")
      .replace(/e/g, "<i>e</i>");

    // -- FORMAT BRACKET STYLE EXPONENTS (SUPERSCRIPTS) --
    let start = 0;
    let brackets = false;
    let openBrackets = 0;
    // Search for next exponent (^).
    for (let i = 0; i < retStr.length; i++) {
      if (retStr[i] === "^") {
        start = i; // index of ^
        // Does the exponent have brackets?
        if (retStr[i + 1] === "(") brackets = true;
        i++; // once we've found ^ we can skip to next index immediately!
      }
      // if the exponent has brackets keep a count of the brackets
      // as they open and close... if the count hits 0 then the
      // brackets are balanced and the exponent is finished.
      if (brackets) {
        if (retStr[i] === "(") openBrackets++;
        if (retStr[i] === ")") openBrackets--;
        if (openBrackets === 0 || i === retStr.length - 1) {
          retStr =
            retStr.slice(0, start) +
            "<sup>" +
            retStr.slice(start + 1, i + 1) +
            "</sup>" +
            retStr.slice(i + 1);
          brackets = false;
        }
      }
    }

    // -- ADD GUIDE (FAKE) BRACKETS --
    // check if there are any open brackets in the entire equation
    let totalOpenBrackets = this.checkOpenParenthesis(retStr);
    if (totalOpenBrackets) {
      retStr += "<span class='guide-parenthesis'>";
      // openBrackets was used above to count brackets in exponents
      // so if it's >0 we have unclosed exponent brackets.
      if (openBrackets) retStr += "<sup>" + ")".repeat(openBrackets) + "</sup>";

      // totalOpenBrackets - openBrackets will equal the number of
      // non-exponent (non-superscript) open brackets.
      retStr += ")".repeat(totalOpenBrackets - openBrackets) + "</span>";
    }

    return retStr;
  }

  checkOpenParenthesis(str) {
    var stack = [];
    for (var i = 0; i < str.length; i++) {
      if (str[i] === "(") stack.push(str[i]);
      else if (str[i] === ")")
        if (stack.pop() !== "(") {
          return false;
        }
    }

    return stack.length;
  }

  render() {
    return (
      <div id="display">
        <div id="top-display">
          <span>
            {this.props.showAnswer ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: this.formatEquationStr(this.props.prevEquation) + " ="
                }}
              ></span>
            ) : this.props.answer === "" ? (
              ""
            ) : (
              "Ans = " + this.props.answer
            )}
          </span>
        </div>
        <div id="bottom-display">
          {this.props.showAnswer ? (
            <span
              dangerouslySetInnerHTML={{ __html: this.props.answer }}
            ></span>
          ) : this.props.equation === "" ? (
            "0"
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html: this.formatEquationStr(this.props.equation)
              }}
            ></span>
          )}
        </div>
      </div>
    );
  }
}

export default App;
