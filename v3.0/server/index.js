import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";
import { resolve } from "path";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import { database } from "./sqlite/querys.js";
import { typeDefs } from "./graphql/definitions.js";
import { getResolvers } from "./graphql/resolvers.js";
import { initializeDB } from "./sqlite/initialize.js";
import Pokedex from "pokedex-promise-v2";
initializeDB(database, new Pokedex());

const schema = new buildSchema(typeDefs);
const resolvers = getResolvers(database);
export const graphqlServer = graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
});
const app = express();
app.use(cors());
app.use(express.json());
app.use("/graphql", graphqlServer);

app.post("/login", async (req, res) => {
  const p = {
    params: {
      nick: req.body.nick,
      pass: req.body.pass,
    },
  };
  const user = await resolvers.login(p);
  const token = jwt.sign(user, process.env.SECRET_JWT, { expiresIn: "2 days" });
  res.send({ data: token, error: null });
});

app.post("/register", async (req, res) => {
  const p = {
    params: {
      nick: req.body.nick,
      pass: req.body.pass,
    },
  };
  const user = await resolvers.insertUser(p);
  const token = jwt.sign(user, process.env.SECRET_JWT, { expiresIn: "2 days" });
  res.send({ data: token, error: null });
});

app.post("/createUser", async (req, res) => {
  const p = {
    params: {
      nick: req.body.nick,
      pass: req.body.pass,
    },
  };
  const user = await resolvers.insertUser(p);
  res.send(user);
});

app.get("/image/:id", async (req, res) => {
  const path = resolve(`images/imagesPokemon/${req.params.id}.png`);
  res.sendFile(path);
});

app.post("/getPokemonById", async (req, res) => {
  const p = {
    params: {
      id: req.body.id,
    },
  };
  const pokemon = await resolvers.getPokemonById(p);
  res.send(pokemon);
});

app.post("/insertPokemon", async (req, res) => {
  const p = {
    params: {
      user_id: req.body.user_id,
    },
  };
  const pokemon = await resolvers.insertPokemonToUser(p);
  res.send(pokemon);
});

app.post("/getPokemonsBattle", async (req, res) => {
  const p = {
    user_id: req.body.user_id,
  };
  const pokemon = await resolvers.getPokemonsFromUserBattle(p);
  res.send(pokemon);
});

app.post("/getPokemonsInventory", async (req, res) => {
  const p = {
    user_id: req.body.user_id,
  };
  const pokemon = await resolvers.getAllPokemonsFromInventory(p);
  res.send(pokemon);
});

app.get("/getRandomEnemies", async (_, res) => {
  console.log(1);
  const pokemons = await resolvers.getRandomEnemies();
  res.send(pokemons);
});

app.post("/updateLevelsAndPlays", async (req, res) => {
  const p = {
    params: {
      user_id: req.body.user_id,
    },
  };
  const thereAreEvolutions = await resolvers.updatePlays(p);
  res.send(thereAreEvolutions);
});

app.post("/swapPokemons", async (req, res) => {
  const p = {
    params: {
      user_id: req.body.user_id,
      inventory: req.body.inventory,
      battle: req.body.battle,
    },
  };
  const goodSwap = await resolvers.swapPokemons(p);
  res.send(goodSwap);
});

app.listen(8080, () => {
  console.log("Listening 8080");
});
