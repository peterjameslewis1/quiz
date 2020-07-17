function start() {
  const next = document.getElementById("next");
  const start = document.getElementById("start-btn");
  const jumbotron = document.getElementsByClassName("jumbotron")[0];
  let count = 0;
  const answerContainer = document.getElementsByClassName("answer-container")[0];
  let score = 0;
  const endScore = document.querySelector(".score-container span");
  const endScoreContainer = document.querySelector(".score-container");
  let numQuestion;
  let difficulty;
  let category;

  start.addEventListener('click', () => {
    numQuestion = document.getElementById("num-questions").value;
    difficulty = document.getElementById("difficulty").value;
    category = document.getElementById("category").value;
    if (numQuestion == 0 && difficulty == 0 && category == 0) {
      console.log('false')
      const error = document.getElementById("error");
      error.innerText = 'Please complete fields';
    } else {
      startGame()
      console.log('true')
    }
  });





  function startGame() {

    const loader = document.querySelector("#start span");
    loader.classList.add("loader");
    setTimeout(() => {
      jumbotron.classList.remove("hide");
      document.getElementById("start").classList.add("hide");
    }, 2000)


    const url = `https://opentdb.com/api.php?amount=${numQuestion}&category=${category}&type=multiple&difficulty=${difficulty}`;
    axios.get(url).then((res) => {
      var data = res.data.results;
      console.log(data);




      var quiz = {
        category: `${data[count].category}`,
        difficulty: `${data[count].difficulty}`,
        question: `${data[count].question}`,
        incorrectAnswers: data[count].incorrect_answers,
        correctAnswer: `${data[count].correct_answer}`
      }


      next.addEventListener('click', function () {
        count++;
        showQuestion(data);
        showAnswers(quiz);

        if (count == data.length - 1) {
          next.addEventListener('click', function () {
            endScoreContainer.classList.remove('hide')
            document.body.style.backgroundColor = '#F44336';
          })
        }
      })




      function loadData(quiz) {
        // category.innerText = quiz.category;
        const quizTitle = document.querySelector(".display-4");
        quizTitle.innerText = quiz.category;
        showQuestion(data);
        showAnswers(quiz);
        selectAnswer()
      }



      function showQuestion(quiz) {
        // Appending els to the DOM
        const decodedQuestion = decodeURI(quiz[count].question)
        question.innerHTML = decodedQuestion;
        console.log(quiz[count].question)
      }



      function showAnswers() {
        answerContainer.innerText = '';


        data[count].incorrect_answers.forEach(element => {
          const incorrect = document.createElement("button");
          incorrect.innerHTML = decodeURI(element);
          incorrect.classList.add("incorrect");
          incorrect.dataset.incorrect = 'incorrect'
          answerContainer.appendChild(incorrect);
        });

        // Appending correct buttons
        var correct = document.createElement("button")

        correct.innerHTML = decodeURI(data[count].correct_answer);
        correct.classList.add("correct");

        correct.dataset.correct = 'correct';
        answerContainer.appendChild(correct);

        selectAnswer()
      }


      function selectAnswer() {
        var answerBtn = document.querySelectorAll(".answer-container button");

        answerBtn.forEach(btn => {
          btn.addEventListener('click', function () {
            const flip = document.querySelector(".answer-wrapper");
            flip.classList.add("answer-container-clicked");
            const incorrectAnswer = document.querySelector(".selected-answer");
            const correctAnswer = document.querySelector(".correct-answer");

            if (btn.classList.contains("correct")) {
              incorrectAnswer.classList.add("hide");
              flip.classList.add("answer-container-clicked");
              correctAnswer.innerText = `Correct: ${data[count].correct_answer}`;
              score++;
              endScore.innerText = ` ${score}/${data.length}`
            } else {
              incorrectAnswer.classList.remove("hide");
              incorrectAnswer.innerText = `Wrong: ${btn.innerText}`
              correctAnswer.innerText = `Correct: ${data[count].correct_answer}`;
            }
            next.addEventListener('click', () => {
              flip.classList.remove("answer-container-clicked");
            })
          })
        })

        let newArray = shuffle()
      }


      let shuffle = function () {
        var list = document.querySelector('.answer-container'),
          i;
        for (i = list.children.length; i >= 0; i--) {
          list.appendChild(list.children[Math.random() * i | 0]);
        }
      }

      function restart() {
        const restartBtn = document.querySelector(".restart");
        restartBtn.addEventListener("click", () => {
          location.reload();
        })
      }
      restart()
      loadData(quiz)
    })
  };


}
start()
