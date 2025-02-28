import express from "express";
import { ApolloServer } from "@apollo/server"; // Apollo v4
import { expressMiddleware } from "@apollo/server/express4";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import { gql } from "graphql-tag";

const app = express();
const PORT = process.env.PORT || 4000; // ✅ Use dynamic port

app.use(cors());
app.use(bodyParser.json()); // ✅ Parse JSON requests

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb+srv://mansibhegade123:Mansi9205@cluster0.si6nr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Define Mongoose Schemas
const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
});

const ScoreSchema = new mongoose.Schema({
  name: String,
  score: Number,
});

const Question = mongoose.model("Question", QuestionSchema);
const Score = mongoose.model("Score", ScoreSchema);

// ✅ GraphQL Type Definitions
const typeDefs = gql`
  type Question {
    _id: ID!
    question: String!
    options: [String!]!
    answer: String!
  }

  type Score {
    _id: ID!
    name: String!
    score: Int!
  }

  type Query {
    getQuestions: [Question]
    getLeaderboard: [Score]
  }

  type Mutation {
    submitScore(name: String!, score: Int!): Score
  }
`;

// ✅ GraphQL Resolvers
const resolvers = {
  Query: {
    getQuestions: async () => await Question.find(),
    getLeaderboard: async () => await Score.find().sort({ score: -1 }).limit(10),
  },
  Mutation: {
    submitScore: async (_, { name, score }) => {
      const newScore = new Score({ name, score });
      await newScore.save();
      return newScore;
    },
  },
};

// ✅ Apollo Server Setup
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use("/graphql", express.json(), expressMiddleware(server));

// ✅ Fix "Cannot GET /" issue
app.get("/", (req, res) => {
  res.send("Quiz Game Backend is running!");
});

// ✅ Start the Express Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
