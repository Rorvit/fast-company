import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../../api";
import QualitiesList from "../../ui/qualitites/qualitiesList";
import { Link } from "react-router-dom";

import UserPageEdit from "../userPageEdit/";

const UserPage = ({ userId, type = "" }) => {
    const [user, setUser] = useState();

    useEffect(() => {
        api.users.getById(userId).then((data) => setUser(data));
    });
    if (user) {
        if (type?.toLowerCase() === "edit") {
            return (
                <div className="container mt-5">
                    <div className="row">
                        <UserPageEdit userId={userId} />;
                    </div>
                </div>
            );
        }

        return (
            <div>
                <h1> {user.name}</h1>
                <h2>Профессия: {user.profession.name}</h2>
                <QualitiesList qualities={user.qualities} />
                <p>completedMeetings: {user.completedMeetings}</p>
                <h2>Rate: {user.rate}</h2>
                <Link to={`/users/${userId}/edit`}>
                    <button> Изменить</button>
                </Link>
            </div>
        );
    } else {
        return <h1>Loading</h1>;
    }
};

UserPage.propTypes = {
    userId: PropTypes.string.isRequired,
    type: PropTypes.string
};

export default UserPage;
