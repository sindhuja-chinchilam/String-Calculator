import { useState } from "react";
import "./App.css";

function App() {
  const [myInput, setMyInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState(false);
  const add = () => {
    setError(false)
    try {
      if (!myInput) {
        setResult(0);
        return;
      }
      const input = myInput.replace(/\\n/g, "\n");
      const { numbers, delimiter } = getDelimiterAndNumbers(input);
      const numArray = extractNumbers(numbers, delimiter);
      checkForNegatives(numArray);
      const sum = numArray.length && calculateSum(numArray);
      setResult(sum);
    } catch (error) {
      setError(true);
      setResult(error.message);
    }
  };

  const clear = () => {
    setMyInput("");
    setResult("");
    setError(false);
  };

  const getDelimiterAndNumbers = (input) => {
    if (input.startsWith("//")) {
      const [delimiterLine, numbers] = input.slice(2).split("\n");
      if (!delimiterLine) {
        throw new Error(
          "Invalid delimiter format. Delimiter line cannot be empty."
        );
      }
      const delimiter = new RegExp(
        `\\${delimiterLine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
        "g"
      );
      return { numbers, delimiter };
    } else {
      const validDelimiterPattern = /^[0-9,;\n]+$/;
      if (!validDelimiterPattern.test(input)) {
        throw new Error(
          "Invalid input. Only numbers, commas, semicolons and new lines are allowed."
        );
      }
      return { numbers: input, delimiter: /,|\n|;/ };
    }
  };

  const extractNumbers = (numbers, delimiter) => {
    return numbers
      .split(delimiter)
      .map(Number)
      .filter((num) => !isNaN(num));
  };

  const checkForNegatives = (numArray) => {
    const negatives = numArray.filter((num) => num < 0);
    if (negatives.length > 0) {
      throw new Error(`negative numbers not allowed ${negatives.join(",")}`);
    }
  };

  const calculateSum = (numArray) => {
    return numArray.reduce((sum, num) => sum + num);
  };

  return (
    <>
      <div className="bg">
        <div className="form-container">
          <div
            style={{
              paddingBottom: "10px",
            }}
          >
            <label className="label">
              Enter your input{" "}
              <input
                name="myInput"
                value={myInput}
                onChange={(e) => setMyInput(e.target.value)}
              />
            </label>
          </div>
          <div className="button-container">
            <button className="btn" onClick={() => add()}>
              Add
            </button>
            <button className="btn" onClick={() => clear()}>
              Clear
            </button>
          </div>
          {result !== "" && (
            <div className="result">
              <label>
                <b>
                  Result:{" "}
                  <span style={{ color: error && "red" }}>{result}</span>{" "}
                </b>
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
