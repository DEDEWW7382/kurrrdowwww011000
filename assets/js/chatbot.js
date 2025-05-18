// chatbot.js
(function() {
  // Ajout du CSS du widget
  const style = document.createElement('style');
  style.innerHTML = `
  .chatbot-fab {
    position: fixed; bottom: 28px; right: 28px; z-index: 9999;
    width: 62px; height: 62px; border-radius: 50%; background: #b8001c;
    box-shadow: 0 4px 16px #0003; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s;
  }
  .chatbot-fab:hover { background: #eebc1d; }
  .chatbot-fab svg { width: 36px; height: 36px; fill: #fff; }
  .chatbot-fab.open svg { fill: #b8001c; }
  .chatbot-widget {
    position: fixed; bottom: 100px; right: 32px; z-index: 9999;
    width: 370px; max-width: 98vw; background: #fff;
    border-radius: 18px; box-shadow: 0 8px 32px #0004;
    display: none; flex-direction: column;
    font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
    overflow: hidden;
  }
  .chatbot-widget.open { display: flex; }
  .chatbot-header {
    background: #b8001c; color: #fff; padding: 14px 18px; font-size: 1.13em;
    display: flex; align-items: center; justify-content: space-between;
  }
  .chatbot-close { background: none; border: none; color: #fff; font-size: 1.5em; cursor: pointer; }
  .chatbot-messages {
    flex: 1; padding: 18px 18px 10px 18px; overflow-y: auto; background: #f8fbff;
    min-height: 120px; max-height: 340px;
  }
  .chatbot-message { display: flex; align-items: flex-end; margin: 10px 0; }
  .chatbot-message.bot { justify-content: flex-start; }
  .chatbot-message .avatar {
    width: 32px; height: 32px; border-radius: 50%; background: #b8001c; color: #eebc1d;
    display: flex; align-items: center; justify-content: center; font-size: 1.3em; font-weight: bold; margin-right: 8px;
  }
  .chatbot-message .bubble {
    background: #f0f4fa; color: #222; border-radius: 14px; padding: 10px 15px; font-size: 1.04em; box-shadow: 0 1px 4px #0001; max-width: 80%; word-break: break-word;
  }
  .chatbot-form { display: flex; align-items: flex-end; gap: 8px; padding: 10px 18px 14px 18px; }
  .chatbot-form textarea {
    width: 100%; min-height: 32px; max-height: 80px; resize: none; padding: 8px; border-radius: 8px; border: 1px solid #ccc; font-size: 1em;
  }
  .chatbot-form button {
    background: #b8001c; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 1em; font-weight: bold; cursor: pointer;
  }
  .chatbot-copy-btn {
    display: none;
  }
  `;
  document.head.appendChild(style);

  // Ajout du bouton flottant
  const fab = document.createElement('div');
  fab.className = 'chatbot-fab';
  fab.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3C6.48 3 2 6.92 2 12c0 2.08.8 3.97 2.13 5.47L2 21l3.66-1.04C7.7 20.63 9.78 21 12 21c5.52 0 10-3.92 10-9s-4.48-9-10-9z"></path></svg>';
  document.body.appendChild(fab);

  // Ajout du widget chat
  const widget = document.createElement('div');
  widget.className = 'chatbot-widget';
  widget.innerHTML = `
    <div class="chatbot-header">
      <span>Assistant IA kurde</span>
      <button class="chatbot-close" title="Fermer">×</button>
    </div>
    <div class="chatbot-messages" id="chatbotMessages"></div>
    <form class="chatbot-form" autocomplete="off">
      <textarea id="chatbotInput" rows="1" placeholder="Votre question..." required></textarea>
      <button type="submit">Envoyer</button>
    </form>
  `;
  document.body.appendChild(widget);

  // Ouverture/fermeture
  fab.onclick = function() {
    widget.classList.toggle('open');
    fab.classList.toggle('open');
    if (widget.classList.contains('open')) setTimeout(()=>input.focus(), 200);
  };
  widget.querySelector('.chatbot-close').onclick = function() {
    widget.classList.remove('open');
    fab.classList.remove('open');
  };

  // Fonctions chat IA (Gemini, intentions, etc.)
  const messages = widget.querySelector('#chatbotMessages');
  const form = widget.querySelector('form');
  const input = widget.querySelector('#chatbotInput');

  // Suggestions dynamiques
  const suggestions = [
    "Comment dit-on 'paix' en kurde ?",
    "Qui était Saladin ?",
    "Quels sont les cas grammaticaux en kurmanji ?",
    "Qu'est-ce que le Newroz ?",
    "Quelle est la différence entre kurmanji et zazaki ?",
    "Quels sont les groupes kurdes historiques ?",
    "Peux-tu me donner un exemple de dialogue en kurde ?",
    "Quels sont les alphabets utilisés par les Kurdes ?"
  ];

  function detectIntent(input) {
    const txt = input.toLowerCase();
    if (["salut", "bonjour", "coucou", "bonsoir", "hello", "salam", "slm", "hey", "yo"].some(s => txt.includes(s))) return 'greeting';
    if (["merci", "thanks", "shukran", "spas", "thank you"].some(s => txt.includes(s))) return 'thanks';
    if (["ça va", "ca va", "tu vas bien", "comment tu vas", "comment vas-tu", "comment allez-vous"].some(s => txt.includes(s))) return 'howareyou';
    if (["tu es qui", "t'es qui", "qui es-tu", "qui es tu", "qui êtes-vous", "t'es quoi", "c'est quoi toi", "t'es une ia", "es-tu humain", "es-tu une ia", "es-tu un robot"].some(s => txt.includes(s))) return 'whoareyou';
    // Créateur IA
    if (["qui est ton créateur", "qui t'a créé", "qui t'as créé", "qui t'a cree", "qui t'as cree", "qui t'a fait", "qui t'as fait"].some(s => txt.includes(s))) return 'creator';
    if (!txt.match(/kurde|kurdes|kurmanji|zazaki|sorani|gorani|apo|ocalan|saladin|peshmerga|ypg|ypj|kdp|puk|newroz|langue|alphabet|histoire|culture|drapeau|groupe|mot|vocabulaire|grammaire|exemple|dialogue|kurdistan/)) return 'offtopic';
    return 'kurde';
  }

  function customReply(intent, input) {
    if (intent === 'creator') return "Dersim";
    if (intent === 'greeting') return "👋 Bonjour ! Je suis ravi de discuter avec vous. Posez-moi vos questions sur les Kurdes, leur histoire, leur culture ou tout autre sujet lié au Kurdistan !";
    if (intent === 'thanks') return "Avec plaisir ! N'hésitez pas si vous avez d'autres questions sur les Kurdes ou leur culture.";
    if (intent === 'howareyou') return "Merci, je vais très bien ! Et vous ? Je suis là pour vous aider à découvrir le peuple kurde, sa langue et son histoire.";
    if (intent === 'whoareyou') return "Je suis une intelligence artificielle spécialisée sur les Kurdes, leur histoire, leur culture et leurs langues. Posez-moi toutes vos questions !";
    if (intent === 'offtopic') return "Je suis spécialisé sur les Kurdes, leur histoire, leur culture et leurs langues. Voici quelques exemples de questions que vous pouvez poser :<br><i>" + suggestions.slice(0,3).join('<br>') + "</i>";
    return null;
  }

  function addMessage(text) {
    const div = document.createElement('div');
    div.className = 'chatbot-message bot';
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = '🤖';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>');
    div.appendChild(avatar);
    div.appendChild(bubble);
    messages.appendChild(div);
    // Scroller pour voir le début du nouveau message IA
    div.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Animation typing
  let typingDiv = null;
  function showTyping() {
    typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot';
    typingDiv.innerHTML = '<div class="avatar">🤖</div><div class="bubble"><span id="typingAnim">⏳</span></div>';
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
    let dots = 0;
    typingDiv.interval = setInterval(() => {
      document.getElementById('typingAnim').textContent = '⏳' + '.'.repeat(dots);
      dots = (dots + 1) % 4;
    }, 350);
  }
  function stopTyping() {
    if (typingDiv && typingDiv.interval) clearInterval(typingDiv.interval);
    if (typingDiv) typingDiv.remove();
    typingDiv = null;
  }

  // Message d'accueil
  function accueil() {
    addMessage("👋 Bonjour et bienvenue sur l'assistant IA kurde !<br>Je peux répondre à toutes vos questions sur l'histoire, la culture, la langue kurde (kurmanji, zazaki, etc.), les groupes, les fêtes, la grammaire, et bien plus encore.<br><br><b>Exemple de questions :</b><br><i>" + suggestions.slice(0,3).join('<br>') + "</i>");
  }
  accueil();

  // Prompt IA contextuel
  function getPrompt(question, intent) {
    if (intent === 'offtopic') {
      return `Tu es un assistant expert sur les Kurdes. Si la question n'est pas sur ce sujet, explique-le gentiment et propose des exemples de questions pertinentes. Question : ${question}\nRéponse :`;
    }
    return `Réponds en français, de façon claire, pédagogique et détaillée, à la question suivante sur les Kurdes, leur histoire, leur culture ou leur langue. Si on te demande une traduction, donne la traduction demandée. Question : ${question}\nRéponse :`;
  }

  // Appel Gemini (modèle flash)
  async function geminiResponse(prompt) {
    const geminiKey = "AIzaSyBURExYvyAJ1LRolLKLKKTv299x_QMhN6E";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
    const body = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      let text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text || text.trim() === "") {
        if (json?.error?.message) return `❌ Erreur Gemini : ${json.error.message}`;
        return "❌ L'IA n'a pas pu générer de réponse. Réessaie ou reformule ta question.";
      }
      return text.trim();
    } catch (e) {
      return "❌ Erreur lors de la connexion à l'API Gemini.";
    }
  }

  // Gestion de l'envoi
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    showTyping();
    const intent = detectIntent(val);
    const custom = customReply(intent, val);
    if (custom) {
      setTimeout(() => {
        stopTyping();
        addMessage(custom);
      }, 600 + Math.random()*600);
      return;
    }
    let answer = '';
    try {
      answer = await geminiResponse(getPrompt(val, intent));
      stopTyping();
      if (!answer) answer = "(Pas de réponse)";
      addMessage(answer);
    } catch (err) {
      stopTyping();
      addMessage("❌ Erreur lors de la génération de la réponse.");
    }
  });

  // Envoi avec Entrée (sauf Maj+Entrée pour aller à la ligne)
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
})(); 