const connection = require("./../data/db");

function index(req, res) {
  const sql = `WITH RankedImmobili AS (
        SELECT i.id, i.nome, i.numero_stanze, i.numero_letti, i.numero_bagni, i.metri_quadrati,  
               i.indirizzo, i.email_proprietario, i.immagine, i.numero_like, i.id_proprietario, 
               t.tipologia, t.id AS id_tipologia,
               ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY i.numero_like DESC) AS ranking
        FROM immobile AS i
        JOIN tipologia AS t ON i.id_tipologia = t.id
    )
    SELECT * FROM RankedImmobili WHERE ranking <= 3;`;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });

    let immobili = results.map((immobile) => ({
      ...immobile,
      immagine: `${process.env.HOST_DOMAIN}:${process.env.HOST_PORT}/img/${immobile.immagine}`,
    }));

    res.json(immobili);
  });
}

module.exports = { index };
