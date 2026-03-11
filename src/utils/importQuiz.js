const toStringValue = (value) => {
  if (typeof value === "string") {
    return value;
  }
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
};

const toNumberValue = (value, fallback) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeQuiz = (rawData) => {
  const rawQuiz = rawData && typeof rawData === "object" ? rawData : {};

  const questions = Array.isArray(rawQuiz.questions)
    ? rawQuiz.questions.map((rawQuestion, questionIndex) => {
        const question = rawQuestion && typeof rawQuestion === "object" ? rawQuestion : {};

        const options = Array.isArray(question.options)
          ? question.options.map((rawOption, optionIndex) => {
              const option = rawOption && typeof rawOption === "object" ? rawOption : {};

              return {
                value: toStringValue(option.value) || `option_${questionIndex + 1}_${optionIndex + 1}`,
                label: toStringValue(option.label),
                sortOrder: toNumberValue(option.sortOrder, optionIndex + 1),
              };
            })
          : [];

        const optionValues = new Set(options.map((option) => option.value));
        const correctOptionValues = Array.isArray(question.correctOptionValues)
          ? [...new Set(question.correctOptionValues.map((value) => toStringValue(value)))].filter(
              (value) => optionValues.has(value)
            )
          : [];

        return {
          name: toStringValue(question.name),
          description: toStringValue(question.description),
          sortOrder: toNumberValue(question.sortOrder, questionIndex + 1),
          options,
          correctOptionValues,
        };
      })
    : [];

  return {
    name: toStringValue(rawQuiz.name),
    description: toStringValue(rawQuiz.description),
    questions,
  };
};

export async function importQuiz(file) {
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