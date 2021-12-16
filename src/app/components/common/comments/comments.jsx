import React from "react";
import PropTypes from "prop-types";
import displayDate from "../../../utils/displayDate";

const Comments = ({ users, commentsForUser, remove }) => {
    const sortedComments = commentsForUser.sort(
        (a, b) => b.created_at - a.created_at
    );
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h2>Comments</h2>
                <hr />
                {sortedComments.map((comment) => (
                    <div key={comment.id} className="bg-light card-body mb-3">
                        <div className="row">
                            <div className="col">
                                <div className="d-flex flex-start">
                                    <img
                                        src="https://avatars.dicebear.com/api/avataaars/qweqasdas.svg"
                                        className="rounded-circleshadow-1-strongme-3"
                                        alt="avatar"
                                        width="65"
                                        height="65"
                                    />
                                    <div className="flex-grow-1 flex-shrink-1">
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="mb-1">
                                                    {
                                                        users.filter(
                                                            (user) =>
                                                                user._id ===
                                                                comment.userId
                                                        )[0].name
                                                    }
                                                    <span className="small ms-2">
                                                        {displayDate(
                                                            comment.created_at
                                                        )}
                                                    </span>
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        remove(comment._id)
                                                    }
                                                    className="btn btn-sm text-primary d-flex align-items-center"
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                            <p className="small mb-0">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;
Comments.propTypes = {
    userId: PropTypes.string.isRequired,
    users: PropTypes.array,
    commentsForUser: PropTypes.array,
    remove: PropTypes.func
};
