const express = require('express');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Environment variables
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || 'IGAAOZCvWpXlFFBZAFpnWjdHSjNSWlRDMnFibExaUnRPRG54VVdWbld2U0ZADNV9zSmNxZAGMzbDdWQ24yVmkzYjhCQ1lsSWo4c2ozaGJ2dGhPTDhfUnBXODZAaX1g3VGNpaXBOb0pvMjRlb3VqeUE2NndpdGRFNHFvVGFDTnRWMUpuVQZDZD';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBcpHnBE6W9NMSw8fNNic5ySnjWjjGoABw';
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'medpulse_super_secret_key_2026';

// Simple JSON Database file (encrypted payload)
const DB_FILE = path.join(__dirname, '..', 'data_db.json');

// Helper AES-256-CBC Encryption & Decryption
function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(ENCRYPTION_SECRET, 'salt', 32), Buffer.alloc(16, 0));
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.scryptSync(ENCRYPTION_SECRET, 'salt', 32), Buffer.alloc(16, 0));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return null;
  }
}

// Read & Save DB
function getDB() {
  if (!fs.existsSync(DB_FILE)) {
    return {
      doctorProfile: {
        name: 'Dra. Camila Vasconcelos',
        email: 'dra.camila@clinicavasconcelos.com.br',
        crm: 'CRM/SP 184.920',
        specialty: 'Dermatologia & Estética Avançada',
        location: 'São Paulo - SP',
        avatarUrl: ''
      }
    };
  }
  const fileContent = fs.readFileSync(DB_FILE, 'utf8');
  const decrypted = decrypt(fileContent);
  return decrypted ? JSON.parse(decrypted) : {};
}

function saveDB(data) {
  const encrypted = encrypt(JSON.stringify(data));
  fs.writeFileSync(DB_FILE, encrypted, 'utf8');
}

// API Route 1: Fetch Live Instagram Profile Data
app.get('/api/instagram/profile', (req, res) => {
  const url = `https://graph.instagram.com/me?fields=id,username,account_type,media_count,profile_picture_url&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
  
  https.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const profile = JSON.parse(data);
        if (profile.error) {
          return res.status(400).json({ success: false, error: profile.error });
        }

        // Merge with doctor profile saved in database
        const db = getDB();
        if (profile.profile_picture_url && !db.doctorProfile.avatarUrl) {
          db.doctorProfile.avatarUrl = profile.profile_picture_url;
          saveDB(db);
        }

        res.json({
          success: true,
          instagram: profile,
          doctorProfile: db.doctorProfile
        });
      } catch (e) {
        res.status(500).json({ success: false, error: e.message });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ success: false, error: err.message });
  });
});

// API Route 2: Fetch Live Instagram Posts & Metrics
app.get('/api/instagram/media', (req, res) => {
  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count&access_token=${INSTAGRAM_ACCESS_TOKEN}`;

  https.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const media = JSON.parse(data);
        res.json({ success: true, data: media.data || [] });
      } catch (e) {
        res.status(500).json({ success: false, error: e.message });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ success: false, error: err.message });
  });
});

// API Route 3: Update Doctor Profile (Saved to Encrypted DB)
app.post('/api/doctor/profile', (req, res) => {
  const { name, email, crm, specialty, location, avatarUrl } = req.body;
  const db = getDB();
  db.doctorProfile = {
    ...db.doctorProfile,
    name: name || db.doctorProfile.name,
    email: email || db.doctorProfile.email,
    crm: crm || db.doctorProfile.crm,
    specialty: specialty || db.doctorProfile.specialty,
    location: location || db.doctorProfile.location,
    avatarUrl: avatarUrl || db.doctorProfile.avatarUrl
  };
  saveDB(db);
  res.json({ success: true, doctorProfile: db.doctorProfile });
});

// API Route 4: Generate Medical Post Content via Gemini AI
app.post('/api/ai/generate', (req, res) => {
  const { topic, objective, format, specialty } = req.body;

  const prompt = `Você é um especialista em marketing médico ético conforme as normas da Resolução CFM 2.336/2023.
Gere um plano de conteúdo completo para o Instagram para um profissional da área de ${specialty || 'Dermatologia Estética'}.
Tópico: ${topic || 'Mitos sobre Toxina Botulínica Preventiva'}.
Objetivo: ${objective || 'Autoridade e Educação do Paciente'}.
Formato: ${format || 'Carrossel para o Feed'}.

Retorne ESTRITAMENTE em formato JSON com as seguintes chaves:
{
  "headline": "Título chamativo e ético do post",
  "retentionHook": "Gancho dos primeiros 3 segundos",
  "caption": "Legenda completa formatada com parágrafos e emojis profissionais",
  "cta": "Chamada para ação ética (ex: agende sua avaliação médica)",
  "hashtags": "#especialidade #dermatologia #saude",
  "slides": [
    "Slide 1: Texto resumido do slide",
    "Slide 2: Texto resumido do slide",
    "Slide 3: Texto resumido do slide"
  ],
  "cfmNotes": "Sua publicação está 100% blindada pela Resolução CFM 2.336/2023."
}`;

  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });

  const reqGemini = https.request(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const responseJson = JSON.parse(data);
        const textResult = responseJson.candidates[0].content.parts[0].text;
        const generatedContent = JSON.parse(textResult);
        res.json({ success: true, result: generatedContent });
      } catch (e) {
        res.status(500).json({ success: false, error: 'Falha ao processar resposta da IA: ' + e.message, raw: data });
      }
    });
  });

  reqGemini.on('error', (err) => {
    res.status(500).json({ success: false, error: err.message });
  });

  reqGemini.write(body);
  reqGemini.end();
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Backend MedPulse AI rodando na porta ${PORT}`));
}

module.exports = app;
