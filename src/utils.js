export function displayDialogue(text, onDisplayEnd) {
    const dialogueUI = document.getElementById("textbox-container");
    const dialogue = document.getElementById("dialogue");

    dialogueUI.style.display = "block";

    if (typeof text === 'object' && text.options) {
        // Handle music selection dialogue
        displayMusicSelectionDialogue(text, dialogue, dialogueUI, onDisplayEnd);
    } else if (typeof text === 'object' && text.questions) {
        // Handle quiz dialogue
        displayInteractiveDialogue(text, dialogue, dialogueUI, onDisplayEnd);
    } else {
        // Handle regular dialogue
        displayRegularDialogue(text, dialogue, dialogueUI, onDisplayEnd);
    }
}

function displayMusicSelectionDialogue(dialogueObj, dialogue, dialogueUI, onDisplayEnd) {
    dialogue.innerHTML = dialogueObj.initial;
    
    dialogueObj.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        dialogue.appendChild(button);
        
        button.addEventListener("click", () => {
            onDisplayEnd(option);
            closeDialogue();
        });
    });

    function closeDialogue() {
        dialogueUI.style.display = "none";
        dialogue.innerHTML = "";
    }

    const closeBtn = document.getElementById("close");
    closeBtn.addEventListener("click", closeDialogue);
}   

function displayRegularDialogue(text, dialogue, dialogueUI, onDisplayEnd) {
    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(() => {
        if (index < text.length) {
            currentText += text[index];
            dialogue.innerHTML = currentText;
            index++;
            return;
        }

        clearInterval(intervalRef);
    }, 5);

    const closeBtn = document.getElementById("close");
    closeBtn.addEventListener("click", closeDialogue);

    function closeDialogue() {
        onDisplayEnd();
        dialogueUI.style.display = "none";
        dialogue.innerHTML = "";
        clearInterval(intervalRef);
        closeBtn.removeEventListener("click", closeDialogue);
    }
}

function displayInteractiveDialogue(dialogueObj, dialogue, dialogueUI, onDisplayEnd) {
    if (dialogueObj.options) {
        dialogue.innerHTML = dialogueObj.initial;
        
        dialogueObj.options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            dialogue.appendChild(button);
            
            button.addEventListener("click", () => {
                onDisplayEnd(option);
                closeDialogue();
            });
        });
    } else {
        let currentQuestionIndex = 0;
        let score = 0;

        dialogue.innerHTML = dialogueObj.initial;
        
        const quizBtn = document.createElement("button");
        quizBtn.textContent = "Start Quiz";
        dialogue.appendChild(quizBtn);

        quizBtn.addEventListener("click", startQuiz);

        function startQuiz() {
            displayQuestion();
        }

        function displayQuestion() {
            if (currentQuestionIndex < dialogueObj.questions.length) {
                const currentQuestion = dialogueObj.questions[currentQuestionIndex];
                dialogue.innerHTML = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;
                
                currentQuestion.options.forEach(option => {
                    const button = document.createElement("button");
                    button.textContent = option;
                    dialogue.appendChild(button);
                    
                    button.addEventListener("click", () => checkAnswer(option));
                });
            } else {
                endQuiz();
            }
        }

        function checkAnswer(selectedOption) {
            const currentQuestion = dialogueObj.questions[currentQuestionIndex];
            if (selectedOption === currentQuestion.answer) {
                score++;
                dialogue.innerHTML = "Correct!";
            } else {
                dialogue.innerHTML = `Sorry, that's incorrect. The correct answer is ${currentQuestion.answer}.`;
            }
            
            currentQuestionIndex++;
            
            const nextBtn = document.createElement("button");
            nextBtn.textContent = "Next Question";
            dialogue.appendChild(nextBtn);
            nextBtn.addEventListener("click", displayQuestion);
        }

        function endQuiz() {
            dialogue.innerHTML = `Quiz completed! Your score: ${score}/${dialogueObj.questions.length}`;
            
            const closeBtn = document.createElement("button");
            closeBtn.textContent = "Close";
            dialogue.appendChild(closeBtn);
            closeBtn.addEventListener("click", closeDialogue);
        }
    }

    function closeDialogue() {
        onDisplayEnd();
        dialogueUI.style.display = "none";
        dialogue.innerHTML = "";
    }

    const closeBtn = document.getElementById("close");
    closeBtn.addEventListener("click", closeDialogue);
}

export function setCamScale(k) {
    const resizeFactor = k.width() / k.height();
    if (resizeFactor < 1) {
        k.camScale(k.vec2(1));
        return;
    } 
    k.camScale(k.vec2(1.5))
}