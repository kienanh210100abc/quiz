import { useState } from "react";
import QuizForm from "./components/QuizForm";
import { exportQuiz } from "./utils/exportQuiz";
import "./App.css";
import { importQuiz } from "./utils/importQuiz";

const initialQuiz = {
  name: "",
  description: "",
  questions: [],
};

const validateQuiz = (quiz) => {
  const errors = [];

  if (!quiz.name.trim()) {
    errors.push("Quiz name is required.");
  }

  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    errors.push("At least one question is required.");
    return errors;
  }

  quiz.questions.forEach((question, questionIndex) => {
    const label = `Question ${questionIndex + 1}`;
    if (!question.name.trim()) {
      errors.push(`${label}: name is required.`);
    }
    if (!question.description.trim()) {
      errors.push(`${label}: description is required.`);
    }
    if (!Number.isFinite(Number(question.sortOrder))) {
      errors.push(`${label}: sort order must be a number.`);
    }

    if (!Array.isArray(question.options) || question.options.length < 2) {
      errors.push(`${label}: at least 2 options are required.`);
      return;
    }

    const values = question.options.map((option) => option.value);
    const uniqueValues = new Set(values);
    if (uniqueValues.size !== values.length) {
      errors.push(`${label}: option values must be unique.`);
    }

    question.options.forEach((option, optionIndex) => {
      const optionLabel = `${label}, option ${optionIndex + 1}`;
      if (!option.value.trim()) {
        errors.push(`${optionLabel}: value is required.`);
      }
      if (!option.label.trim()) {
        errors.push(`${optionLabel}: label is required.`);
      }
      if (!Number.isFinite(Number(option.sortOrder))) {
        errors.push(`${optionLabel}: sort order must be a number.`);
      }
    });

    if (!Array.isArray(question.correctOptionValues) || question.correctOptionValues.length < 1) {
      errors.push(`${label}: at least 1 correct option is required.`);
      return;
    }

    const invalidCorrectValues = question.correctOptionValues.filter(
      (value) => !uniqueValues.has(value)
    );
    if (invalidCorrectValues.length > 0) {
      errors.push(`${label}: correct options must match existing option values.`);
    }
  });

  return errors;
};

function App() {
  const [quiz, setQuiz] = useState(initialQuiz);
  const [errors, setErrors] = useState([]);
  const [notice, setNotice] = useState("");

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const importedQuiz = await importQuiz(file);
        setQuiz(importedQuiz);
        setErrors([]);
        setNotice("Quiz imported successfully.");
      } catch (error) {
        setNotice("");
        setErrors([error.message || "Invalid JSON file."]);
      }
      event.target.value = "";
    }
  };

  const handleExport = () => {
    const validationErrors = validateQuiz(quiz);
    if (validationErrors.length > 0) {
      setNotice("");
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setNotice("Quiz exported successfully.");
    exportQuiz(quiz);
  };

  const handleReset = () => {
    setQuiz(initialQuiz);
    setErrors([]);
    setNotice("");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Quiz Editor</h1>
        <p>Create a quiz JSON file or import one to update it.</p>
      </header>

      <section className="toolbar">
        <label className="import-label" htmlFor="import-quiz-file">
          Import quiz JSON
        </label>
        <input
          id="import-quiz-file"
          type="file"
          accept=".json,application/json"
          onChange={handleImport}
        />
        <button type="button" onClick={handleExport}>
          Export Quiz
        </button>
        <button type="button" className="secondary-button" onClick={handleReset}>
          New Quiz
        </button>
      </section>

      {notice ? <p className="notice">{notice}</p> : null}

      {errors.length > 0 ? (
        <section className="error-panel" aria-live="assertive">
          <h2>Validation errors</h2>
          <ul>
            {errors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <QuizForm quiz={quiz} setQuiz={setQuiz} />
    </div>
  );
}

export default App;
