import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// import navigation from "../../../menu-items";
import { BASE_TITLE, BASENAME } from "../../../config/constant";

import useAuth from '../../../hooks/useAuth';


const Breadcrumb = () => {

    const { menus } = useAuth();


    const [main, setMain] = useState([]);
    const [item, setItem] = useState([]);

    useEffect(() => {
        (menus.items).map((item, index) => {
            if (item.type && item.type === 'group') {
                getCollapse(item, index);
            }
            return false;
        });


    });

    const getCollapse = (item) => {
        if (item.children) {
            (item.children).filter(collapse => {
                if (collapse.type && collapse.type === 'collapse') {
                    getCollapse(collapse,);
                } else if (collapse.type && collapse.type === 'item') {
                    if (document.location.pathname === BASENAME + collapse.url) {
                        setMain(item);
                        setItem(collapse);
                    }
                }
                return false;
            });
        }
    };

    let mainContent, itemContent;
    let breadcrumbContent = '';
    let title = '';

    if (main && main.type === 'collapse') {
        mainContent = (
            <ListGroup.Item as='li' bsPrefix=' ' className="breadcrumb-item">
                <Link to='#'>{main.title}</Link>
            </ListGroup.Item>
        );
    }

    if (item && item.type === 'item') {
        title = item.title;
        itemContent = (
            <ListGroup.Item as='li' bsPrefix=' ' className="breadcrumb-item">
                <Link to='#'>{title}</Link>
            </ListGroup.Item>
        );



        if (item.breadcrumbs !== false) {
            if (
                document.location.pathname !== '/app/conta' &&
                document.location.pathname.substring(0, 36) !== '/app/entidades/entidades/equipamento' &&
                document.location.pathname.substring(0, 32) !== '/app/entidades/entidades/maquina' &&
                document.location.pathname.substring(0, 30) !== '/app/entidades/entidades/grupo' &&
                document.location.pathname.substring(0, 38) !== '/app/entidades/entidades/colaboradores' &&
                document.location.pathname.substring(0, 30) !== '/app/entidades/entidades/banca' &&
                document.location.pathname.substring(0, 33) !== '/app/entidades/entidades/detalhes' &&
                document.location.pathname.substring(0, 17) !== '/app/notificacoes'

            ) {

                breadcrumbContent = (
                    <div className="page-header">
                        <div className="page-block">
                            <div className="row align-items-center">
                                <div className="col-md-12">
                                    <div className="page-header-title">
                                        <h5 className="m-b-10">{title}</h5>
                                    </div>
                                    <ListGroup as='ul' bsPrefix=' ' className="breadcrumb">
                                        <ListGroup.Item as='li' bsPrefix=' ' className="breadcrumb-item">
                                            <Link to="/"><i className="feather icon-grid" /></Link>
                                        </ListGroup.Item>
                                        {mainContent}
                                        {itemContent}
                                    </ListGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            }

        }

        document.title = title + BASE_TITLE;

    }

    return (
        <React.Fragment>
            {breadcrumbContent}
        </React.Fragment>
    )
};

export default Breadcrumb;