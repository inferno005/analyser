// static/script.js
document.addEventListener("DOMContentLoaded", function () {

    const analyzeButton = document.getElementById("analyze-button");
    const textInput = document.getElementById("text-input");
    const resultDiv = document.getElementById("result");
    const voiceButton = document.getElementById("voice-button");

    // GSAP Animation for buttons
    gsap.from(".container", {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "power3.out"
    });

    // GSAP Hover effect on buttons
    gsap.to("#analyze-button", {
        scale: 1.1,
        duration: 0.3,
        repeat: -1,
        yoyo: true
    });

    gsap.to("#voice-button", {
        scale: 1.1,
        duration: 0.3,
        repeat: -1,
        yoyo: true
    });

    // Analyze emotion
    analyzeButton.addEventListener("click", function () {
        const text = textInput.value;
        fetch("/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: text }),
        })
        .then(response => response.json())
        .then(data => {
            resultDiv.innerHTML = `<h3>Emotion: ${data[0].label}</h3><p>Confidence: ${data[0].score.toFixed(2)}</p>`;
        });
    });

    // Voice to Text functionality
    voiceButton.addEventListener("click", function () {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.start();

        recognition.onresult = function (event) {
            const spokenText = event.results[0][0].transcript;
            textInput.value = spokenText;
            analyzeButton.click();
        };

        recognition.onerror = function (event) {
            resultDiv.innerHTML = "<p>Error in voice recognition</p>";
        };
    });
});
