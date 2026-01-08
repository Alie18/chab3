class TestManager {
    constructor() {
        this.currentTest = null;
        this.userAnswers = [];
    }

    startTest(testId) {
        this.currentTest = testId;
        this.userAnswers = [];
    }

    selectAnswer(questionIndex, answerIndex) {
        this.userAnswers[questionIndex] = answerIndex;
        
        // Визуальная обратная связь
        const options = document.querySelectorAll(`input[name="q${questionIndex}"]`);
        options.forEach((opt, i) => {
            const label = opt.closest('label');
            if (label) {
                label.classList.remove('selected');
                if (i === answerIndex) {
                    label.classList.add('selected');
                }
            }
        });
    }

    calculateScore(testData) {
        if (!testData || !testData.questions) return 0;
        
        let correct = 0;
        testData.questions.forEach((q, i) => {
            if (this.userAnswers[i] === q.correct) {
                correct++;
            }
        });
        
        return Math.round((correct / testData.questions.length) * 100);
    }

    showResults(testData, score) {
        const correctCount = testData.questions.filter((q, i) => 
            this.userAnswers[i] === q.correct
        ).length;
        
        return {
            score,
            correct: correctCount,
            total: testData.questions.length,
            percentage: score
        };
    }
}

// Экспорт
window.TestManager = TestManager;