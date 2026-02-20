import React from 'react';
import { Media } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const images = require.context('../../../../../../../assets/images/user', true);

const Friend = ({ data, activeId, clicked }) => {
    //let photo = images(`./${data.photo}`);
    let timeClass = ['d-block'];
    if (data.status) {
        timeClass = [...timeClass, 'text-c-green'];
    } else {
        timeClass = [...timeClass, 'text-muted'];
    }

    let time = '';
    if (data.time) {
        time = <small className={timeClass.join(' ')}>{data.time}</small>;
    }

    let newFriend = '';
    if (data.new) {
        newFriend = <div className="live-status">{data.new}</div>;
    }

    return (
        <React.Fragment>
            <Media className={'userlist-box'} >
                <Link to='#' className="media-left"> <img style={{height:"50px",width:"50px"}} className="media-object img-radius" src={data.photo} alt={data.name}/></Link>
                <Media.Body>
                    <h6 className="chat-header">{data.name}
                        <div style={{display:"flex",alignItems:"center"}}>
                            <span style={{height:"10px",width:"10px",borderRadius:"50%",backgroundColor:data.status===1?"#2ed8b6":"#6c757d",marginRight:"5px",marginTop:"5px"}} >
                            </span>
                            {time}
                        </div>
                    </h6>
                </Media.Body>
            </Media>
        </React.Fragment>
    );
};

export default Friend;
