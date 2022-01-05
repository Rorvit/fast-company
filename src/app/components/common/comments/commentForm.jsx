import React, { useState, useEffect } from "react";
import SelectField from "../form/selectField";
import { validator } from "../../../utils/validator";
import PropTypes from "prop-types";
import TextAreaField from "../form/textAreaField";

const CommentForm = ({ forId, users, add }) => {
    const [data, setData] = useState({ comment: "", user: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        validate();
    }, [data]);

    const handleChange = (target) => {
        setData((prevState) => ({ ...prevState, [target.name]: target.value }));
    };

    const validatorConfig = {
        comment: {
            isRequired: {
                message: "Поле сообщение не может быть пустым"
            }
        },
        user: {
            isRequired: {
                message: "Выберите имя пользователя"
            }
        }
    };

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isValid = Object.keys(errors).length === 0;

    const clear = () => {
        setData({ comment: "", user: "" });
    };

    const handleTextArea = () => {
        const isValid = validate();
        if (!isValid) return;
        const comment = {
            userId: data.user,
            pageId: forId,
            content: data.comment
        };

        add(comment);
        clear();
    };
    return (
        <div className="card mb-2">
            <div className="card-body">
                <div>
                    <h2>New comment</h2>
                    <SelectField
                        label=""
                        onChange={handleChange}
                        value={data.user}
                        defaultOption="Choose"
                        options={{ ...users }}
                        error={errors.user}
                        name="user"
                    />
                    <TextAreaField
                        onChange={handleChange}
                        label="Сообщение"
                        name="comment"
                        value={data.comment}
                        error={errors.comment}
                        rows="3"
                    />
                    <div className="d-flex justify-content-end">
                        <button
                            onClick={handleTextArea}
                            className="btn btn-primary"
                            disabled={!isValid}
                        >
                            Опубликовать
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

CommentForm.propTypes = {
    forId: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired,
    add: PropTypes.func
};
export default CommentForm;
