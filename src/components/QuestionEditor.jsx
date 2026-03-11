import React from 'react'
import OptionEditor from './OptionEditor';

const QuestionEditor = ({ quiz, setQuiz }) => {
  const addQuestion = () => {

    const newQuestion = {
      name: "",
      description: "",
      sortOrder: quiz.questions.length + 1,
      options: [],
      correctOptionValues: []
    };

    setQuiz({
      ...quiz,
      questions: [...quiz.questions, newQuestion]
    });
  };

  const updateQuestion = (questionIndex, updatedQuestion) => {
    const updatedQuestions = quiz.questions.map((q, index) =>
      index === questionIndex ? updatedQuestion : q
    );

    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };

  const removeQuestion = (questionIndex) => {
    const updatedQuestions = quiz.questions
      .filter((_, index) => index !== questionIndex)
      .map((question, index) => ({
        ...question,
        sortOrder: index + 1,
      }));

    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    });
  };

  return (
    <div className="question-editor">

      <h2>Questions</h2>

      {quiz.questions.length === 0 ? (
        <p className="empty-state">No questions yet. Click "Add Question" to start.</p>
      ) : null}

      {quiz.questions.map((q, index) => (
        <div key={`question-${index}`} className="question-card">
          <div className="card-header">
            <h3>Question {index + 1}</h3>
            <button
              type="button"
              className="danger-button"
              onClick={() => removeQuestion(index)}
            >
              Remove Question
            </button>
          </div>

          <label htmlFor={`question-name-${index}`}>Name</label>

          <input
            id={`question-name-${index}`}
            placeholder="Question Name"
            value={q.name}
            onChange={(e) => updateQuestion(index, { ...q, name: e.target.value })}
          />

          <label htmlFor={`question-description-${index}`}>Description</label>
          <textarea
            id={`question-description-${index}`}
            placeholder="Question Description"
            value={q.description}
            onChange={(e) => updateQuestion(index, { ...q, description: e.target.value })}
          />

          <label htmlFor={`question-order-${index}`}>Sort order</label>
          <input
            id={`question-order-${index}`}
            type="number"
            min="1"
            value={q.sortOrder}
            onChange={(e) =>
              updateQuestion(index, {
                ...q,
                sortOrder: Number(e.target.value),
              })
            }
          />

          <OptionEditor
            question={q}
            onChange={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
            questionIndex={index}
          />

        </div>
      ))}

      <button onClick={addQuestion}>
        Add Question
      </button>

    </div>
  );
}

export default QuestionEditor
