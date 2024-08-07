import { ReactNode, createContext, useState } from "react";
import { api } from "../lib/axios";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

export interface ClassesContextProps {
  getClassesBySerie: ({ serie }: { serie: string }) => void;
  registerClasses: ({
    matricula,
    classId,
  }: {
    matricula: string;
    classId: string;
  }) => void;
  getRegisteredClass: (classId: string[]) => void;
  exportData: (ano: string, secret: string) => void;
  classes: ClassesProps[];
  turmaCadastrada: ClassesProps[];
  csvData: {
    turma: string;
    alunos: { nome: string; matricula: string }[];
    professor: string;
    quantidade: number;
  }[];
  registerEletiva: ({
    nome,
    professor,
    serie,
    vagas,
    diaDaSemana,
    secret,
  }: {
    nome: string;
    professor: string;
    serie: number;
    vagas: number;
    diaDaSemana: string;
    secret: string;
  }) => void;

  registerEletivaArray: ({
    data,
    secret,
  }: {
    data: ClassesRegisterProps[];
    secret: string;
  }) => void;
  visible: boolean | undefined;
  isLoading: boolean;
}

export interface ClassesProps {
  id: string;
  nome: string;
  professor: string;
  serie: string;
  vagas: number;
  diaDaSemana: "TERCA" | "QUINTA";
  alunos: {
    id: string;
    classesId: string;
    studentId: string;
  }[];
}

export interface ClassesRegisterProps {
  nome: string;
  professor: string;
  serie: string;
  vagas: number;
  diaDaSemana: "TERCA" | "QUINTA";
}

export const ClassesContext = createContext({} as ClassesContextProps);

export function ClassesContextProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<ClassesProps[]>([]);
  const [visible, setVisible] = useState<boolean | undefined>(undefined);
  const [turmaCadastrada, setTurmaCadastrada] = useState<ClassesProps[]>([]);
  const [csvData, setCsvData] = useState<
    {
      turma: string;
      alunos: { nome: string; matricula: string }[];
      professor: string;
      quantidade: number;
    }[]
  >([]);
  async function getClassesBySerie({ serie }: { serie: string }) {
    setClasses([]);
    const { data }: AxiosResponse = await api.get(`/class/${serie}`);
    setClasses(data);
  }

  async function getRegisteredClass(classId: string[]) {
    setTurmaCadastrada([]);
    const ids = classId;

    ids.map(async (id) => {
      const { data } = await api.get(`/class/turma/${id}`);
      setTurmaCadastrada((prev) => [...prev, data]);
    });
  }

  async function registerClasses({
    matricula,
    classId,
  }: {
    matricula: string;
    classId: string;
  }) {
    if (matricula && classId) {
      setIsLoading(true);
      try {
        const { data } = await api.post("/class", {
          matricula,
          classId,
        });
        toast.success(data);
        setTimeout(() => {
          setIsLoading(false);
          location.reload();
        }, 1000);
      } catch (error) {
        if (error && error instanceof AxiosError) {
          toast.error(error.response!.data);
          setTimeout(() => {
            setIsLoading(false);
            location.reload();
          }, 1000);
        }
      }
    }
  }

  async function registerEletiva({
    nome,
    professor,
    serie,
    vagas,
    diaDaSemana,
    secret,
  }: {
    nome: string;
    professor: string;
    serie: number;
    vagas: number;
    diaDaSemana: string;
    secret: string;
  }) {
    const stringSerie = String(serie);
    try {
      const eletiva = await api.post("/eletiva", {
        nome,
        professor,
        serie: stringSerie,
        vagas,
        diaDaSemana,
        secret,
      });

      if (eletiva) {
        return toast.success(eletiva.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          return toast.error(error.response.data.message);
        }
      }
    }
  }

  async function registerEletivaArray({
    data,
    secret,
  }: {
    data: ClassesRegisterProps[];
    secret: string;
  }) {
    setIsLoading(true);
    try {
      const eletiva = await api.post("/eletiva/file", {
        data,
        secret,
      });

      if (eletiva) {
        return  setTimeout(() => {
          setIsLoading(false);
          toast.success(eletiva.data.message);
        }, 1000);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          setIsLoading(false);
          return toast.error(error.response.data.message);
        }
      }
    }
  }

  async function exportData(ano: string, secret: string) {
    setVisible(undefined);
    try {
      const data = await api.post("/export", {
        ano,
        secret,
      });
      setVisible(false);
      setCsvData(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setVisible(true);
        }
      }
    }
  }

  return (
    <ClassesContext.Provider
      value={{
        isLoading,
        csvData,
        visible,
        classes,
        turmaCadastrada,
        registerEletivaArray,
        getClassesBySerie,
        registerEletiva,
        registerClasses,
        getRegisteredClass,
        exportData,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
}
