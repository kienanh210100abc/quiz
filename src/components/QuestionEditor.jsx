import OptionEditor from "./OptionEditor";

// Component quan ly danh sach cau hoi trong quiz
const QuestionEditor = ({ quiz, setQuiz }) => {
  // Ham them mot cau hoi moi vao quiz
  const addQuestion = () => {
    // Tao object cau hoi moi voi gia tri mac dinh
    const newQuestion = {
      name: "",
      description: "",
      sortOrder: quiz.questions.length + 1,
      options: [],
      correctOptionValues: [],
    };

    // Cap nhat state quiz bang cach them cau hoi moi vao cuoi danh sach
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, newQuestion],
    });
  };

  // Ham cap nhat noi dung mot cau hoi theo vi tri index
  const updateQuestion = (questionIndex, updatedQuestion) => {
    // Tao danh sach cau hoi moi, thay the dung cau hoi can cap nhat
    const updatedQuestions = quiz.questions.map((q, index) =>
      index === questionIndex ? updatedQuestion : q,
    );

    // Ghi danh sach cau hoi da cap nhat vao state
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    });
  };

  // Ham xoa mot cau hoi theo index
  const removeQuestion = (questionIndex) => {
    // Loc bo cau hoi bi xoa, sau do danh lai sortOrder tu 1
    const updatedQuestions = quiz.questions
      .filter((_, index) => index !== questionIndex)
      .map((question, index) => ({
        ...question,
        sortOrder: index + 1,
      }));

    // Cap nhat lai state sau khi xoa cau hoi
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    });
  };

  // Render giao dien danh sach cau hoi
  return (
    // Khung chua chinh cua khu vuc question editor
    <div className="question-editor">
      {/* Tieu de phan cau hoi */}
      <h2>Questions</h2>

      {/* Hien thi thong bao khi chua co cau hoi nao */}
      {quiz.questions.length === 0 ? (
        <p className="empty-state">
          No questions yet. Click "Add Question" to start.
        </p>
      ) : null}

      {/* Lap qua tung cau hoi de hien thi form chinh sua */}
      {quiz.questions.map((q, index) => (
        <div key={`question-${index}`} className="question-card">
          {/* Header cua the cau hoi gom tieu de va nut xoa */}
          <div className="card-header">
            <h3>Question {index + 1}</h3>
            <button
              type="button"
              className="danger-button"
              // Xoa cau hoi tai vi tri hien tai
              onClick={() => removeQuestion(index)}
            >
              Remove Question
            </button>
          </div>

          {/* Label cho truong ten cau hoi */}
          <label htmlFor={`question-name-${index}`}>Name</label>

          {/* O nhap ten cau hoi */}
          <input
            id={`question-name-${index}`}
            placeholder="Question Name"
            value={q.name}
            // Cap nhat ten cau hoi khi nguoi dung thay doi
            onChange={(e) =>
              updateQuestion(index, { ...q, name: e.target.value })
            }
          />

          {/* Label cho truong mo ta cau hoi */}
          <label htmlFor={`question-description-${index}`}>Description</label>
          {/* O nhap mo ta cau hoi */}
          <textarea
            id={`question-description-${index}`}
            placeholder="Question Description"
            value={q.description}
            // Cap nhat mo ta cau hoi khi nguoi dung thay doi
            onChange={(e) =>
              updateQuestion(index, { ...q, description: e.target.value })
            }
          />

          {/* Label cho truong thu tu sap xep cau hoi */}
          <label htmlFor={`question-order-${index}`}>Sort order</label>
          {/* O nhap so thu tu sap xep */}
          <input
            id={`question-order-${index}`}
            type="number"
            min="1"
            value={q.sortOrder}
            // Chuyen gia tri input thanh so va cap nhat sortOrder
            onChange={(e) =>
              updateQuestion(index, {
                ...q,
                sortOrder: Number(e.target.value),
              })
            }
          />

          {/* Component con de chinh sua danh sach options cua cau hoi */}
          <OptionEditor
            question={q}
            // Nhan du lieu cau hoi da cap nhat tu OptionEditor va luu lai
            onChange={(updatedQuestion) =>
              updateQuestion(index, updatedQuestion)
            }
            questionIndex={index}
          />
        </div>
      ))}

      {/* Nut them cau hoi moi */}
      <button onClick={addQuestion}>Add Question</button>
    </div>
  );
};

// Export component de su dung o noi khac
export default QuestionEditor;
