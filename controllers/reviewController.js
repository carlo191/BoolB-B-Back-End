const connection = require("./../data/db");

function store(req, res) {
  console.log("Dati ricevuti dal frontend:", req.body);
  const { nome_utente, id_immobile, contenuto, voto } = req.body;

  const sql = `INSERT INTO recensione (nome_utente,
    id_immobile,
    contenuto,
    voto) VALUES (?, ?, ?, ?);`;

  if (!isNaN(nome_utente) || contenuto.length < 1)
    return res
      .status(500)
      .json(" nome_utente must NOT be a number, empty or less than 3");
  if (isNaN(id_immobile) || id_immobile < 0)
    return res.status(500).json("id_immobile must be a positive number");
  if (!isNaN(contenuto) || contenuto.length < 1)
    return res
      .status(500)
      .json("contenuto must NOT be a number, empty or less than 3");
  if (isNaN(voto) || voto < 0 || voto > 5)
    return res
      .status(500)
      .json("voto must be a number, greater than 0 and less than 6");

  connection.query(
    sql,
    [nome_utente, id_immobile, contenuto, voto],
    (err, results) => {
      if (err)
        return res.status(500).json({
          error: "Database query failed",
          err: err.sqlMessage,
        });

      res.json("success");
    }
  );
}

function destroy(req, res) {
  const { id } = req.params;

  const sql = "DELETE FROM recensione WHERE id = ?";

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length === 0)
      return res.status(404).json({ error: "Recensione not found" });

    res.json("eliminato");
  });
}

function update(req, res) {
  const { id } = req.params;
  const { nome_utente, id_immobile, contenuto, voto } = req.body;

  const sql = `UPDATE recensione SET nome_utente = ?, id_immobile = ?, contenuto = ?, voto = ? WHERE id = ${id}`;

  if (!isNaN(nome_utente) || contenuto.length < 3)
    return res
      .status(500)
      .json(" nome_utente must NOT be a number, empty or less than 3");
  if (isNaN(id_immobile) || id_immobile < 0)
    return res.status(500).json("numero_stanze must be a positive number");
  if (!isNaN(contenuto) || contenuto.length < 3)
    return res
      .status(500)
      .json("contenuto must NOT be a number, empty or less than 3");
  if (isNaN(voto) || voto <= 0 || voto > 5)
    return res
      .status(500)
      .json("numero_stanze must be a number and greater than 0");

  connection.query(
    sql,
    [nome_utente, id_immobile, contenuto, voto],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database query failed" });
      if (results.length === 0)
        return res.status(404).json({ error: "Recensione not found" });

      res.json("modificato");
    }
  );
}

module.exports = { store, destroy, update };
