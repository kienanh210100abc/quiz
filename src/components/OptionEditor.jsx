// Nhập React để sử dụng JSX trong component

// Component quản lý danh sách các tùy chọn (đáp án) của một câu hỏi
// Nhận vào: câu hỏi hiện tại, hàm onChange để cập nhật lên component cha, và index câu hỏi
const OptionEditor = ({ question, onChange, questionIndex }) => {
  // Hàm thêm một tùy chọn mới vào câu hỏi
  const addOption = () => {
    // Tính chỉ số tiếp theo dựa trên số lượng tùy chọn hiện có
    const nextIndex = question.options.length + 1;
    // Tạo object tùy chọn mới với giá trị mặc định
    const newOption = {
      // Giá trị định danh duy nhất, dạng "option_<câu hỏi>_<thứ tự>"
      value: `option_${questionIndex + 1}_${nextIndex}`,
      // Nhãn hiển thị ban đầu để trống, người dùng sẽ điền sau
      label: "",
      // Thứ tự sắp xếp của tùy chọn
      sortOrder: nextIndex,
    };

    // Gọi onChange để thông báo cho component cha cập nhật câu hỏi với tùy chọn mới
    onChange({
      ...question,
      options: [...question.options, newOption],
    });
  };

  // Hàm cập nhật nội dung một tùy chọn theo vị trí index
  const updateOption = (optionIndex, updatedOption) => {
    // Lưu lại tùy chọn cũ trước khi thay đổi để so sánh value
    const previousOption = question.options[optionIndex];
    // Tạo danh sách tùy chọn mới, thay thế đúng tùy chọn cần cập nhật
    //Đúng vị trí cần sửa thì thay bằng updatedOption, còn lại giữ nguyên
    const updatedOptions = question.options.map((option, index) =>
      index === optionIndex ? updatedOption : option,
    );

    // Giữ nguyên danh sách đáp án đúng ban đầu
    let updatedCorrectOptions = question.correctOptionValues;
    // Nếu value của tùy chọn bị đổi, cập nhật lại value tương ứng trong danh sách đáp án đúng
    /*
    Ví dụ:
      Trước: option cũ có value = "A", và "A" đang là đáp án đúng.
      Sau sửa: option mới có value = "answer_a".
      Đoạn này sẽ thay "A" thành "answer_a" trong correctOptionValues
      để đảm bảo đáp án đúng vẫn chính xác sau khi value của tùy chọn thay đổi.
    */
    if (previousOption && previousOption.value !== updatedOption.value) {
      updatedCorrectOptions = updatedCorrectOptions.map((value) =>
        value === previousOption.value ? updatedOption.value : value,
      );
    }

    // Tập hợp tất cả value hợp lệ sau khi cập nhật
    const validOptionValues = new Set(
      updatedOptions.map((option) => option.value),
    );
    // Loại bỏ các đáp án đúng không còn tồn tại trong danh sách tùy chọn
    updatedCorrectOptions = updatedCorrectOptions.filter((value) =>
      validOptionValues.has(value),
    );

    // Gọi onChange để cập nhật câu hỏi với tùy chọn và đáp án đúng mới
    onChange({
      ...question,
      options: updatedOptions,
      correctOptionValues: updatedCorrectOptions,
    });
  };

  // Hàm xóa một tùy chọn theo vị trí index
  const removeOption = (optionIndex) => {
    // Lưu lại tùy chọn sắp bị xóa để loại nó khỏi danh sách đáp án đúng
    const removedOption = question.options[optionIndex];

    // Lọc bỏ tùy chọn bị xóa và cấp lại sortOrder liên tục từ 1
    const updatedOptions = question.options
      .filter((_, index) => index !== optionIndex)
      .map((option, index) => ({
        ...option,
        sortOrder: index + 1,
      }));

    // Cập nhật câu hỏi: loại tùy chọn đã xóa và loại value của nó khỏi đáp án đúng nếu có
    onChange({
      ...question,
      options: updatedOptions,
      // Nếu tùy chọn bị xóa từng là đáp án đúng, tự động loại nó ra
      correctOptionValues: question.correctOptionValues.filter(
        (value) => value !== removedOption.value,
      ),
    });
  };

  // Hàm bật/tắt trạng thái đáp án đúng của một tùy chọn
  const toggleCorrectOption = (optionValue) => {
    // Kiểm tra xem tùy chọn này đã được đánh dấu là đúng chưa
    const isSelected = question.correctOptionValues.includes(optionValue);
    // Nếu đã chọn thì bỏ ra, nếu chưa thì thêm vào
    const updatedCorrectOptions = isSelected
      ? question.correctOptionValues.filter((value) => value !== optionValue)
      : [...question.correctOptionValues, optionValue];

    // Gọi onChange để cập nhật danh sách đáp án đúng mới
    onChange({
      ...question,
      correctOptionValues: updatedCorrectOptions,
    });
  };

  // Render giao diện danh sách tùy chọn
  return (
    <div className="option-editor">
      {/* Tiêu đề phần tùy chọn */}
      <h4>Options</h4>

      {/* Hiển thị thông báo khi chưa có tùy chọn nào */}
      {question.options.length === 0 ? (
        <p className="empty-state">No options yet.</p>
      ) : null}

      {/* Lặp qua từng tùy chọn để hiển thị form chỉnh sửa */}
      {question.options.map((option, index) => (
        <div key={`option-${index}`} className="option-row">
          {/* Hàng đầu của mỗi tùy chọn: tiêu đề và nút xóa */}
          <div className="option-row-top">
            <strong>Option {index + 1}</strong>
            <button
              type="button"
              className="danger-button"
              // Xóa tùy chọn tại vị trí hiện tại
              onClick={() => removeOption(index)}
            >
              Remove Option
            </button>
          </div>

          {/* Label và ô nhập giá trị định danh của tùy chọn */}
          <label htmlFor={`option-value-${questionIndex}-${index}`}>
            Value
          </label>
          <input
            id={`option-value-${questionIndex}-${index}`}
            placeholder="Option Value"
            value={option.value}
            // Cập nhật value khi người dùng thay đổi
            onChange={(e) =>
              updateOption(index, {
                ...option,
                value: e.target.value,
              })
            }
          />

          {/* Label và ô nhập nhãn hiển thị của tùy chọn */}
          <label htmlFor={`option-label-${questionIndex}-${index}`}>
            Label
          </label>
          <input
            id={`option-label-${questionIndex}-${index}`}
            placeholder="Option Label"
            value={option.label}
            // Cập nhật label khi người dùng thay đổi
            onChange={(e) =>
              updateOption(index, {
                ...option,
                label: e.target.value,
              })
            }
          />

          {/* Label và ô nhập thứ tự sắp xếp của tùy chọn */}
          <label htmlFor={`option-order-${questionIndex}-${index}`}>
            Sort order
          </label>
          <input
            id={`option-order-${questionIndex}-${index}`}
            type="number"
            min="1"
            value={option.sortOrder}
            // Chuyển giá trị input thành số và cập nhật sortOrder
            onChange={(e) =>
              updateOption(index, {
                ...option,
                sortOrder: Number(e.target.value),
              })
            }
          />

          {/* Checkbox để đánh dấu tùy chọn này là đáp án đúng */}
          <label
            className="checkbox-row"
            htmlFor={`option-correct-${questionIndex}-${index}`}
          >
            <input
              id={`option-correct-${questionIndex}-${index}`}
              type="checkbox"
              // Checkbox được tick nếu value của tùy chọn nằm trong danh sách đáp án đúng
              checked={question.correctOptionValues.includes(option.value)}
              // Bật/tắt trạng thái đáp án đúng khi người dùng click
              onChange={() => toggleCorrectOption(option.value)}
            />
            Correct option
          </label>
        </div>
      ))}

      {/* Nút thêm tùy chọn mới */}
      <button onClick={addOption}>Add Option</button>
    </div>
  );
};

// Xuất component để sử dụng trong QuestionEditor
export default OptionEditor;
