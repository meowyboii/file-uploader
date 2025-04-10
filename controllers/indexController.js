const getIndex = (req, res, next) => {
  res.status(200).render("index");
};

module.exports = { getIndex };
