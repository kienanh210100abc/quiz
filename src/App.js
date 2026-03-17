import { useState } from "react";
import QuizForm from "./components/QuizForm";
import { exportQuiz } from "./utils/exportQuiz";
import "./App.css";
import { importQuiz } from "./utils/importQuiz";

// Định nghĩa trạng thái ban đầu của quiz khi tạo quiz mới
const initialQuiz = {
  name: "", // Tên của quiz
  description: "", // Mô tả chi tiết về quiz
  questions: [], // Danh sách các câu hỏi trong quiz
};

// Hàm kiểm tra tính hợp lệ của dữ liệu quiz
const validateQuiz = (quiz) => {
  // Mảng để lưu trữ các lỗi xác thực
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

    // Lấy danh sách giá trị của tất cả các tùy chọn
    const values = question.options.map((option) => option.value);
    // Tạo Set để kiểm tra các giá trị duy nhất
    const uniqueValues = new Set(values);
    // Kiểm tra xem tất cả giá trị tùy chọn có duy nhất không
    if (uniqueValues.size !== values.length) {
      errors.push(`${label}: option values must be unique.`);
    }

    // Lặp qua từng tùy chọn trong câu hỏi để kiểm tra chi tiết
    question.options.forEach((option, optionIndex) => {
      // Tạo nhãn tùy chọn để sử dụng trong thông báo lỗi
      const optionLabel = `${label}, option ${optionIndex + 1}`;
      // Kiểm tra xem giá trị tùy chọn có được nhập không
      if (!option.value.trim()) {
        errors.push(`${optionLabel}: value is required.`);
      }
      // Kiểm tra xem nhãn tùy chọn (hiển thị) có được nhập không
      if (!option.label.trim()) {
        errors.push(`${optionLabel}: label is required.`);
      }
      // Kiểm tra xem thứ tự sắp xếp có phải là số hợp lệ không
      if (!Number.isFinite(Number(option.sortOrder))) {
        errors.push(`${optionLabel}: sort order must be a number.`);
      }
    });

    // Kiểm tra xem có ít nhất 1 đáp án đúng được chọn không
    if (
      !Array.isArray(question.correctOptionValues) ||
      question.correctOptionValues.length < 1
    ) {
      errors.push(`${label}: at least 1 correct option is required.`);
      return; // Dừng kiểm tra nếu không có đáp án đúng
    }

    // Kiểm tra xem các đáp án đúng có tồn tại trong danh sách tùy chọn không
    const invalidCorrectValues = question.correctOptionValues.filter(
      (value) => !uniqueValues.has(value),
    );
    // Thêm lỗi nếu có đáp án đúng không hợp lệ
    if (invalidCorrectValues.length > 0) {
      errors.push(
        `${label}: correct options must match existing option values.`,
      );
    }
  });
  return errors;
};

function App() {
  // State để lưu trữ dữ liệu quiz hiện tại
  const [quiz, setQuiz] = useState(initialQuiz);
  const [errors, setErrors] = useState([]);
  const [notice, setNotice] = useState("");

  // Hàm xử lý khi người dùng nhập file quiz JSON
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

  // Hàm xử lý khi người dùng click nút Export (xuất quiz)
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

  // Hàm xử lý khi người dùng click nút "New Quiz" (tạo quiz mới)
  const handleReset = () => {
    console.log("ad new ques");

    setQuiz(initialQuiz);
    setErrors([]);
    setNotice("");
  };

  return (
    // Container chính của ứng dụng
    <div className="app-container">
      <header className="app-header">
        <h1>Quiz Editor</h1>
        <p>Create a quiz JSON file or import one to update it.</p>
      </header>

      <section className="toolbar">
        <label className="import-label" htmlFor="import-quiz-file">
          Import quiz JSON
        </label>
        {/* Input để chọn file JSON từ máy tính */}
        <input
          id="import-quiz-file"
          type="file"
          accept=".json,application/json" // Chỉ chấp nhận file JSON
          onChange={handleImport}
        />
        <button type="button" onClick={handleExport}>
          Export Quiz
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={handleReset}
        >
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
