import React from 'react';
import { ListGroup } from 'react-bootstrap';
import NavCollapse from "../NavCollapse";
import NavItem from "../NavItem";
import { GROUP_OVERRIDES } from "../../../../../config/menuConfig";

const NavGroup = ({ layout, group }) => {
    let navItems = '';

    if (group.children) {
        const groups = group.children;
        navItems = Object.keys(groups).map(item => {
            item = groups[item];
            switch (item.type) {
                case 'collapse':
                    return <NavCollapse key={item.id} collapse={item} type="main" />;
                case 'item':
                    return <NavItem layout={layout} key={item.id} item={item} />;
                default:
                    return false;
            }
        });
    }

    const groupOverride = group.title ? GROUP_OVERRIDES[group.title.toLowerCase().trim()] : null;

    return (
        <React.Fragment>
            <ListGroup.Item as='li' bsPrefix=' ' key={group.id} className="nav-item pcoded-menu-caption">
                <label className='text-capitalize'>
                    {groupOverride && <i className={groupOverride.icon} style={{ color: groupOverride.color, marginRight: 6, fontSize: 11 }} />}
                    {group.title}
                </label>
            </ListGroup.Item>
            {navItems}
        </React.Fragment>
    );
};

export default NavGroup;
