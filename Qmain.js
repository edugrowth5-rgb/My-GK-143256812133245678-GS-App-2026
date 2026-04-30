let qFontSize = 18;
const qSynth = window.speechSynthesis;

// --- 1. Speaker Logic (Har question ke liye individual control) ---
function qSpeakTile(qText, aText) {
    qSynth.cancel(); // Purani awaaz band karein

    // User Demand: "Question" aur "Answer" label ke saath bolna
    const cleanText = "Question: " + qText + ". Answer: " + aText;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'hi-IN'; 
    utterance.rate = 0.9;     
    
    qSynth.speak(utterance);
}

function qStop() {
    qSynth.cancel();
}

// --- 2. Google Search & Voice Search Fix ---
function qGoogleSearch() {
    const query = document.getElementById('qSearch').value;
    if (query) {
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
}

function qVoiceSearch() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
        alert("Aapka browser voice search support nahi karta.");
        return;
    }
    const recognition = new Recognition();
    recognition.lang = 'hi-IN';
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('qSearch').value = transcript;
        qGoogleSearch(); 
    };
}

// --- 3. View Controls (Font & Fullscreen Fix) ---
function qFontChange(type) {
    const area = document.getElementById('qDisplayArea');
    qFontSize += (type === 'plus') ? 2 : -2;

    if (qFontSize < 12) qFontSize = 12;
    if (qFontSize > 45) qFontSize = 45;

    area.style.fontSize = qFontSize + 'px';
    
    // Sabhi tiles ke andar ke text ko update karein
    const allP = area.querySelectorAll('p');
    allP.forEach(p => p.style.fontSize = qFontSize + 'px');
}

function qToggleFull() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log("Fullscreen Error: " + err.message);
        });
    } else {
        document.exitFullscreen();
    }
}

function qToggleSidebar() {
    const sb = document.getElementById('qSidebar');
    sb.style.display = (sb.style.display === 'none' || sb.style.display === '') ? 'block' : 'none';
}

// --- 4. Content Loading (Ab Sab Kuch Quiz Style Mein) ---
function qLoadCategory(cat) {
    // Scroll container ko top par le jayein
    const scrollContainer = document.getElementById('qMainScroll');
    if(scrollContainer) scrollContainer.scrollTop = 0;
    
    const area = document.getElementById('qDisplayArea');
    const title = document.getElementById('sessionTitle');
    area.innerHTML = ""; 

    if (cat === 'ca') {
        title.innerText = "📢 Current Affairs (Quiz Style)";
        const caList = qCaData[2026]; 
        caList.forEach((item, index) => {
            createQuizTile(area, `CA Update ${index + 1}`, item.q, item.a, `ca-${index}`);
        });
    } else {
        // Bihar aur GK ke liye bhi Quiz Tile logic
        let data = (cat === 'bihar') ? qBiharData : qGkData;
        title.innerText = (cat === 'bihar') ? "📍 Bihar Special (Quiz Mode)" : "🌍 General Knowledge (Quiz Mode)";

        Object.keys(data).forEach((key, index) => {
            // Yahan data ki 'Key' Sawal hai aur 'Value' Jawab
            createQuizTile(area, `${cat.toUpperCase()} Q-${index + 1}`, key, data[key], `${cat}-${index}`);
        });
    }
}

// Session Quiz Loading
function qLoadSession(num) {
    document.getElementById('qMainScroll').scrollTop = 0;
    const area = document.getElementById('qDisplayArea');
    const title = document.getElementById('sessionTitle');
    
    title.innerText = "📝 Quiz Session " + num;
    area.innerHTML = "";

    const questions = qQuizSessions[num];
    questions.forEach((item, index) => {
        createQuizTile(area, `Question ${index + 1}`, item.q, item.a, `quiz-${index}`);
    });
}

// --- Helper: Uniform Quiz Tile Creator ---
function createQuizTile(target, head, ques, ans, id) {
    const tile = document.createElement('div');
    tile.className = "q-tile";
    tile.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start;">
            <h3 style="color: #3498db;">${head}</h3>
            <button onclick="qSpeakTile('${ques.replace(/'/g, "\\'")}', '${ans.replace(/'/g, "\\'")}')" class="tile-speaker">🔊 Listen</button>
        </div>
        <p style="font-weight: bold;">Question: ${ques}</p>
        <button onclick="qShowAns('${id}')" class="ans-trigger">Check Answer</button>
        <div id="qans-${id}" class="ans-box">Answer: ${ans}</div>
    `;
    target.appendChild(tile);
}

function qShowAns(id) {
    const box = document.getElementById(`qans-${id}`);
    box.style.display = (box.style.display === 'block') ? 'none' : 'block';
}

function qGeneratePDF() { window.print(); }
