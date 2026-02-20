import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link, NavLink } from "react-router-dom";

import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import NavIcon from "../NavIcon";
import NavBadge from "../NavBadge";

import { ConfigContext } from "../../../../../contexts/ConfigContext";
import * as actionType from "../../../../../store/actions";
import useWindowSize from "../../../../../hooks/useWindowSize";

const NavItem = ({ layout, item }) => {
    const history = useHistory();
    const location = useLocation();
    // let navigate = useNavigate();

    const params = useParams();
    const windowSize = useWindowSize();
    const configContext = useContext(ConfigContext);
    const { dispatch } = configContext;

    let itemTitle = item.title;

    function handleRefresh() {
        if (params[0].substring(0, 28) === item.url.substring(0, 28)) {
            history.push(item.url)

            window.location.reload();
            // if (params[0] != item.url) {
            //     history.replace(item.url)
            //     // window.history.replaceState(null, "New Page Title", item.url)
            //     window.location.reload();
            // } 
        } else {
            // navigate(item.url, { replace: true });
            history.push(item.url)

            // window.location.reload();
            return
        }

        console.log(history)
        console.log(params)

        // history.go(0); // Reload the current page
    }

    if (item.icon) {
        itemTitle = <span className="pcoded-mtext">{item.title}</span>;
    }

    let itemTarget = '';
    if (item.target) {
        itemTarget = '_blank';
    }

    let subContent;
    if (item.external) {
        subContent = (
            <Link to={item.url} target='_blank' rel='noopener noreferrer'>
                <NavIcon items={item} />
                {itemTitle}
                <NavBadge items={item} />
            </Link>
        );
    } else {

        subContent = (

            <NavLink to={item.url} className="nav-link" exact={true} target={itemTarget}>
                <NavIcon items={item} />
                {itemTitle}
                <NavBadge items={item} />
            </NavLink>
        )
    }


    let mainContent = '';
    if (layout === 'horizontal') {
        mainContent = (
            <ListGroup.Item as='li' bsPrefix=' ' onClick={() => dispatch({ type: actionType.NAV_CONTENT_LEAVE })}>{subContent}</ListGroup.Item>
        );
    } else {
        if (windowSize.width < 992) {
            mainContent = (
                <ListGroup.Item as='li' bsPrefix=' ' className={item.classes} onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}>{subContent}</ListGroup.Item>
            );
        } else {
            mainContent = (
                <ListGroup.Item as='li' bsPrefix=' ' className={item.classes}>{subContent}</ListGroup.Item>
            );
        }
    }

    return (
        <React.Fragment>
            {mainContent}
        </React.Fragment>
    );
};

export default NavItem;
