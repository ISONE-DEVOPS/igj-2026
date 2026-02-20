import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import TabConfig from "./TabConfig";
import Layout from "./Layout";

//import Auth0Context from "../../../contexts/Auth0Context";

import useAuth from '../../../hooks/useAuth';

const Configuration = () => {

    
    const { thememenu,setthememenu } = useAuth();

    let configClass = ['menu-styler'];
    if (thememenu) {
        configClass = [...configClass, 'open'];
    }



    return (
        <React.Fragment>
            <div id="styleSelector" className={configClass.join(' ')}>
                <div className="style-toggler">
                    <Link to='#' style={thememenu?null:{display:"none"}} onClick={() => setthememenu(!thememenu)}>*</Link>
                </div>
                <div className="style-block">
                    <h5 className="mb-2">Personalizar</h5>
                    <hr/>
                    <div className="m-style-scroller">
                        <Layout />
                        <TabConfig />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Configuration;
