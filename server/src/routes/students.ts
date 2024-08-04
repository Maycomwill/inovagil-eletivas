import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function StudentsRoutes(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const bodySchema = z.object({
      data: z
        .object({
          curso: z.string(),
          dataDeNascimento: z.string(),
          nome: z.string(),
          matricula: z.string(),
          serie: z.string(),
        })
        .array(),
      secret: z.string().min(1, "O código admin deve ser preenchido"),
    });
    try {
      const { data, secret } = bodySchema.parse(req.body);
      if (!data) {
        return res.status(400).send({ message: "Base de dados inválida" });
      }
      if (secret !== process.env.SECRET) {
        return res.status(400).send({
          message: "Código admin inválido",
        });
      }

      const students = await prisma.users.createMany({
        data,
      });

      if (!students) {
        return res.status(400).send({ message: "Base de dados inválida" });
      }
      console.log(students);
      return res
        .status(201)
        .send({ message: "Base de alunos cadastrada com sucesso" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(500).send({
          message: error.message,
          data: error,
        });
      }
    }
  });
}
