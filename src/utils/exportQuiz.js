// Ham xuat quiz thanh file JSON de tai ve may nguoi dung
export function exportQuiz(quiz) {
  // Tao ban sao quiz da duoc lam sach du lieu truoc khi xuat
  const sanitizeQuiz = {
    // Cat khoang trang du thua o ten quiz
    name: quiz.name.trim(),
    // Cat khoang trang du thua o mo ta quiz
    description: quiz.description.trim(),
    // Sao chep danh sach cau hoi, sap xep theo sortOrder, roi chuan hoa tung cau hoi
    questions: [...quiz.questions]
      .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
      .map((question) => ({
        // Cat khoang trang du thua o ten cau hoi
        name: question.name.trim(),
        // Cat khoang trang du thua o mo ta cau hoi
        description: question.description.trim(),
        // Chuyen sortOrder ve kieu so
        sortOrder: Number(question.sortOrder),
        // Sao chep danh sach lua chon, sap xep theo sortOrder, roi chuan hoa tung lua chon
        options: [...question.options]
          .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
          .map((option) => ({
            // Cat khoang trang du thua o value cua lua chon
            value: option.value.trim(),
            // Cat khoang trang du thua o label cua lua chon
            label: option.label.trim(),
            // Chuyen sortOrder cua lua chon ve kieu so
            sortOrder: Number(option.sortOrder),
          })),
        // Sao chep danh sach dap an dung
        correctOptionValues: [...question.correctOptionValues],
      })),
  };

  // Chuyen doi object quiz thanh chuoi JSON dep (indent 2 spaces)
  const data = JSON.stringify(sanitizeQuiz, null, 2);

  // Tao blob JSON de trinh duyet co the tai xuong nhu mot file
  const blob = new Blob([data], {
    type: "application/json",
  });

  // Tao URL tam thoi tro den blob vua tao
  const url = URL.createObjectURL(blob);

  // Tao phan tu anchor de kich hoat hanh dong tai file
  const a = document.createElement("a");

  // Gan URL blob vao href cua anchor
  a.href = url;
  // Dat ten file tai xuong, thay khoang trang bang dau gach duoi, mac dinh la "quiz.json"
  a.download = `${sanitizeQuiz.name ? sanitizeQuiz.name.replace(/\s+/g, "_") : "quiz"}.json`;

  // Gia lap click de trinh duyet bat dau tai file
  a.click();

  // Thu hoi URL tam thoi de giai phong bo nho
  URL.revokeObjectURL(url);
}
