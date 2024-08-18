const questions = document.querySelector(".questions");
let questionPage = document.querySelector(".question-page");
const myBox = document.querySelector(".my-box");
const mainPart = document.querySelector(".main-part");
const boxFiller = document.querySelector(".box-filler");
const countScore = document.querySelector(".num");
const retakeQuiz = document.querySelector(".btn");
const refreshBox = document.querySelector(".refresh-box");
const refreshBtn = document.querySelector(".refresh-btn");
let wrongAnswer = [];
let score = 0;
let questionCount = 0;
const preloader = document.querySelector(".preloader");

// window.addEventListener();

async function Quiz() {
  try {
    const fetch_URL = localStorage.getItem("url");
    const response = await fetch(fetch_URL);
    preloader.classList.add("hide-preloader");
    if (!response.ok) {
      throw new Error(
        "Oops,something wrong while processing time please try again..."
      );
    }
    const data = await response.json();
    let getQuestion = data.results;
    async function startQuiz() {
      questions.innerText = getQuestion[score].question;
      let correctOption = getQuestion[score].correct_answer;
      let incorrectOptions = getQuestion[score].incorrect_answers;
      let allOptions = [...incorrectOptions];
      let randomData = Math.floor(Math.random() * 3) + 1;
      allOptions.splice(randomData - 1, 0, correctOption);
      // map function(step2)
      let totalOption = allOptions.map((total, index) => {
        const choiceLetter = String.fromCharCode(65 + index); //A, B, C, D
        return `<div class="answer">
        <div class="choice">${choiceLetter}</div>
          <div class="choices">${total}</div>
        </div>`;
      });
      questionPage.innerHTML = totalOption.join(" ");
      let options = document.querySelectorAll(".choices");

      //addEventListener(step4)
      options.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          options.forEach((opt) => (opt.style.pointerEvents = "none"));
          if (option.innerText === correctOption) {
            questionCount++;
            // Change the background color to green if the option is correct
            option.classList.add("correct");
            countScore.innerText = `${Math.floor(
              (questionCount / getQuestion.length) * 100
            )}%`;
          } else {
            option.classList.add("incorrect");
            wrongAnswer.push({ index: score, value: option.innerText });
          }
          if (score <= getQuestion.length) {
            score++;
            boxFiller.style.width = `${(score / getQuestion.length) * 100}%`;
          }
          if (getQuestion.length === score) {
            questions.innerText = "You've completed the quiz!";
            options.forEach((opt) => {
              opt.style.pointerEvents = "none";
            });
            setTimeout(() => {
              myBox.classList.add("show-box");
              let modalSaver = getQuestion
                .map((values, index) => {
                  let correctValues = values.correct_answer;
                  let incorrectValues = values.incorrect_answers;
                  let allOption = [...incorrectValues];
                  let randomValues = Math.floor(Math.random() * 3) + 1;
                  allOption.splice(randomValues - 1, 0, correctValues);
                  return ` <div class="final-question">${
                    values.question
                  }<ul>${allOption
                    .map(
                      (choice) =>
                        `<li class="yours-choice" data-id="${index}">${choice}</li>`
                    )
                    .join("")}</ul></div>`;
                })
                .join("");
              mainPart.innerHTML = modalSaver;
              const yourChoice = document.querySelectorAll(".yours-choice");

              yourChoice.forEach((choice, index) => {
                choice.style.pointerEvents = "none";
                // Check if the choice is correct
                const question = getQuestion.find(
                  (el, index) => choice.getAttribute("data-id") == index
                );

                if (choice.innerText === question.correct_answer) {
                  choice.innerHTML = `${choice.textContent}<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
               <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
               </svg>`;
                  choice.style.pointerEvents = "none";
                }

                const isWrongAnswerExist = wrongAnswer.find(
                  (el) => el.index == choice.getAttribute("data-id")
                );

                if (
                  isWrongAnswerExist &&
                  isWrongAnswerExist.value === choice.innerText
                ) {
                  choice.innerHTML = `${choice.textContent}<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
                     <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;
                }
              });
            }, 600);
          } else {
            setTimeout(() => startQuiz(), 300);
          }
        });
      });
      retakeQuiz.addEventListener("click", () => {
        window.location.href = "user.html";
      });
    }
    startQuiz();
  } catch (error) {
    questions.innerText = error.message;
    questions.style.color = "red";
    questions.style.margin = `${12}px`;
    refreshBox.classList.add("show-refresh-box");
    refreshBtn.addEventListener("click", () => {
      location.reload();
    });
  }
}
Quiz();
