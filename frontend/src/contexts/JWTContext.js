import React, { createContext, useEffect, useReducer, useState } from 'react';
import { ACCOUNT_INITIALISE, LOGIN, LOGOUT } from "../store/actions";
import api from '../services/api';
import accountReducer from '../store/accountReducer';
import Loader from "../components/Loader/Loader";
import socketio from 'socket.io-client'

import backendURL from '../services/backend'
import { ICON_OVERRIDES, COLLAPSE_OVERRIDES, CONFIGURACOES_SUBGROUPS } from '../config/menuConfig';

function maker0(s) {


  for (var i = 0; i < s.length; i++) {

    s[i].id = s[i].ID
    s[i].title = s[i].DS_MENU
    s[i].type = s[i].TIPO
    s[i].url = s[i].URL
    s[i].icon = s[i].URL_ICON

  }

  return s


}


function maker1(s) {


  for (var i = 0; i < s.length; i++) {

    if (s[i].SELF_ID != null) {

      for (var e = 0; e < s.length; e++) {

        if (s[e].ID == s[i].SELF_ID) {

          if (s[e].hasOwnProperty('children') == false) {
            s[e].children = []
          }

          s[e].children.push(s[i])

        } else {

          if (s[e].hasOwnProperty('children') == true) {

            if (s[e].children.length > 0) {

              for (var o = 0; o < s[e].children.length; o++) {

                maker1(s[e].children[o])

              }

            }

          }

        }



      }


    }



  }


}

function maker2(s) {

  if (s.length > 0) {


    for (var i = 0; i < s.length; i++) {

      if (s[i].SELF_ID != null) {

        s[i].EX = false

      } else s[i].EX = true

    }



    s = s.filter(function (el) {
      return el.EX == true
    })

    var x = { items: s }

    return x

  }

  else return { items: [] }



}

// ── Aplica icones coloridos e agrupa Configuracoes ──

function applyIconOverrides(items, parentIcon, parentColor) {
  if (!items) return;
  for (var i = 0; i < items.length; i++) {
    var override = ICON_OVERRIDES[items[i].url];
    if (override) {
      items[i].icon = override.icon;
      items[i].iconColor = override.color;
    } else if (items[i].title) {
      var titleKey = items[i].title.toLowerCase().trim();
      var titleOverride = COLLAPSE_OVERRIDES[titleKey];
      if (titleOverride) {
        items[i].icon = titleOverride.icon;
        items[i].iconColor = titleOverride.color;
      } else if (parentIcon) {
        // Herdar icone do pai para filhos sem override proprio
        items[i].icon = parentIcon;
        items[i].iconColor = parentColor;
      }
    }
    if (items[i].children) {
      applyIconOverrides(items[i].children, items[i].icon, items[i].iconColor);
    }
  }
}

function groupConfiguracoes(menuData) {
  if (!menuData || !menuData.items) return menuData;

  function findAndGroup(items) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.type === 'collapse' && item.children && item.children.length > 10) {
        var configChildren = item.children.filter(function (c) {
          return c.url && c.url.indexOf('/configuracao/') === 0;
        });
        if (configChildren.length > 10) {
          var newChildren = [];
          var assignedUrls = {};

          CONFIGURACOES_SUBGROUPS.forEach(function (subgroup) {
            var subChildren = [];
            subgroup.urls.forEach(function (url) {
              var child = item.children.find(function (c) { return c.url === url; });
              if (child) {
                subChildren.push(child);
                assignedUrls[url] = true;
              }
            });
            if (subChildren.length > 0) {
              newChildren.push({
                id: subgroup.id,
                title: subgroup.title,
                type: 'collapse',
                icon: subgroup.icon,
                iconColor: subgroup.iconColor,
                children: subChildren
              });
            }
          });

          var unassigned = item.children.filter(function (c) {
            return c.url && c.url.indexOf('/configuracao/') === 0 && !assignedUrls[c.url];
          });
          if (unassigned.length > 0) {
            newChildren.push({
              id: 'config-sub-outros',
              title: 'Outros',
              type: 'collapse',
              icon: 'fas fa-ellipsis-h',
              iconColor: '#999',
              children: unassigned
            });
          }

          // Manter filhos que nao sao /configuracao/
          var nonConfig = item.children.filter(function (c) {
            return !c.url || c.url.indexOf('/configuracao/') !== 0;
          });
          item.children = newChildren.concat(nonConfig);
          return;
        }
      }
      if (item.children) {
        findAndGroup(item.children);
      }
    }
  }

  findAndGroup(menuData.items);
  return menuData;
}

function injectAjudaMenu(menuData) {
  if (!menuData || !menuData.items) return menuData;
  // Evitar duplicar se ja existe
  var exists = false;
  for (var i = 0; i < menuData.items.length; i++) {
    if (menuData.items[i].url === '/ajuda') { exists = true; break; }
    if (menuData.items[i].children) {
      for (var j = 0; j < menuData.items[i].children.length; j++) {
        if (menuData.items[i].children[j].url === '/ajuda') { exists = true; break; }
      }
    }
    if (exists) break;
  }
  if (!exists) {
    // Inserir no ultimo grupo como item direto
    var lastGroup = null;
    for (var k = menuData.items.length - 1; k >= 0; k--) {
      if (menuData.items[k].type === 'group' && menuData.items[k].children) {
        lastGroup = menuData.items[k];
        break;
      }
    }
    var ajudaItem = {
      id: 'ajuda-manual',
      title: 'Ajuda',
      type: 'item',
      icon: 'fas fa-question-circle',
      iconColor: '#4680FF',
      url: '/ajuda'
    };
    if (lastGroup) {
      lastGroup.children.push(ajudaItem);
    } else {
      menuData.items.push(ajudaItem);
    }
  }
  return menuData;
}

function transformMenus(menuData) {
  applyIconOverrides(menuData.items);
  groupConfiguracoes(menuData);
  injectAjudaMenu(menuData);
  return menuData;
}

async function injectDynamicCasinoMenus(menuData) {
  if (!menuData || !menuData.items) return menuData;

  function findCasinoCollapse(items) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].title && items[i].title.toLowerCase().trim() === 'casinos' && items[i].type === 'collapse') {
        return items[i];
      }
      if (items[i].children) {
        var found = findCasinoCollapse(items[i].children);
        if (found) return found;
      }
    }
    return null;
  }

  var casinoMenu = findCasinoCollapse(menuData.items);
  if (!casinoMenu) return menuData;

  try {
    var response = await api.get('/sgigjentidadecasino');
    if (response.status == 200 && response.data) {
      var casinos = response.data.filter(function(e) {
        return e.sgigjprentidadetp && e.sgigjprentidadetp.DESIG === 'Casino';
      });

      var nonCasinoChildren = (casinoMenu.children || []).filter(function(child) {
        return !child.url || child.url.indexOf('/entidades/entidades/detalhes/') !== 0;
      });

      var dynamicChildren = casinos.map(function(casino) {
        return {
          id: 'casino-' + casino.ID,
          title: casino.DESIG,
          type: 'item',
          url: '/entidades/entidades/detalhes/' + casino.ID,
          icon: 'fas fa-dice',
          iconColor: '#d4a843'
        };
      });

      casinoMenu.children = nonCasinoChildren.concat(dynamicChildren);
    }
  } catch (err) {
    console.error('Error loading casino entities for menu:', err);
  }

  return menuData;
}

//--------------------------------| START

const initialState = {
  isLoggedIn: false,
  isInitialised: false,
  user: null
};


const verifyToken = (serviceToken) => {

  /*
  
    if (!serviceToken) {
      return false;
    }

    const decoded = jwtDecode(serviceToken);
    return decoded.exp > (Date.now() / 1000);
  
  */

  return true

};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    api.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete api.defaults.headers.common.Authorization;
  }
};

const JWTContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => { }
});

export const JWTProvider = ({ children }) => {


  //--------------------------------| lockdata

  const [lockdata, setlockdata] = useState({
    foto: "",
    username: "",
    link: "",
    ative: false,
  });

  const resetlockdata = async () => {

    setlockdata({

      foto: "",
      username: "",
      link: "",
      ative: false,

    })

  }


  const createlockdata = async (username, foto, link) => {

    setlockdata({

      foto: foto,
      username: username,
      link: link,
      ative: true,

    })

  }




  //--------------------------------| menus
  const [menus, setmenus] = useState({ items: [] });


  //--------------------------------| permissoes
  const [permissoes, setpermissoes] = useState([]);



  //--------------------------------| thememenu
  const [thememenu, setthememenu] = useState(false);


  //--------------------------------| tempdata

  const [tempdata, settempdata] = useState({});



  //--------------------------------| popUp

  const [popUp, setpopUp] = useState({
    showpop: false,
    type: "",
    text: "",
    haveFunction: false,
    function: null,
    oth: null,
  });

  const popUp_reset = () => {

    setpopUp({

      showpop: false,
      type: "",
      text: "",
      haveFunction: false,
      function: null,
      oth: null,
    })

  }


  const popUp_removerItem = async (f) => {

    setpopUp({

      showpop: true,
      type: "remover",
      text: "Deseja remover esse item?",
      haveFunction: true,
      function: f,
      oth: null,
    })

  }

  const popUp_alertaOK = async (text) => {

    setpopUp({

      showpop: true,
      type: "alerta",
      text: text,
      haveFunction: false,
      function: null,
      oth: null,
    })

  }


  const popUp_simcancelar = async (text, f) => {

    setpopUp({

      showpop: true,
      type: "simcancelar",
      text: text,
      haveFunction: true,
      function: f,
      oth: null,
    })

  }


  const popUp_simnao = async (text, f) => {

    setpopUp({

      showpop: true,
      type: "simnao",
      text: text,
      haveFunction: true,
      function: f,
      oth: "it has 2 functions",
    })

  }


  //--------------------------------| useronline

  const [useronline, setuseronline] = useState(null);


  //--------------------------------| Auth


  const [state, dispatch] = useReducer(accountReducer, initialState);

  const login = async (data) => {

    const { serviceToken, user } = data;
    setSession(serviceToken);
    dispatch({
      type: LOGIN,
      payload: {
        user
      }
    });

    reloaduser()

  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const reloaduser = async () => {


    try {

      const response = await api.get('/me');

      dispatch({
        type: ACCOUNT_INITIALISE,
        payload: {
          isLoggedIn: true,
          user: response.data[0]
        }
      });

      var s = maker0(response.data[0].glbperfil.glbmenu)
      maker1(s)
      var x = maker2(s)
      x = transformMenus(x)
      x = await injectDynamicCasinoMenus(x)
      setmenus(x)

      setpermissoes(response.data[0].glbperfil.glbmenu)


    } catch (e) {

      console.log(e)

    }

  };

  useEffect(() => {


    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);

          const response = await api.get('/me');

          dispatch({
            type: ACCOUNT_INITIALISE,
            payload: {
              isLoggedIn: true,
              user: response.data[0]
            }
          });

          var s = maker0(response.data[0].glbperfil.glbmenu)
          maker1(s)
          var x = maker2(s)
          x = transformMenus(x)
          x = await injectDynamicCasinoMenus(x)
          setmenus(x)

          setpermissoes(response.data[0].glbperfil.glbmenu)


          uploadlistnotificacao()

          const socket = socketio(backendURL, { query: { token: serviceToken } })

          socket.on('standard', async data => {

            if (data == "useronline") setuseronline(Math.random())

            if (data == "Notificacao") {

              uploadlistnotificacao()

            }


          })




        } else {
          dispatch({
            type: ACCOUNT_INITIALISE,
            payload: {
              isLoggedIn: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: ACCOUNT_INITIALISE,
          payload: {
            isLoggedIn: false,
            user: null
          }
        });
      }
    };

    init();



  }, []);


  //notificacao -------------------------

  const [notificacao, setnotificacao] = useState([]);
  const [countNotification, setCountNotification] = useState(0);


  async function uploadlistnotificacao() {

    try {

      const response = await api.get('/glbnotificacao');

      if (response.status == '200') {
        let data = response.data['data']
        setCountNotification(response.data.countNew)
        for (var i = 0; i < data.length; i++) {


          if (data[i]?.sgigjpessoa?.sgigjrelpessoaentidade.length > 0) {

            if (data[i]?.sgigjpessoa?.sgigjrelpessoaentidade[0].glbuser.length > 0) {

              data[i].URL_FOTO = data[i]?.sgigjpessoa?.sgigjrelpessoaentidade[0].glbuser[0].URL_FOTO


            } else data[i].URL_FOTO = ""

          } else data[i].URL_FOTO = ""



        }

        setnotificacao(data)

      }

    } catch (err) {

      console.error(err.response)


    }

  }


  if (!state.isInitialised) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider value={{
      ...state,

      login,
      logout,

      thememenu,
      setthememenu,

      tempdata,
      settempdata,

      reloaduser,

      menus,
      permissoes,

      popUp,
      popUp_reset,
      popUp_simnao,
      popUp_alertaOK,
      popUp_simcancelar,
      popUp_removerItem,

      lockdata,
      createlockdata,
      resetlockdata,

      useronline,
      notificacao,
      setnotificacao,
      uploadlistnotificacao,
      countNotification
    }}>

      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;