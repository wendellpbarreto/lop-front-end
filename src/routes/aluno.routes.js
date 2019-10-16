import exportRoutes from "util/routes/exportRoutes.util";
import HomeAlunoScreen from "screens/sistema/aluno/home.screen";

import HomeListaExercicios from "../screens/sistema/aluno/execicio.screen";

import TurmaAluno from "../screens/sistema/aluno/telaTurmaParticipantes.screen"
import Exercicios from "../screens/sistema/aluno/exercicios.screen";
import Exercicio from "../screens/sistema/aluno/execicio.screen";
import TurmaLista from '../screens/sistema/aluno/telaTurmaListas.screen'
import DashBoardAluno from "../screens/sistema/aluno/telaTurmaDashBoard.screen"
import TurmasAbertasAlunoScreen from "screens/sistema/aluno/turmasAbertas.screen";

const routes = [
  {
    path: "/aluno",
    component: HomeAlunoScreen,
    private: true,
    perfil: 'ALUNO'
  },
  {
    path: "/aluno/exercicio",
    component: HomeListaExercicios,
    private: true,
    perfil: 'ALUNO'
  },
  {
    path: "/aluno/turmasAbertas",
    component: TurmasAbertasAlunoScreen,
    private: true,
    perfil: 'ALUNO'
  },
  {
    path: "/aluno/exercicios/",
    component: Exercicios,
    private: true,
    perfil: 'ALUNO'
  },
  {
    path: "/aluno/turma/:id/listas",
    component: TurmaLista,
    private: true,
    perfil: 'ALUNO'
  },
  
  {
    path: "/aluno/turma/:id/participantes",
    component: TurmaAluno,
    private: true,
    perfil: 'ALUNO'
  },
  {
    path: "/aluno/turma/:id/dashboard",
    component: DashBoardAluno,
    private: true,
    perfil: 'ALUNO'
  },
  {
    path: "/aluno/exercicio/:id",
    component: Exercicio,
    private: true,
    perfil: 'ALUNO'
  }
];

export default exportRoutes(routes);
