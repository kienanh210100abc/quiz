import React from 'react'
import QuestionEditor from './QuestionEditor'

const QuizForm = ({ quiz, setQuiz }) => {
  return (
      <div className="quiz-form">

      <h2>Quiz Info</h2>

      <label htmlFor="quiz-name">Quiz Name</label>
      <input
        id="quiz-name"
        placeholder="Quiz Name"
        value={quiz.name}
        onChange={(e) =>
          setQuiz({ ...quiz, name: e.target.value })
        }
      />

      <label htmlFor="quiz-description">Description</label>
      <textarea
        id="quiz-description"
        placeholder="Description"
        value={quiz.description}
        onChange={(e) =>
          setQuiz({ ...quiz, description: e.target.value })
        }
      />

      <QuestionEditor quiz={quiz} setQuiz={setQuiz} />

    </div>
  )
}

export default QuizForm
