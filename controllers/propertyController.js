const connection = require("./../data/db");

function index(req, res) {
  const sql = "SELECT * FROM immobile";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });

    const immobili = results.map((immobile) => ({
      ...immobile,
      immagine: `${process.env.HOST_DOMAIN}:${process.env.HOST_PORT}/img/${immobile.immagine}`,
    }));

    res.json(immobili);
  });
}

function show(req, res) {
  const { id } = req.params;

  const sql = "SELECT * FROM immobile WHERE id = ?";

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length === 0)
      return res.status(404).json({ error: "Immobile not found" });

    const immobile = {
      ...results[0],
      immagine: `${process.env.HOST_DOMAIN}:${process.env.HOST_PORT}/img/${results[0].immagine}`,
    };

    res.json(immobile);
  });
}

function store(req, res) {
  const {
    nome,
    numero_stanze,
    numero_letti,
    numero_bagni,
    metri_quadrati,
    indirizzo,
    email_proprietario,
    immagine,
    tipologia,
    numero_like,
    id_proprietario,
  } = req.body;

  const sql = `INSERT INTO immobile (nome, numero_stanze, numero_letti, numero_bagni, metri_quadrati, indirizzo, email_proprietario, immagine, tipologia, numero_like, id_proprietario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  connection.query(
    sql,
    [
      nome,
      numero_stanze,
      numero_letti,
      numero_bagni,
      metri_quadrati,
      indirizzo,
      email_proprietario,
      immagine,
      tipologia,
      numero_like,
      id_proprietario,
    ],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Database query failed", err: err.sqlMessage });

      res.json(results);
    }
  );
}

function destroy(req, res) {
  const { id } = req.params;

  const sql = "DELETE FROM immobile WHERE id = ?";

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length === 0)
      return res.status(404).json({ error: "Immobile not found" });

    res.json("eliminato");
  });
}

function update(req, res) {
  const { id } = req.params;
  const {
    nome,
    numero_stanze,
    numero_letti,
    numero_bagni,
    metri_quadrati,
    indirizzo,
    email_proprietario,
    immagine,
    tipologia,
    numero_like,
    id_proprietario,
  } = req.body;

  const sql = `UPDATE immobile SET nome = ?, numero_stanze = ?, numero_letti = ?, numero_bagni = ?, metri_quadrati = ?, indirizzo = ?, email_proprietario = ?, immagine = ?, tipologia = ?, numero_like = ?, id_proprietario = ? WHERE id = ${id}`;

  connection.query(
    sql,
    [
      nome,
      numero_stanze,
      numero_letti,
      numero_bagni,
      metri_quadrati,
      indirizzo,
      email_proprietario,
      immagine,
      tipologia,
      numero_like,
      id_proprietario,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database query failed" });
      if (results.length === 0)
        return res.status(404).json({ error: "Immobile not found" });

      res.json("modificato");
    }
  );
}

module.exports = { index, show, store, destroy, update };
