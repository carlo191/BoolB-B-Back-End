function errorsHandler(err, req, res, next) {
  res.status(err.code ?? 500);
  res.json({
    status: "KO",
    error: err.message,
  });
}

function notFound(req, res, next) {
  res.status(404);
  res.json({
    error: "Not Found",
    message: "Pagina non trovata",
  });
}

module.exports = { errorsHandler, notFound };
