import React, { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import Loader from "./components/Loader/Loader";
import AdminLayout from "./layouts/AdminLayout";

import GuestGuard from "./components/Auth/GuestGuard";
import AuthGuard from "./components/Auth/AuthGuard";

import { BASE_URL } from "./config/constant";

import Popupbox from "./views/custom/popupbox";

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes
                    ? renderRoutes(route.routes)
                    : <><Component {...props} />
                      <Popupbox />
                    </>
                  }
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes = [




  //-----------------------------------------------------




  {
    exact: true,
    guard: GuestGuard,
    path: '/auth/signin-1',
    component: lazy(() => import('./views/auth/signin/SignIn1'))
  },


  {
    exact: true,
    guard: GuestGuard,
    path: '/auth/lock',
    component: lazy(() => import('./views/auth/signin/lock'))
  },


  {
    path: '*',
    layout: AdminLayout,
    guard: AuthGuard,
    routes: [



      //--------------------| PAGES

      {
        exact: true,
        path: '/dashboard',
        component: lazy(() => import('./pages/dashboard'))
      },

      {
        exact: true,
        path: '/notificacoes',
        component: lazy(() => import('./pages/notificacoes'))
      },


      //--------------------------------------------------------------

      {
        exact: true,
        path: '/administracao/accoesmenu',
        component: lazy(() => import('./pages/administracao/accoesmenu'))
      },


      {
        exact: true,
        path: '/administracao/menu',
        component: lazy(() => import('./pages/administracao/menu'))
      },


      {
        exact: true,
        path: '/administracao/perfil',
        component: lazy(() => import('./pages/administracao/perfil'))
      },


      {
        exact: true,
        path: '/administracao/utilizador',
        component: lazy(() => import('./pages/administracao/utilizador'))
      },


      {
        exact: true,
        path: '/administracao/permissoes',
        component: lazy(() => import('./pages/administracao/permissoes'))
      },




      //--------------------------------------------------------------


      {
        exact: true,
        path: '/configuracao/categoriaprofissional',
        component: lazy(() => import('./pages/configuracao/categoriaprofissional'))
      },

      {
        exact: true,
        path: '/configuracao/classificacaoequipamento',
        component: lazy(() => import('./pages/configuracao/classificacaoequipamento'))
      },

      {
        exact: true,
        path: '/configuracao/coima',
        component: lazy(() => import('./pages/configuracao/coima'))
      },

      {
        exact: true,
        path: '/configuracao/campos',
        component: lazy(() => import('./pages/configuracao/campos'))
      },
      {
        exact: true,
        path: '/configuracao/estadocivil',
        component: lazy(() => import('./pages/configuracao/estadocivil'))
      },

      {
        exact: true,
        path: '/configuracao/exclusaoperiodo',
        component: lazy(() => import('./pages/configuracao/exclusaoperiodo'))
      },

      {
        exact: true,
        path: '/configuracao/genero',
        component: lazy(() => import('./pages/configuracao/genero'))
      },

      {
        exact: true,
        path: '/configuracao/infracao',
        component: lazy(() => import('./pages/configuracao/infracao'))
      },


      {
        exact: true,
        path: '/configuracao/lingua',
        component: lazy(() => import('./pages/configuracao/lingua'))
      },

      {
        exact: true,
        path: '/configuracao/motivoexclusao',
        component: lazy(() => import('./pages/configuracao/motivoexclusao'))
      },

      {
        exact: true,
        path: '/configuracao/nivellinguistico',
        component: lazy(() => import('./pages/configuracao/nivellinguistico'))
      },

      {
        exact: true,
        path: '/configuracao/nivelescolaridade',
        component: lazy(() => import('./pages/configuracao/nivelescolaridade'))
      },

      {
        exact: true,
        path: '/configuracao/pecasprocessuais',
        component: lazy(() => import('./pages/configuracao/pecasprocessuais'))
      },

      {
        exact: true,
        path: '/configuracao/predefinicoes/tempolimitedecisao',
        component: lazy(() => import('./pages/configuracao/predefinicoes/tempolimitedecisao'))
      },

      {
        exact: true,
        path: '/configuracao/profissao',
        component: lazy(() => import('./pages/configuracao/profissao'))
      },

      {
        exact: true,
        path: '/configuracao/status',
        component: lazy(() => import('./pages/configuracao/status'))
      },

      {
        exact: true,
        path: '/configuracao/tipobanca',
        component: lazy(() => import('./pages/configuracao/tipobanca'))
      },

      {
        exact: true,
        path: '/configuracao/tipocargo',
        component: lazy(() => import('./pages/configuracao/tipocargo'))
      },

      {
        exact: true,
        path: '/configuracao/tipocontacto',
        component: lazy(() => import('./pages/configuracao/tipocontacto'))
      },

      {
        exact: true,
        path: '/configuracao/tipodecisao',
        component: lazy(() => import('./pages/configuracao/tipodecisao'))
      },
      {
        exact: true,
        path: '/configuracao/tipoparecer',
        component: lazy(() => import('./pages/configuracao/tipoparecer'))
      },
      {
        exact: true,
        path: '/configuracao/tipodocumento',
        component: lazy(() => import('./pages/configuracao/tipodocumento'))
      },


      {
        exact: true,
        path: '/configuracao/tipoentidade',
        component: lazy(() => import('./pages/configuracao/tipoentidade'))
      },

      {
        exact: true,
        path: '/configuracao/tipoequipamento',
        component: lazy(() => import('./pages/configuracao/tipoequipamento'))
      },

      {
        exact: true,
        path: '/configuracao/tipoevento',
        component: lazy(() => import('./pages/configuracao/tipoevento'))
      },

      {
        exact: true,
        path: '/configuracao/tipologia',
        component: lazy(() => import('./pages/configuracao/tipologia'))
      },

      {
        exact: true,
        path: '/configuracao/tipomaquina',
        component: lazy(() => import('./pages/configuracao/tipomaquina'))
      },

      {
        exact: true,
        path: '/configuracao/tipoorigem',
        component: lazy(() => import('./pages/configuracao/tipoorigem'))
      },
      {
        exact: true,
        path: '/configuracao/meiopagamento',
        component: lazy(() => import('./pages/configuracao/meiopagamento'))
      },
      {
        exact: true,
        path: '/configuracao/modalidadepagamento',
        component: lazy(() => import('./pages/configuracao/modalidadepagamento'))
      },
      {
        exact: true,
        path: '/configuracao/divisas',
        component: lazy(() => import('./pages/configuracao/divisas'))
      },
      {
        exact: true,
        path: '/configuracao/banco',
        component: lazy(() => import('./pages/configuracao/banco'))
      },
      {
        exact: true,
        path: '/configuracao/taxacasino',
        component: lazy(() => import('./pages/configuracao/taxacasino'))
      },
      {
        exact: true,
        path: '/configuracao/projetos',
        component: lazy(() => import('./pages/configuracao/projetos'))
      },
      {
        exact: true,
        path: '/configuracao/rubricas',
        component: lazy(() => import('./pages/configuracao/rubricas'))
      },
      //--------------------------------------------------------------


      {
        exact: true,
        path: '/entidades/entidades',
        component: lazy(() => import('./pages/entidades/entidades'))
      },
      {
        exact: true,
        path: '/entidades/entidades/detalhes/:id',
        component: lazy(() => import('./pages/entidades/entidades/detalhes'))
      },
      {
        exact: true,
        path: '/entidades/entidades/banca/:id',
        component: lazy(() => import('./pages/entidades/entidades/banca'))
      },

      {
        exact: true,
        path: '/entidades/entidades/colaboradores/:id',
        component: lazy(() => import('./pages/entidades/entidades/colaboradores'))
      },

      {
        exact: true,
        path: '/entidades/entidades/equipamento/:id',
        component: lazy(() => import('./pages/entidades/entidades/equipamento'))
      },

      {
        exact: true,
        path: '/entidades/entidades/grupo/:id',
        component: lazy(() => import('./pages/entidades/entidades/grupo'))
      },

      {
        exact: true,
        path: '/entidades/entidades/maquina/:id',
        component: lazy(() => import('./pages/entidades/entidades/maquina'))
      },


      {
        exact: true,
        path: '/entidades/pessoas',
        component: lazy(() => import('./pages/entidades/pessoas'))
      },

      {
        exact: true,
        path: '/entidades/igj',
        component: lazy(() => import('./pages/entidades/igj'))
      },

      {
        exact: true,
        path: '/entidade/orcamento',
        component: lazy(() => import('./pages/entidades/igj/orcamento'))
      },
      {
        exact: true,
        path: '/entidade/auditoria',
        component: lazy(() => import('./pages/entidades/igj/auditoria'))
      },
      {
        exact: true,
        path: '/entidade/visaogeral',
        component: lazy(() => import('./pages/entidades/igj/visaogeral'))
      },



      //--------------------------------------------------------------


      {
        exact: true,
        path: '/eventos/aprovados',
        component: lazy(() => import('./pages/eventos/aprovados'))
      },

      {
        exact: true,
        path: '/eventos/eventospedidos',
        component: lazy(() => import('./pages/eventos/eventospedidos'))
      },


      {
        exact: true,
        path: '/eventos/recusados',
        component: lazy(() => import('./pages/eventos/recusados'))
      },


      //--------------------------------------------------------------


      {
        exact: true,
        path: '/processos/autoexclusao',
        component: lazy(() => import('./pages/processos/autoexclusao'))
      },



      {
        exact: true,
        path: '/processos/handpay',
        component: lazy(() => import('./pages/processos/handpay'))
      },



      //--------------------------------------------------------------



      {
        exact: true,
        path: '/processos/exclusaofinalizado',
        component: lazy(() => import('./pages/processos/exclusaofinalizado'))
      },


      {
        exact: true,
        path: '/processos/exclusaointerdicao',
        component: lazy(() => import('./pages/processos/exclusaointerdicao'))
      },




      //--------------------------------------------------------------




      {
        exact: true,
        path: '/processos/exclusao/arquivados',
        component: lazy(() => import('./pages/processos/exclusaoarquivado'))
      },


      {
        exact: true,
        path: '/processos/exclusao/finalizado',
        component: lazy(() => import('./pages/processos/exclusaofinalizado'))
      },

      {
        exact: true,
        path: '/processos/exclusao/pedido',
        component: lazy(() => import('./pages/processos/exclusaointerdicao'))
      },


      {
        exact: true,
        path: '/processos/exclusao/prescritos',
        component: lazy(() => import('./pages/processos/exclusaoprescrito'))
      },

      {
        exact: true,
        path: '/processos/reclamacao',
        component: lazy(() => import('./pages/processos/reclamacao'))
      },
      {
        exact: true,
        path: '/processos/reclamacao/estatisticas',
        component: lazy(() => import('./pages/processos/reclamacao/estatisticas'))
      },

      {
        exact: true,
        path: '/processos/contraordenacao',
        component: lazy(() => import('./pages/processos/contraordenacao'))
      },





      //--------------------------------------------------------------

      {
        exact: true,
        path: '/ajuda',
        component: lazy(() => import('./pages/ajuda'))
      },


      //--------------------| VIEWS




      {
        path: '*',
        exact: true,
        component: () => <Redirect to={BASE_URL} />
      }
    ]
  }
];

export default routes;
