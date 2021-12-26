import React, { useState, useEffect } from "react";
import Pagination from "../../common/pagination";
import { paginate } from "../../../utils/paginate";
import PropTypes from "prop-types";
import GroupList from "../../common/groupList";
import api from "../../../api";
import SearchStatus from "../../ui/searchStatus";
import UserTable from "../../ui/usersTable";
import _ from "lodash";
import { useParams } from "react-router";
import UserPage from "../userPage";
import Search from "../../common/form/search";

const UsersListPage = () => {
    const params = useParams();
    const { userId } = params;

    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState();
    const [professions, setProfessions] = useState();
    const [selectedProf, setSelectedProf] = useState();
    const pageSize = 4;
    const [sortBy, setSortBy] = useState({ iter: "name", order: "asc" });
    const [searchingName, setSearchingName] = useState({ value: "" });

    useEffect(() => {
        console.log("send request users", api.users);
        api.users.fetchAll().then((data) => {
            console.log("DATA", data);
            setUsers(data);
        });
    }, []);

    useEffect(() => {
        api.professions.fetchAll().then((dataa) => {
            console.log("professions", dataa);
            setProfessions(dataa);
        });
    }, []);

    const handleDelete = (userId) => {
        const updatedUsers = users.filter((item) => item._id !== userId);
        setUsers(updatedUsers);
    };

    const handleToggleBookmark = (userId, status) => {
        if (!status || status === undefined) {
            status = true;
        } else {
            status = false;
        }
        const updatedBookmark = users.map((item) => {
            if (item._id === userId) {
                item.bookmark = status;
            }
            return item;
        });

        setUsers(updatedBookmark);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedProf]);

    const handleItemSelect = (item) => {
        setSearchingName({ value: "" });
        setSelectedProf(item);
    };

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex);
    };
    const handleSort = (item) => {
        setSortBy(item);
    };

    if (users) {
        let filteredUsers = [];

        if (selectedProf) {
            filteredUsers = users.filter(
                (user) =>
                    JSON.stringify(user.profession) ===
                    JSON.stringify(selectedProf)
            );
        } else {
            filteredUsers = users;
        }

        if (searchingName.value) {
            filteredUsers = users.filter((user) => {
                const r = searchingName.value;
                const regEx = new RegExp(r, "gi");
                return regEx.test(JSON.stringify(user.name));
            });
        }

        const count = filteredUsers.length;
        const sortedUsers = _.orderBy(
            filteredUsers,
            [sortBy.path],
            [sortBy.order]
        );
        const usersCrop = paginate(sortedUsers, currentPage, pageSize);

        const clearFilter = () => {
            setSelectedProf(undefined);
        };

        const handleSearchChange = ({ target }) => {
            setSearchingName((prevState) => ({
                ...prevState,
                value: target.value
            }));
            setSelectedProf(undefined);
            console.log("handleSearchChange", searchingName);
        };

        return (
            <>
                {userId && <UserPage userId={userId} />}
                {!userId && (
                    <div className="d-flex">
                        {professions && (
                            <div className="d-flex-flex-column flex-shrink-0 p-3">
                                <GroupList
                                    items={professions}
                                    onItemSelect={handleItemSelect}
                                    selectedItem={selectedProf}
                                />
                                <button
                                    className="btn btn-secondary mt2"
                                    onClick={clearFilter}
                                >
                                    Очистить все
                                </button>
                            </div>
                        )}
                        <div className="d-flex flex-column">
                            <SearchStatus length={count} />
                            <form>
                                <Search
                                    value={searchingName.value}
                                    onChange={handleSearchChange}
                                />
                            </form>

                            {count > 0 && (
                                <UserTable
                                    users={usersCrop}
                                    onSort={handleSort}
                                    selectedSort={sortBy}
                                    onDelete={handleDelete}
                                    onToggleBookmark={handleToggleBookmark}
                                />
                            )}

                            <div className="d-flex justify-content-center">
                                <Pagination
                                    currentPage={currentPage}
                                    itemsCount={count}
                                    pageSize={4}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <div className="spinner-border m-5" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    );
};

UsersListPage.propTypes = {
    users: PropTypes.array,
    index: PropTypes.number
};

export default UsersListPage;
