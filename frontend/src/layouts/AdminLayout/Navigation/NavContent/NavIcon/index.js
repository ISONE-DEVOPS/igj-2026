import React from 'react';

const NavIcon = ({ items }) => {
    let navIcons = false;
    if (items.icon) {
        const iconStyle = items.iconColor ? { color: items.iconColor } : undefined;
        navIcons = <span className="pcoded-micon"><i className={items.icon} style={iconStyle} /></span>;
    }

    return (
        <React.Fragment>
            {navIcons}
        </React.Fragment>
    );
};

export default NavIcon;
