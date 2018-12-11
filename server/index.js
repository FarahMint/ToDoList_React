// https://github.com/prisma/graphql-yoga
const { GraphQLServer } = require("graphql-yoga");

// connection to mongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/testdb");

const Todo = mongoose.model("Todo", {
  text: String,
  complete: Boolean
});
// Schema
// != mean mandatory - have to pass in
const typeDefs = `
  type Query {
    hello(name: String): String!
    todos:[Todo]
  }
  type Todo {
    id:ID!
    text: String!
    complete: Boolean!
  }
  type Mutation {
    createTodo(text:String!): Todo
    updateTodo(id:ID!, text:String!, complete:Boolean!): Boolean
    removeTodo(id:ID!): Boolean
    }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    todos: () => Todo.find()
  },
  Mutation: {
    createTodo: async (_, { text }) => {
      //  create an inatance
      const todo = new Todo({ text, complete: false });
      // save it to the db - ( await return a promise)
      await todo.save();
      return todo;
    },
    updateTodo: async (_, { id, text, complete }) => {
      await Todo.findByIdAndUpdate(id, { text, complete });

      return true;
    },
    removeTodo: async (_, { id }) => {
      await Todo.findByIdAndRemove(id);

      return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
// once connect to mDB start  graphql server
mongoose.connection.once("open", () => {
  server.start(() => console.log("Server is running on localhost:4000"));
});

//  first update scheme and then add implementation on how this data is getting fetch
