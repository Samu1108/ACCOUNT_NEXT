const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2999;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔌 Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connesso a MongoDB Atlas'))
  .catch((err) => console.error('❌ Errore connessione MongoDB:', err));

// 🧾 Schema della transazione
const transazioneSchema = new mongoose.Schema({
  descrizione: String,
  importo: Number,
  tipo: String,
  data: String
});

const Transazione = mongoose.model('Transazione', transazioneSchema);

// 📥 GET - Recupera tutte le transazioni
app.get('/api/transazioni', async (req, res) => {
  try {
    const transazioni = await Transazione.find().sort({ data: -1 });
    res.json(transazioni);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero delle transazioni' });
  }
});

// 📤 POST - Aggiunge una nuova transazione
app.post('/api/transazioni', async (req, res) => {
  const { descrizione, importo, tipo, data } = req.body;

  if (!descrizione || typeof importo !== 'number' || !tipo || !data) {
    return res.status(400).json({ error: 'Dati transazione invalidi' });
  }

  try {
    const nuova = new Transazione({ descrizione, importo, tipo, data });
    await nuova.save();
    const tutte = await Transazione.find().sort({ data: -1 });
    res.json(tutte);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel salvataggio della transazione' });
  }
});

// 🚀 Avvio server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
