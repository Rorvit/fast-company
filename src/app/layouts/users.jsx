import React from "react";
import { useParams } from "react-router-dom";
import UserPage from "../components/page/userPage/";
import UsersListPage from "../components/page/usersListPage/";

const Users = () => {
    const params = useParams();
    const { userId, type } = params;
    return (
        <>
            {userId ? (
                <UserPage userId={userId} type={type} />
            ) : (
                <UsersListPage />
            )}
        </>
    );
};

export default Users;
