const connection = require("./../data/db");

function index(req, res) {
  const sql = `SELECT i.id, i.nome, i.numero_stanze, i.numero_letti, i.numero_bagni, i.metri_quadrati, 
    i.indirizzo, i.email_proprietario, i.immagine, i.numero_like, t.tipologia, t.icona, t.id as id_tipologia
    FROM immobile as i JOIN tipologia as t ON i.id_tipologia = t.id;`;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });

    let immobili = results.map((immobile) => ({
      ...immobile,
      immagine: `${process.env.HOST_DOMAIN}:${process.env.HOST_PORT}/img/${immobile.immagine}`,
    }));

    res.json(immobili);
  });
}

function show(req, res) {
  const { id } = req.params;

  const sql = `SELECT i.id, i.nome, i.numero_stanze, i.numero_letti, i.numero_bagni, i.metri_quadrati, 
    i.indirizzo, i.email_proprietario, i.immagine, i.numero_like, t.tipologia, t.icona, t.id as id_tipologia
    FROM immobile as i JOIN tipologia as t ON i.id_tipologia = t.id
    WHERE i.id = ?`;

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length === 0)
      return res.status(404).json({ error: "Immobile not found" });

    let immobile = {
      ...results[0],
      immagine: `${process.env.HOST_DOMAIN}:${process.env.HOST_PORT}/img/${results[0].immagine}`,
      recensioni: [],
    };

    const sql2 =
      "SELECT recensione.* FROM recensione JOIN immobile ON immobile.id = recensione.id_immobile WHERE immobile.id = ?;";

    connection.query(sql2, [id], (err, results) => {
      if (err) return res.status(500).json({ error: "Database query failed" });
      if (results.length === 0)
        return res.status(404).json({ error: "Immobile not found" });

      immobile.recensioni = results;
      res.json(immobile);
    });
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
    numero_like,
    id_proprietario,
    id_tipologia,
  } = req.body;

  const sql = `INSERT INTO immobile (nome, numero_stanze, numero_letti, numero_bagni, metri_quadrati, indirizzo, email_proprietario, immagine, numero_like, id_proprietario, id_tipologia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  if (!isNaN(nome) || nome.length < 3)
    return res
      .status(500)
      .json("nome must NOT be a number, empty or less than 3");
  if (isNaN(numero_stanze) || numero_stanze < 0)
    return res
      .status(500)
      .json("numero_stanze must be a positive number or empty");
  if (isNaN(numero_letti) || numero_letti <= 0)
    return res
      .status(500)
      .json("numero_stanze must be a number and greater than 0");
  if (isNaN(numero_bagni) || numero_bagni <= 0)
    return res
      .status(500)
      .json("numero_stanze must be a number and greater than 0");
  if (isNaN(metri_quadrati) || metri_quadrati < 0)
    return res
      .status(500)
      .json("metri_quadrati must be a positive number or empty");
  if (!isNaN(indirizzo) || indirizzo.length < 5)
    return res
      .status(500)
      .json("indirizzo must NOT be a number, empty or less than 5");
  if (!isNaN(email_proprietario) || email_proprietario.length < 3)
    return res
      .status(500)
      .json("email_proprietario must NOT be a number, empty or less than 3");
  if (isNaN(numero_like) || numero_like < 0)
    return res.status(500).json("numero_like must be a positive number");
  if (isNaN(id_proprietario) || id_proprietario < 0)
    return res.status(500).json("id_proprietario must be a positive number");
  if (isNaN(id_tipologia) || id_tipologia < 0)
    return res.status(500).json("id_tipologia must be a positive number");

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
      numero_like,
      id_proprietario,
      id_tipologia,
    ],
    (err, results) => {
      if (err)
        return res.status(500).json({
          error: "Database query failed",
          err: err.sqlMessage,
        });

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
    numero_like,
    id_proprietario,
    id_tipologia,
  } = req.body;

  const sql = `UPDATE immobile SET nome = ?, numero_stanze = ?, numero_letti = ?, numero_bagni = ?, metri_quadrati = ?, indirizzo = ?, email_proprietario = ?, immagine = ?, numero_like = ?, id_proprietario = ?, id_tipologia = ? WHERE id = ${id}`;

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
      numero_like,
      id_proprietario,
      id_tipologia,
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
