import { ReactNode, createContext, useState } from "react";
import { api } from "../lib/axios";
import { AxiosResponse } from "axios";

export interface ClassesContextProps {
  getClassesBySerie: ({ serie }: { serie: string }) => void;
  registerClasses: ({
    matricula,
    classId,
  }: {
    matricula: string;
    classId: string;
  }) => void;
  getRegisteredClass: (classId: string | string[]) => void;
  classes: ClassesProps[];
  turmaCadastrada: ClassesProps[];
}

export interface ClassesProps {
  id: string;
  nome: string;
  professor: string;
  serie: string;
  quantidadeDeAlunos: number;
}

export const ClassesContext = createContext({} as ClassesContextProps);

export function ClassesContextProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ClassesProps[]>([]);
  const [turmaCadastrada, setTurmaCadastrada] = useState<ClassesProps[]>([]);
  async function getClassesBySerie({ serie }: { serie: string }) {
    setClasses([]);
    const { data }: AxiosResponse = await api.get(`/class/${serie}`);
    setClasses(data);
  }

  async function getRegisteredClass(classId: string | string[]) {
    const { data } = await api.get(`/class/turma/${classId}`);
    console.log(data)
    setTurmaCadastrada([data]);
  }

  async function registerClasses({
    matricula,
    classId,
  }: {
    matricula: string;
    classId: string;
  }) {
    if (matricula && classId) {
      await api.post("/class", {
        matricula,
        classId,
      });
    }
  }
  return (
    <ClassesContext.Provider
      value={{
        getClassesBySerie,
        registerClasses,
        getRegisteredClass,
        classes,
        turmaCadastrada,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
}
