export function exportQuiz(quiz) {

 const sanitizeQuiz = {
   name: quiz.name.trim(),
   description: quiz.description.trim(),
   questions: [...quiz.questions]
     .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
     .map((question) => ({
       name: question.name.trim(),
       description: question.description.trim(),
       sortOrder: Number(question.sortOrder),
       options: [...question.options]
         .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
         .map((option) => ({
           value: option.value.trim(),
           label: option.label.trim(),
           sortOrder: Number(option.sortOrder),
         })),
       correctOptionValues: [...question.correctOptionValues],
     })),
 };

 const data = JSON.stringify(sanitizeQuiz, null, 2);

 const blob = new Blob([data], {
   type: "application/json"
 });

 const url = URL.createObjectURL(blob);

 const a = document.createElement("a");

 a.href = url;
 a.download = `${sanitizeQuiz.name ? sanitizeQuiz.name.replace(/\s+/g, "_") : "quiz"}.json`;

 a.click();

 URL.revokeObjectURL(url);
}