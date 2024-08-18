const startQuizBtn = document.querySelector(".start-btn");
let selectedAmount = document.getElementById("question-control");
let Category = document.getElementById("Category");
let Difficulty = document.getElementById("difficulty");
let Type = document.getElementById("type");
startQuizBtn.addEventListener("click", (e) => {
  e.preventDefault();
  location.replace("index.html");
  let amounted = selectedAmount.value;
  console.log(amounted);
  let url = `https://opentdb.com/api.php?amount=${amounted}`;
  if (Category.value && Category.value !== "any") {
    url += `&category=${Category.value}`;
  }

  // Add difficulty if it is selected and not the default value
  if (Difficulty.value && Difficulty.value !== "any") {
    url += `&difficulty=${Difficulty.value}`;
  }

  // Add type if it is selected and not the default value
  if (Type.value && Type.value !== "any") {
    url += `&type=${Type.value}`;
  }
  localStorage.setItem("url", url);

  console.log(url);
});
