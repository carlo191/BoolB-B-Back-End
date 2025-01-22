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

  const sql1 = "SELECT * FROM immobile WHERE id = ?";

  connection.query(sql1, [id], (err, results) => {
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

module.exports = { index, show };
