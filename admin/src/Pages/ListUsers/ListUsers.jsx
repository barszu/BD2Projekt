import React from 'react';
import './ListUsers.css';
import {Link} from "react-router-dom";

const ListUsers = () => {

    const [allUsers , setAllUsers] = React.useState([])
    const [loading, setLoading] = React.useState(true);

    const fetchUsers = async () => {
        await fetch('http://localhost:4000/users/list', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                return data;
            })
            .then((data) => {
                setAllUsers(data);
                setLoading(false);
            })
    }

    React.useEffect(()=>{
        fetchUsers()
    },[])

    if (loading){
        return (
            <div className='listUsers'>
                <h1>ListUsers</h1>
                <h1>loading...</h1>
            </div>
        )
    }


    return (
        // <div className={"list-users"}>
        //
        // </div>


        <div className={"list-users"}>
            <h1>ListUsers</h1>

            <div className={"list-users-all"}>
                <div className={"list-users-format-main"}>
                    <p>Login</p>
                    <p>Email</p>
                    <p>OrdersNo</p>
                    <p>CartItemsNO</p>
                </div>
                <hr/>
                {allUsers.map((user, index) => (
                    <>
                        <div key={index} className={"list-users-format-main list-users-format"} >
                            <p>{user.login}</p>
                            <p>{user.email}</p>
                            <div>
                                <p>{user.orders.length}</p>
                            </div>
                            <div>
                                <p>{user.orders.length}</p>
                            </div>
                        </div>
                        <hr/>
                    </>
                ))}
            </div>
        </div>
    )
        ;
}

export default ListUsers;


