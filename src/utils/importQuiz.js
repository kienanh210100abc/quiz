// Hàm chuyển đổi bất kỳ giá trị nào thành chuỗi
// Nếu giá trị là null hoặc undefined, trả về chuỗi rỗng
const toStringValue = (value) => {
  // Nếu giá trị đã là chuỗi, trả về trực tiếp
  if (typeof value === "string") {
    return value;
  }
  // Nếu giá trị là null hoặc undefined, trả về chuỗi rỗng
  if (value === null || value === undefined) {
    return "";
  }
  // Chuyển đổi giá trị thành chuỗi bằng String()
  return String(value);
};

// Hàm chuyển đổi bất kỳ giá trị nào thành số
// Nếu chuyển đổi không thành công, sử dụng giá trị fallback
const toNumberValue = (value, fallback) => {
  // Cố gắng chuyển đổi giá trị thành số
  const num = Number(value);
  // Kiểm tra xem kết quả có phải là số hợp lệ không, nếu không trả về fallback
  return Number.isFinite(num) ? num : fallback;
};

// Hàm chuẩn hóa dữ liệu quiz từ file JSON
// Đảm bảo tất cả các trường có định dạng đúng
const normalizeQuiz = (rawData) => {
  // Kiểm tra xem dữ liệu có phải là object không, nếu không gán object rỗng
  const rawQuiz = rawData && typeof rawData === "object" ? rawData : {};

  // Xử lý danh sách câu hỏi - nếu không phải mảng, gán mảng rỗng
  const questions = Array.isArray(rawQuiz.questions)
    ? rawQuiz.questions.map((rawQuestion, questionIndex) => {
        // Kiểm tra xem câu hỏi có phải là object không, nếu không gán object rỗng
        const question =
          rawQuestion && typeof rawQuestion === "object" ? rawQuestion : {};

        // Xử lý danh sách tùy chọn (đáp án)
        const options = Array.isArray(question.options)
          ? question.options.map((rawOption, optionIndex) => {
              // Kiểm tra xem tùy chọn có phải là object không
              const option =
                rawOption && typeof rawOption === "object" ? rawOption : {};

              // Trả về object tùy chọn được chuẩn hóa
              return {
                // Giá trị tùy chọn (nếu trống, tạo giá trị mặc định)
                value:
                  toStringValue(option.value) ||
                  `option_${questionIndex + 1}_${optionIndex + 1}`,
                // Nhãn hiển thị của tùy chọn
                label: toStringValue(option.label),
                // Thứ tự sắp xếp (mặc định là chỉ số nếu không có)
                sortOrder: toNumberValue(option.sortOrder, optionIndex + 1),
              };
            })
          : []; // Nếu không có tùy chọn, gán mảng rỗng

        // Tạo Set chứa tất cả các giá trị tùy chọn để kiểm tra nhanh
        const optionValues = new Set(options.map((option) => option.value));
        // Xử lý danh sách các đáp án đúng
        const correctOptionValues = Array.isArray(question.correctOptionValues)
          ? [
              // Tạo Set để loại bỏ các giá trị trùng lặp
              ...new Set(
                // Chuyển đổi tất cả giá trị thành chuỗi
                question.correctOptionValues.map((value) =>
                  toStringValue(value),
                ),
              ),
            ].filter((value) => optionValues.has(value)) // Chỉ giữ những giá trị tồn tại trong tùy chọn
          : []; // Nếu không có đáp án đúng, gán mảng rỗng

        // Trả về object câu hỏi được chuẩn hóa
        return {
          // Tên của câu hỏi
          name: toStringValue(question.name),
          // Mô tả chi tiết của câu hỏi
          description: toStringValue(question.description),
          // Thứ tự sắp xếp (mặc định là chỉ số nếu không có)
          sortOrder: toNumberValue(question.sortOrder, questionIndex + 1),
          // Danh sách các tùy chọn (đáp án)
          options,
          // Danh sách các giá trị tùy chọn đúng
          correctOptionValues,
        };
      })
    : []; // Nếu không có câu hỏi, gán mảng rỗng

  return {
    name: toStringValue(rawQuiz.name),
    description: toStringValue(rawQuiz.description),
    questions,
  };
};

// Hàm chính để nhập quiz từ file JSON
// Xử lý file, đọc nội dung, phân tích JSON, và chuẩn hóa dữ liệu
export async function importQuiz(file) {
  // Kiểm tra xem có file được chọn không
  if (!file) {
    throw new Error("No file selected.");
  }

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    return normalizeQuiz(parsed);
  } catch (error) {
    throw new Error("Invalid JSON file.");
  }
}
