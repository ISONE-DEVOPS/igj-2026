import React, { useState } from 'react';
import { FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import ProfileForm from './ProfileForm';

const Profile = ({ listOpen, closed}) => {

    
    let listClass = ['header-user-list'];
    if (listOpen) {
        listClass = [...listClass, 'open',];
    }

    const [search, setsearch] = useState("");


    return (
        <React.Fragment>
            <div className={listClass.join(' ')} style={{minWidth:"450px"}}>
                <div className="h-list-header">
                    <div className="input-group">
                        <h3>Configuração do Perfil</h3>
                    </div>
                </div>
                <div className="h-list-body">
                    <Link to='#' className="h-close-text" onClick={closed}><i className="feather icon-chevrons-right" /></Link>
                    <div className="main-friend-cont scroll-div">
                        <div className="main-friend-list p-3" style={{height: 'calc(100vh - 85px)'}}>
                            <PerfectScrollbar>
                                <ProfileForm closed={closed} />
                            </PerfectScrollbar>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Profile;
