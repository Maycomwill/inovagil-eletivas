import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "../Input";
import Loading from "../Loading";
import * as Papa from "papaparse";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ClassesRegisterProps } from "../../context/classes";
import { useClasses } from "../../hooks/useClasses";

function FormSubmitClassesList() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | Blob>();
  const [secret, setSecret] = useState("");

  const { registerEletivaArray, isLoading } = useClasses();

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse

    if (e.target !== null && e.target.files !== null && e.target.files) {
      const inputFile = e.target.files[0];

      // If input type is correct set the state
      setFile(inputFile);
    }
  };

  function handleParse(e: FormEvent) {
    e.preventDefault();
    setSecret("");
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      if (target !== null) {
        try {
          handleWithFile(target);
          return setTimeout(() => {}, 2000);
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response) {
              return toast.error(error.response.data);
            }
          }
        }
      }
    };

    function handleWithFile(
      file: FileReader
    ): ClassesRegisterProps[] | undefined {
      if (file.result && typeof file.result === "string") {
        const csv = Papa.parse<ClassesRegisterProps>(file.result, {
          header: true,
          dynamicTyping: true,
        });
        const parsedData = csv.data.map((element) => {
          return {
            nome: String(element.nome),
            professor: element.professor,
            serie: String(element.serie),
            diaDaSemana: element.diaDaSemana,
            vagas: element.vagas,
          };
        });

        registerEletivaArray({ data: parsedData, secret });

        // parsedData.forEach((element: any) => {
        //   setData((prevState) => [...prevState, element]);
        // });
        return csv.data;
      }
    }
    reader.readAsText(file);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={clsx(
          "w-full flex flex-col items-center justify-center bg-slate-800 rounded hover:bg-slate-700 py-2 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 outline-none focus-visible:ring-yellow-400 "
        )}
      >
        <span>Cadastrar eletivas</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60">
          <Dialog.Content className="text-slate-400 bg-slate-700 flex flex-col md:max-w-[640px] w-full fixed md:rounded-md inset-0 md:inset-auto outline-none md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 md:min-h-[60vh] overflow-hidden">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 roudend-md hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>
            {isLoading ? (
              <div className="w-full flex-1 md:flex-auto flex items-center justify-center md:min-h-[60vh]">
                <Loading />
              </div>
            ) : (
              <form
                onSubmit={handleParse}
                className="flex items-center flex-col justify-start text-center h-screen"
              >
                <div className="w-full flex flex-col space-y-4 items-start text-left pt-8 px-2">
                  <Input
                    onChange={changeHandler}
                    label="Importe um arquivo .csv delimitado por virgulas"
                    type="file"
                    min={1}
                    accept=".csv"
                    max={100}
                  />
                  <Input
                    onChange={(e) => setSecret(e.target.value)}
                    value={secret}
                    label="Código admin"
                    type="text"
                    placeholder="Digite o código de administrador"
                  />
                </div>
                <div className="w-full absolute bottom-0">
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 hover:cursor-pointer w-full rounded text-zinc-900 font-bold text-lg py-4 focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Sim
                  </button>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default FormSubmitClassesList;
