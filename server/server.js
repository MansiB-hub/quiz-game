import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import cors from "cors";
import { gql } from "graphql-tag";

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/quizDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));

// Define Schema
const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
});

const Question = mongoose.model("Question", QuestionSchema);

// Define GraphQL Schema
const typeDefs = gql`
  type Question {
    id: ID!
    question: String!
    options: [String!]!
    answer: String!
  }

  type Query {
    getQuestions: [Question]
  }
`;

// Define Resolvers
const resolvers = {
  Query: {
    getQuestions: async () => await Question.find(),
  },
};

// Start Apollo Server
const app = express();
app.use(cors());

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
server.applyMiddleware({ app });

app.listen(4000, () =>
  console.log("Server running on http://localhost:4000/graphql")
);
