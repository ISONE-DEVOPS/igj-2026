export const BASENAME = '/app'; // don't add '/' at end off BASENAME for breadcrumbs 
export const BASE_URL = '/dashboard';
export const BASE_TITLE = ' | IGJ';

export const CONFIG = {
    layout: 'vertical', // vertical, horizontal
    subLayout: '', // horizontal-2
    collapseMenu: false, // mini-menu
    layoutType: 'menu-light', // menu-dark, menu-light, dark
    headerBackColor: 'header-blue', // header-blue, header-red, header-purple, header-info, header-green header-dark
    rtlLayout: false,
    navFixedLayout: true,
    headerFixedLayout: true,
    boxLayout: false,
    jwt: {
        secret: 'SECRET-KEY',
        timeout: '1 days'
    },
    firebase: {
        apiKey: '*',
        authDomain: '*',
        projectId: '*',
        storageBucket: '*',
        messagingSenderId: '*',
        appId: '*',
        measurementId: '*',
    },
    auth0: {
        client_id: '*',
        domain: '*',
    }
};
