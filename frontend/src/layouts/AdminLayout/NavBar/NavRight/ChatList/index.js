import React, { useState } from 'react';
import { FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Friends from "./Friends";

const ChatList = ({ listOpen, closed}) => {

    
    let listClass = ['header-user-list'];
    if (listOpen) {
        listClass = [...listClass, 'open'];
    }

    const [search, setsearch] = useState("");


    return (
        <React.Fragment>
            <div className={listClass.join(' ')}>
                <div className="h-list-header">
                    <h6 style={{ margin: '0 0 10px 0', fontWeight: 600, color: '#4680FF' }}>
                        <i className="fas fa-users" style={{ marginRight: 8 }} />Utilizadores Online
                    </h6>
                    <div className="input-group">
                        <FormControl onChange={event=>setsearch(event.target.value)} type="text" id="search-friends" placeholder="Procurar utilizadores . . ." />
                    </div>
                </div>
                <div className="h-list-body">
                    <Link to='#' className="h-close-text" onClick={closed}><i className="feather icon-chevrons-right" /></Link>
                    <div className="main-friend-cont scroll-div">
                        <div className="main-friend-list" style={{height: 'calc(100vh - 85px)'}}>
                            <PerfectScrollbar>
                                <Friends search={search} listOpen={listOpen} />
                            </PerfectScrollbar>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ChatList;
