import fastify from "fastify";
import { EletivasRoutes } from "./routes/eletivas";
import { AuthRoutes } from "./routes/auth";
import cors from "@fastify/cors";

const app = fastify();

app.register(cors, {
  origin: "*"
});

app.register(EletivasRoutes, {
  prefix: "/class",
});
app.register(AuthRoutes, {
  prefix: "/auth",
});

app.listen(
  {
    port: 3333,
  },
  () => {
    console.log("Server is running");
  }
);
