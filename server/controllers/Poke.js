const models = require('../models');

const Poke = models.Poke;


const makerPage = (req, res) => {
  Poke.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('pokeApp', { csrfToken: req.csrfToken(), pokes: docs });
  });
};

const makePoke = (req, res) => {
  if (!req.body.name || !req.body.level || !req.body.pokeDexNumber) {
    return res.status(400).json({ error: 'RAWR! Both name and level are required' });
  }

  const pokeData = {
    name: req.body.name,
    level: req.body.level,
    pokeDexNumber: req.body.pokeDexNumber,
    owner: req.session.account._id,
  };

  const newPoke = new Poke.PokeModel(pokeData);

  const pokePromise = newPoke.save();

  pokePromise.then(() => res.json({ redirect: '/pokeMaker' }));

  pokePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Poke already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return pokePromise;
};

const getPokes = (request, response) => {
  const req = request;
  const res = response;
  
  return Poke.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if(err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    
    return res.json({ pokes: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getPokes = getPokes;
module.exports.make = makePoke;
