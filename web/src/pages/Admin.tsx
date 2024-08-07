import { FormEvent, useState } from "react";
import Loading from "../components/Loading";
import { useClasses } from "../hooks/useClasses";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import FormCadastroEletiva from "../components/Dialogs/FormCadastroEletiva";
import FormSubmitStudentsList from "../components/Dialogs/FormSubmitStudentsList";
import FormToTruncateDatabase from "../components/Dialogs/FormToTruncateDatabase";
import FormSubmitClassesList from "../components/Dialogs/FormSubmitClassesList";

function Admin() {
  const [value, setValue] = useState("1");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const { exportData, visible } = useClasses();
  const navigation = useNavigate();

  function handleSubmit(e: FormEvent) {
    setLoading(true);
    e.preventDefault();
    exportData(value, secret);
    setLoading(false);
    if (visible === false) {
      navigation("/admin/data");
    }
  }

  return (
    <div className="w-full bg-slate-900 flex-col flex items-center justify-center flex-1 min-h-screen text-zinc-50 py-4">
      <div className="flex flex-col gap-2 items-center justify-center w-full">
        {!loading ? (
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-800 w-[80%] md:w-1/2 flex items-center justify-center flex-col space-y-8 py-8 rounded px-4"
          >
            <div className="w-full space-y-4 items-center justify-center flex flex-col">
              <span className="font-bold text-xl text-center mb-2">
                Exporte os dados dos alunos cadastrados nas eletivas
              </span>
              <div className="flex flex-col space-y-1 w-full md:px-4">
                <label htmlFor="turma">Selecione um ano</label>
                <select
                defaultValue={"1"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  name="turma"
                  id="turma"
                  className="border-b-2 border-transparent focus-visible:border-[#edf100] outline-none bg-zinc-700/30 px-2 text-zinc-50 py-2 rounded-md optional:bg-zinc-700 sele"
                >
                  <option value="1">1° Ano</option>
                  <option value="2">2° Ano</option>
                  <option value="3">3° Ano</option>
                </select>
              </div>
              <div className="w-full px-0">
                <Input
                  type="text"
                  label="Digite o codigo admin"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full flex-col space-y-4 flex items-center justify-center">
              <button className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 outline-none focus-visible:ring-lime-400">
                Exportar
              </button>
              <div
                className={clsx({
                  hidden: visible === false || visible === undefined,
                  visible: visible === true,
                })}
              >
                <p className="text-red-500 text-sm">Código inválido</p>
              </div>
            </div>
          </form>
        ) : (
          <Loading />
        )}

        <div className="w-1/2 flex flex-col md:grid md:grid-cols-2 items-center justify-center my-4 md:gap-4 md:place-items-center">
          <div className="w-full">
            <FormCadastroEletiva />
          </div>
          <div className="w-full">
            <FormSubmitClassesList />
          </div>
          <div className="w-full">
            <FormSubmitStudentsList />
          </div>
          <div className="w-full">
            <FormToTruncateDatabase />
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <button
            onClick={() => {
              navigation("/");
            }}
            className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 outline-none focus-visible:ring-lime-400"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
