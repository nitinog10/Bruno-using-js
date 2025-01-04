document.addEventListener("DOMContentLoaded", () => {
    const outputDiv = document.getElementById("output");
    const siriCircle = document.getElementById("siriCircle");

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        outputDiv.textContent = text;
    }

    async function fetchWikipedia(query) {
        try {
            const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                return data.extract || "No relevant information found.";
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching Wikipedia data:", error);
            return null;
        }
    }

    async function handleQuery(query) {
        query = query.toLowerCase();

        if (query.includes("good morning")) {
            speak("Good Morning! How can I assist you today?");
        } else if (query.includes("good afternoon")) {
            speak("Good Afternoon! How can I assist you today?");
        } else if (query.includes("good evening")) {
            speak("Good Evening! How can I assist you today?");
        } else if (query.includes("open youtube")) {
            speak("Opening YouTube.");
            window.open("https://www.youtube.com", "_blank");
        } else if (query.includes("what is the time")) {
            const currentTime = new Date().toLocaleTimeString();
            speak(`The time is ${currentTime}`);
        } else if (query.includes("what is the date")) {
            const currentDate = new Date().toLocaleDateString();
            speak(`Today's date is ${currentDate}`);
        } else if (query.includes("play music")) {
            playMusic();
        } else if (query.includes("notepad")) {
            openNotepad();
        } else if (query.includes("calculator")) {
            openCalculator();
        } else if (query.includes("weather")) {
            speak("Opening weather information.");
            window.open("https://www.weather.com", "_blank");
        } else if (query.includes("according to sources")) {
            const searchQuery = query.replace("according to sources", "").trim();
            if (searchQuery) {
                speak(`Searching Wikipedia for ${searchQuery}`);
                const response = await fetchWikipedia(searchQuery);
                if (response) {
                    speak(response);
                } else {
                    speak("Sorry, I couldn't find information on that topic.");
                }
            } else {
                speak("Please specify a topic to search in Wikipedia.");
            }
        } else {
            speak("Searching Google for your query.");
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
        }
    }

    function openNotepad() {
        const notepadWindow = window.open("", "_blank", "width=400,height=400");
        notepadWindow.document.write(`
            <html>
            <head>
                <title>Notepad</title>
            </head>
            <body>
                <textarea style="width:100%;height:90%;"></textarea>
                <button onclick="window.close()">Close Notepad</button>
            </body>
            </html>
        `);
        speak("Notepad opened. You can type your notes.");
    }

    function openCalculator() {
        const calculatorWindow = window.open("", "_blank", "width=300,height=400");
        calculatorWindow.document.write(`
            <html>
            <head>
                <title>Calculator</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .calculator { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
                    button { padding: 15px; font-size: 18px; }
                    input { grid-column: span 4; padding: 10px; font-size: 18px; text-align: right; }
                </style>
            </head>
            <body>
                <input id="calc-display" type="text" disabled />
                <div class="calculator">
                    ${[...Array(10).keys()].map(num => `<button>${num}</button>`).join('')}
                    <button>+</button>
                    <button>-</button>
                    <button>*</button>
                    <button>/</button>
                    <button>=</button>
                    <button>C</button>
                </div>
                <script>
                    const display = document.getElementById('calc-display');
                    const buttons = document.querySelectorAll('button');
                    let expression = '';
                    buttons.forEach(button => {
                        button.addEventListener('click', () => {
                            const value = button.textContent;
                            if (value === 'C') {
                                expression = '';
                                display.value = '';
                            } else if (value === '=') {
                                try {
                                    display.value = eval(expression);
                                } catch {
                                    display.value = 'Error';
                                }
                            } else {
                                expression += value;
                                display.value = expression;
                            }
                        });
                    });
                </script>
            </body>
            </html>
        `);
        speak("Calculator opened.");
    }

    function playMusic() {
        const musicFile = "bye bye.mp3";
        const audio = new Audio(musicFile);
        audio.play();
        speak("Playing music.");
    }

    siriCircle.addEventListener("click", () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.start();

        recognition.onresult = async (event) => {
            const query = event.results[0][0].transcript;
            outputDiv.textContent = `You said: "${query}"`;
            await handleQuery(query);
        };

        recognition.onerror = () => {
            speak("Sorry, I couldn't hear you. Please try again.");
        };
    });
});
