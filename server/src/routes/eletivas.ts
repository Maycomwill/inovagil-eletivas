import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function EletivasRoutes(app: FastifyInstance) {
  app.get("/:serie", async (req, res) => {
    const paramsSchema = z.object({
      serie: z.string(),
    });
    const { serie } = paramsSchema.parse(req.params);
    const classes = await prisma.classes.findMany({
      where: {
        serie,
      },
    });
    res.status(200).send(classes);
  });

  app.get("/turma/:classId", async (req, res) => {
    const paramsSchema = z.object({
      classId: z.string(),
    });

    const { classId } = paramsSchema.parse(req.params);

    const turma = await prisma.classes.findUnique({
      where: {
        id: classId,
      },
    });

    if (!turma) {
      return res.status(500).send("Id da Turma inválido");
    }
    return res.status(200).send(turma);
  });

  app.post("/", async (req, res) => {
    const bodySchema = z.object({
      matricula: z.string(),
      classId: z.string().cuid(),
    });

    const { matricula, classId } = bodySchema.parse(req.body);
    console.log("matricula", matricula, "classId", classId);

    const user = await prisma.students.findUnique({
      where: {
        matricula,
      },
    });
    const turma = await prisma.classes.findUnique({
      where: {
        id: classId,
      },
    });

    const pivo = await prisma.alunosMatriculados.findMany({
      where: {
        studentId: user.matricula,
      },
    });

    if (user.serie === "2") {
      if (pivo.length === 1) {
        const classFromPivo = await prisma.classes.findUnique({
          where: {
            id: pivo[0].classesId,
          },
        });
        if (pivo[0].classesId === classId) {
          return res.status(500).send("Usuário já cadastrado nessa disciplina");
        } else if (classFromPivo.diaDaSemana === turma.diaDaSemana) {
          if (turma.quantidadeDeAlunos <= 44) {
            await prisma.alunosMatriculados.delete({
              where: {
                id: pivo[0].id,
              },
            });

            await prisma.classes.update({
              where: {
                id: classFromPivo.id,
              },
              data: {
                quantidadeDeAlunos: classFromPivo.quantidadeDeAlunos - 1,
              },
            });

            const novaMatricula = await prisma.alunosMatriculados.create({
              data: {
                classesId: turma.id,
                studentId: user.matricula,
              },
            });

            await prisma.classes.update({
              where: {
                id: turma.id,
              },
              data: {
                quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
              },
            });

            return res
              .status(200)
              .send(`Usuário cadastrado na turma ${novaMatricula}`);
          }
          res.status(500).send("Não há vagas disponíveis");
        }

        const novaMatricula = await prisma.alunosMatriculados.create({
          data: {
            classesId: turma.id,
            studentId: user.matricula,
          },
        });
        await prisma.classes.update({
          where: {
            id: classId,
          },
          data: {
            quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
          },
        });
        console.log("Cadastrou a segunda");
        return res.status(200).send(`Nova matricula em ${novaMatricula.id}`);
      }
      if (pivo.length === 2) {
        if (pivo[0].classesId === turma.id || pivo[1].classesId === turma.id) {
          return res.status(500).send("Usuário já cadastrado nessa disciplina");
        }
        const firstClassFromPivo = await prisma.classes.findUnique({
          where: {
            id: pivo[0].classesId,
          },
        });
        const secondClassFromPivo = await prisma.classes.findUnique({
          where: {
            id: pivo[1].classesId,
          },
        });
        if (firstClassFromPivo.diaDaSemana === turma.diaDaSemana) {
          if (turma.quantidadeDeAlunos <= 44) {
            await prisma.alunosMatriculados.delete({
              where: {
                id: pivo[0].id,
              },
            });

            await prisma.classes.update({
              where: {
                id: firstClassFromPivo.id,
              },
              data: {
                quantidadeDeAlunos: firstClassFromPivo.quantidadeDeAlunos - 1,
              },
            });

            const novaMatricula = await prisma.alunosMatriculados.create({
              data: {
                classesId: turma.id,
                studentId: user.matricula,
              },
            });

            await prisma.classes.update({
              where: {
                id: turma.id,
              },
              data: {
                quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
              },
            });
            return res
              .status(200)
              .send(`Aluno cadastrado na nova turma ${novaMatricula}`);
          }
          res.status(500).send("Não há vagas disponíveis");
        } else if (secondClassFromPivo.diaDaSemana === turma.diaDaSemana) {
          if (turma.quantidadeDeAlunos <= 44) {
            await prisma.alunosMatriculados.delete({
              where: {
                id: pivo[0].id,
              },
            });

            await prisma.classes.update({
              where: {
                id: secondClassFromPivo.id,
              },
              data: {
                quantidadeDeAlunos: secondClassFromPivo.quantidadeDeAlunos - 1,
              },
            });

            const novaMatricula = await prisma.alunosMatriculados.create({
              data: {
                classesId: turma.id,
                studentId: user.matricula,
              },
            });

            await prisma.classes.update({
              where: {
                id: turma.id,
              },
              data: {
                quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
              },
            });
            return res
              .status(200)
              .send(`Aluno cadastrado na nova turma ${novaMatricula}`);
          }
          res.status(500).send("Não há vagas disponíveis");
        }

        await prisma.alunosMatriculados.delete({
          where: {
            id: pivo[0].id,
          },
        });

        await prisma.classes.update({
          where: {
            id: pivo[0].classesId,
          },
          data: {
            quantidadeDeAlunos: firstClassFromPivo.quantidadeDeAlunos - 1,
          },
        });

        const novaMatricula = await prisma.alunosMatriculados.create({
          data: {
            classesId: turma.id,
            studentId: user.matricula,
          },
        });

        await prisma.classes.update({
          where: {
            id: turma.id,
          },
          data: {
            quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
          },
        });
        console.log("Cadastrou a segunda, deletando a primeira");
        return res.status(200).send(`Nova matricula em ${novaMatricula.id}`);
      }
      const novaMatricula = await prisma.alunosMatriculados.create({
        data: {
          classesId: turma.id,
          studentId: user.matricula,
        },
      });
      await prisma.classes.update({
        where: {
          id: classId,
        },
        data: {
          quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
        },
      });
      console.log("Cadastrou a primeira");
      return res.status(200).send(`Nova matricula em ${novaMatricula.id}`);
    }

    if (pivo) {
      if (pivo[0].classesId === turma.id) {
        return res.status(500).send("Usuário já cadastrado na disciplina");
      }

      const classFromPivo = await prisma.classes.findUnique({
        where: {
          id: pivo[0].classesId,
        },
      });

      await prisma.alunosMatriculados.delete({
        where: {
          id: pivo[0].id,
        },
      });

      await prisma.classes.update({
        where: {
          id: classFromPivo.id,
        },
        data: {
          quantidadeDeAlunos: classFromPivo.quantidadeDeAlunos - 1,
        },
      });

      const novaMatricula = await prisma.alunosMatriculados.create({
        data: {
          studentId: user.matricula,
          classesId: classId,
        },
      });

      await prisma.classes.update({
        where: {
          id: classId,
        },
        data: {
          quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
        },
      });

      return res.status(200).send(`usuário cadastrado em: ${novaMatricula}`);
    }

    const novaMatricula = await prisma.alunosMatriculados.create({
      data: {
        studentId: user.matricula,
        classesId: classId,
      },
    });

    await prisma.classes.update({
      where: {
        id: classId,
      },
      data: {
        quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
      },
    });
    console.log("Cadastrou a primeira");

    return res.status(200).send(`usuário cadastrado em: ${novaMatricula}`);
  });
}
