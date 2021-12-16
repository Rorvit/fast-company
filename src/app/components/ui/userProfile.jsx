import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserInfoPanel from "./userInfoPanel";
import CommentsListComponent from "../common/comments/commentsListComponent";
import api from "../../api";

const UserProfile = ({ userId }) => {
    const [user, setUser] = useState();
    useEffect(() => {
        api.users.getById(userId).then((data) => setUser(data));
    }, []);
    if (user) {
        return (
            <>
                <UserInfoPanel user={user} />
                <CommentsListComponent userId={userId} />
            </>
        );
    } else {
        return <h1>Loading</h1>;
    }
};

UserProfile.propTypes = {
    userId: PropTypes.string.isRequired
};

export default UserProfile;
