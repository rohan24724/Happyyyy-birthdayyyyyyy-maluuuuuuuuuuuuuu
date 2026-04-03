const pages = document.querySelectorAll(".page");

function nextPage() {
    const current = document.querySelector(".page.active");
    const next = current.nextElementSibling;
    if (next) {
        current.classList.remove("active");
        next.classList.add("active");

        if (next.id === "page-memories") {
            loadMemories();
            next.scrollTop = 0;
            next.style.overflowY = "auto";
        }
        if (next.id === "page-letter") startLetter();
        if (next.id === "page-finale") startFinale();
    }
}

function startRain() {
    const canvas = document.getElementById("rain-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = ["✦", "♡", "✧", "𖦹", "⟡", "★", "❀"];
    const fontSize = 22;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(201, 168, 124, 0.75)";
        ctx.font = fontSize + "px Jost";

        drops.forEach((y, i) => {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, y * fontSize);
            if (y * fontSize > canvas.height && Math.random() > 0.95) {
                drops[i] = 0;
            }
            drops[i]++;
        });
    }

    setInterval(draw, 125);
}

function startIntro() {
    startRain();

    const name = document.getElementById("main-name");
    name.textContent = "";
    const subtitle = document.getElementById("subtitle");
    const hint = document.getElementById("tap-hint");

    // Type her name letter by letter
    const fullName = "Maluuuuuu";
    let i = 0;
    name.style.opacity = 1;

    setTimeout(() => {
        const typing = setInterval(() => {
            name.textContent += fullName[i];
            i++;
            if (i === fullName.length) {
                clearInterval(typing);

                // After name is done, fade in subtitle
                setTimeout(() => {
                    subtitle.classList.add("fade-up");
                    subtitle.style.opacity = 1;
                }, 500);

                // Then fade in tap hint
                setTimeout(() => {
                    hint.style.opacity = 0.5;
                }, 1500);
            }
        }, 175);
    }, 4250);
}

let playerName = "";

document.getElementById("answer-btn").addEventListener("click", function () {
    playerName = document.getElementById("answer-input").value.trim();
    nextPage();
});

function loadMemories() {
    const cards = document.querySelectorAll(".memory-card");
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("visible");
        }, index * 200);
    });

    document
        .getElementById("memories-scroll")
        .addEventListener("scroll", function () {
            const el = this;
            const atBottom =
                el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
            if (atBottom) {
                document
                    .getElementById("memories-next")
                    .classList.add("visible");
            }
        });
}

function startLetter() {
    const envelope = document.getElementById("envelope-wrap");

    envelope.addEventListener("click", function () {
        openEnvelope();
    });
}

function openEnvelope() {
    const flap = document.getElementById("env-flap");
    const wrap = document.getElementById("envelope-wrap");
    const hint = document.getElementById("env-hint");
    const letter = document.getElementById("letter");

    hint.style.opacity = "0";
    flap.classList.add("open");

    setTimeout(() => {
        letter.classList.add("slide-up");
    }, 1000);

    setTimeout(() => {
        wrap.style.opacity = "0";
        wrap.style.transition = "opacity 0.6s ease";
    }, 1800);

    setTimeout(() => {
        wrap.style.display = "none";
        document.body.appendChild(letter);
        letter.classList.remove("slide-up");
        letter.classList.add("expand");

        letter.innerHTML = `
      <div style="margin: 0 auto; width:100%; padding-bottom: 80px;">
        <div id="letter-text"></div>
        <div id="letter-signature"></div>
      </div>
    `;

        const letterText = document.getElementById("letter-text");
        const signature = document.getElementById("letter-signature");
        typeMessage(letterText, signature);
    }, 2600);
}

function typeMessage(el, signatureEl) {
    const message =
        "It's actually funny how you just.. stayed. There was no big reason, no special moment, just random convo that somehow didn't stop. Now it's just normal — arguing over nothing, disappearing and coming back, and still ending up back in the same place like none of it mattered. And even with all the chaos you became the only person I don't have to think twice about. I don't really know what to call this, and I don't think I need to. Just keep being the same, it works. Maybe sometime later things won't be this simple. We'll get busy, reply late, or not talk like we do now. But I think even then, it'll just take one random message to fall back into the same pattern like nothing really changed. You'll still overthink small things, still act like you have everything figured out, and I'll probably still disagree with you for no reason. So yeah, I'm not too worried about what happens next — it'll work out in its own weird way.";

    const textNode = document.createTextNode("");
    el.appendChild(textNode);
    let i = 0;

    const typing = setInterval(() => {
        if (i >= message.length) {
            clearInterval(typing);
            setTimeout(() => {
                signatureEl.textContent = "~ " + playerName;
                signatureEl.style.cssText = `
          font-family: 'Caveat', cursive;
          font-size: 20px;
          color: #c9a87c;
          text-align: right;
          margin-top: 24px;
          display: block;
          animation: none;
          transition: none;
        `;
                const btn = document.createElement("p");
                btn.textContent = "continue…";
                btn.style.cssText = `
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          letter-spacing: 4px;
          color: #0145f2;
          text-align: center;
          margin-top: 40px;
        `;
                btn.onclick = function () {
                    document.body.removeChild(
                        document.getElementById("letter")
                    );
                    document
                        .getElementById("page-finale")
                        .classList.add("active");
                    startFinale();
                };
                el.parentElement.appendChild(btn);
            }, 750);
            return;
        }
        textNode.textContent += message[i];
        i++;
    }, 30);
}

function startFinale() {
    const title = document.getElementById("finale-title");
    const subtitle = document.getElementById("finale-subtitle");
    const signature = document.getElementById("finale-signature");
    const canvas = document.getElementById("confetti-canvas");

    startStars();

    // Fade in title
    setTimeout(() => {
        title.style.transition = "opacity 1.5s ease";
        title.style.opacity = "1";
    }, 300);

    // Fade in subtitle
    setTimeout(() => {
        subtitle.style.transition = "opacity 1.5s ease";
        subtitle.style.opacity = "1";
    }, 1200);

    // Fade in signature
    setTimeout(() => {
        signature.style.transition = "opacity 1.5s ease";
        signature.style.opacity = "1";
    }, 2000);

    // Confetti
    const confettiInstance = confetti.create(canvas, { resize: true });
    setTimeout(() => {
        confettiInstance({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.5 },
            colors: ["#c9a87c", "#f0ece4", "#a89f94", "#ffffff"]
        });
    }, 750);
}

function startBtnMesh() {
    const canvas = document.getElementById("btn-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const blobs = [
        { x: 0.2, y: 0.5, r: 0.6, color: "#ff4500", vx: 0.003, vy: 0.002 },
        { x: 0.7, y: 0.3, r: 0.5, color: "#ffa500", vx: -0.002, vy: 0.003 },
        { x: 0.5, y: 0.8, r: 0.5, color: "#ffd700", vx: 0.002, vy: -0.002 },
        { x: 0.8, y: 0.7, r: 0.4, color: "#c9a87c", vx: -0.003, vy: -0.002 }
    ];

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = "blur(18px)";

        blobs.forEach(b => {
            b.x += b.vx;
            b.y += b.vy;
            if (b.x < 0 || b.x > 1) b.vx *= -1;
            if (b.y < 0 || b.y > 1) b.vy *= -1;

            const grd = ctx.createRadialGradient(
                b.x * canvas.width,
                b.y * canvas.height,
                0,
                b.x * canvas.width,
                b.y * canvas.height,
                b.r * canvas.width
            );
            grd.addColorStop(0, b.color);
            grd.addColorStop(1, "transparent");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        ctx.filter = "none";
        requestAnimationFrame(draw);
    }

    draw();
}

startBtnMesh();

document.getElementById("start-btn").addEventListener("click", function () {
    const music = document.getElementById("yt-music");
    music.src = music.src;
    nextPage();
    startIntro();
});

document.getElementById("page-memories").addEventListener(
    "touchmove",
    function (e) {
        e.stopPropagation();
    },
    { passive: true }
);

function startStars() {
    const canvas = document.getElementById("stars-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.alpha += s.speed;
            if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 168, 124, ${s.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
                                           }
