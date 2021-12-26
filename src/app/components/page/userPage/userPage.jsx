import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import QualitiesList from "../../ui/qualitites/qualitiesList";
import API from "../../../api";
import { Link } from "react-router-dom";
import CommentForm from "../../../components/common/comments/commentForm";
import Comments from "../../../components/common/comments/comments";
import Loader from "../../../utils/loader";

const UserPage = ({ userId }) => {
    const [user, setUser] = useState();
    const [users, setUsers] = useState();
    const [comments, setComments] = useState();

    useEffect(() => {
        API.users.getById(userId).then((user) => {
            console.log("USER IN USERPAGE,", user);
            setUser(user);
        });
    }, []);

    useEffect(() => {
        API.users.fetchAll().then((data) => {
            setUsers(data);
        });
    }, []);
    useEffect(() => {
        API.comments.fetchCommentsForUser(userId).then((data) => {
            setComments(data);
        });
    }, []);
    const addComment = (comment) => {
        API.comments.add(comment);
        API.comments
            .fetchCommentsForUser(userId)
            .then((data) => setComments(data));
    };
    const removeComment = (id) => {
        API.comments.remove(id);
        API.comments
            .fetchCommentsForUser(userId)
            .then((data) => setComments(data));
    };
    console.log("COMMENTSFORUSER", comments);
    if (user) {
        return (
            <div className="container">
                <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                        <div className="card mb-3">
                            <div className="card-body">
                                <button className="position-absolute top-0 end-0 btn btn-light btn-sm">
                                    <Link to={`/users/${userId}/edit`}>
                                        <i className="bi bi-gear"></i>
                                    </Link>
                                </button>
                                <div className="d-flex flex-column align-items-center text-center  position-relative">
                                    <img
                                        src={`https://avatars.dicebear.com/api/croodles-neutral/your-custom-seed.svg${(
                                            Math.random() + 1
                                        )
                                            .toString(36)
                                            .substring(7)}.svg`}
                                        className="rounded-circle shadow-1-strong me-3"
                                        alt="avatar"
                                        width="65"
                                        height="65"
                                    />
                                    <div className="mt-3">
                                        <h4>{user.name}</h4>
                                        <p className="text-secondary mb-1">
                                            {user.profession[name]}
                                        </p>
                                        <div className="text-muted">
                                            <i
                                                className=" bi bi-caret-down-fill text-primary "
                                                role="button"
                                            ></i>
                                            <i
                                                className="bi bi-caret-up text-secondary"
                                                role="button"
                                            ></i>
                                            <span className="ms-2">
                                                {user.rate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card mb-3">
                            <div className=" card-body d-flex flex-column justify-content-center text-center ">
                                <h5 className="card-title">
                                    <span>Qualities</span>
                                </h5>
                                <p className="card-text">
                                    <QualitiesList qualities={user.qualities} />
                                </p>
                            </div>
                        </div>
                        <div className="card mb-3">
                            <div className="card mb-3">
                                <div className=" card-body d-flex flex-column justify-content-center text-center ">
                                    <h5 className="card-title">
                                        <span>Completed meetings</span>
                                    </h5>

                                    <h1 className="display-1">
                                        {user.completedMeetings}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        Комментарии
                        {users ? (
                            <CommentForm
                                forId={userId}
                                users={users}
                                add={addComment}
                            />
                        ) : (
                            <Loader />
                        )}
                        {users && comments ? (
                            <Comments
                                userId={user._id}
                                users={users}
                                commentsForUser={comments}
                                remove={removeComment}
                            />
                        ) : (
                            <Loader />
                        )}
                    </div>
                </div>
            </div>
        );
    }
    return <Loader />;
};

export default UserPage;
UserPage.propTypes = {
    userId: PropTypes.string.isRequired,
    users: PropTypes.array
};
