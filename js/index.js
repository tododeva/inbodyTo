function showAlert({ message = "작업 완료", type = "success", color = "#4CAF50" }) {

  const toast = document.getElementById("toast");
  const icon = document.getElementById("toast-icon");
  const text = document.getElementById("toast-message");
  text.textContent = message;
  toast.style.backgroundColor = color;
  icon.textContent = type;


  toast.classList.add("show");
  //toast.className = `alert-${type} mt-3`; // success, danger 등 적용
  // 3초 후 자동 숨김
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.getElementById("convertButton").addEventListener('click', processCSV);

function processCSV() {
  const fileInput = document.getElementById("csvFileInput");
  const resultElement = document.getElementById("result");

  if (!fileInput.files.length) {
    showAlert({ message: " CSV 파일을 선택하세요!", type: "⚠️", color: "#f44336" });
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const text = event.target.result;
    const rows = text.split("\n");
    const firstRow = rows[1]?.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);

    if (!firstRow || firstRow.length < 6) {
      showAlert({ message: "CSV 파일 형식이 올바르지 않습니다!", type: "⚠️", color: "#f44336" });
      return;
    }

    // CSV 데이터에서 값 추출
    //const date = new Date().toISOString().slice(2, 10).replace(/-/g, "."); // 오늘 날짜
    const today = new Date();
    const options = { timeZone: 'Asia/Seoul', year: '2-digit', month: '2-digit', day: '2-digit' };
    const formatter = new Intl.DateTimeFormat('ko-KR', options);
    console.log(formatter.format(today));
    const date = formatter.format(today).replace(/-/g, '.').replace(/\s/g, "").slice(0, -1);;

    console.log(date);
    const weight = firstRow[1].trim().replace(/"/g, ""); // 몸무게
    const bfm = firstRow[2].trim().replace(/"/g, ""); // 체지방량
    const smm = firstRow[3].trim().replace(/"/g, ""); // 골격근량
    const bmi = firstRow[4].trim().replace(/"/g, ""); // BMI
    const pbf = firstRow[5].trim().replace(/"/g, ""); // 체지방률

    // 원하는 형식으로 변환
    const resultText = `<strong>${date} :</strong>${weight}kg/${pbf}%(${bfm}/${smm})/BMI${bmi}`;
    resultElement.innerHTML = resultText;
    resultElement.classList.add("text-success"); // 스타일 적용

    const contentsText = resultElement.textContent;
    navigator.clipboard.writeText(contentsText).then(() => {
      showAlert({ message: "변환후 결과가 클립보드에 복사되었습니다! (Ctrl+V) 하세요!", type: "✅", color: "#16a606" });
    }).catch(err => {
      showAlert({ message: "복사 실패! 다시 시도해주세요", type: "❌", color: "#f44336" });
      console.error("복사 오류:", err);
    });
  };

  reader.readAsText(file);
}