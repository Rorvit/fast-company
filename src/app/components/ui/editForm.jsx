import React, { useState, useEffect } from "react";
import { validator } from "../../utils/validator";
import TextField from "../common/form/textField";
import api from "../../api";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/multiSelectField";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const EditForm = ({ user }) => {
    const [data, setData] = useState({
        name: user.name || "",
        email: user.email || "",
        profession: user.profession.name,
        sex: user.sex || "other",
        qualities: user.qualities || []
    });

    const [errors, setErrors] = useState({});
    const [professions, setProfessions] = useState();
    const [qualities, setQualities] = useState();

    useEffect(() => {
        api.professions.fetchAll().then((data) => {
            setProfessions(data);
        });
        api.qualities.fetchAll().then((data) => {
            setQualities(data);
        });
    }, []);

    const handleChange = (target) => {
        setData((prevState) => ({ ...prevState, [target.name]: target.value }));
    };

    const validatorConfig = {
        name: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            }
        },
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: { message: "Введите корректный email" }
        },
        profession: {
            isRequired: { message: "Профессия обязательна для заполнения" }
        }
    };

    useEffect(() => validate(), [data]);

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        localStorage.setItem("user", JSON.stringify(data));
        api.users.update(user._id, data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="введите имя"
                name="name"
                value={data.name}
                onChange={handleChange}
                error={errors.name}
            />
            <TextField
                label="введите пароль"
                name="email"
                value={data.email}
                onChange={handleChange}
                error={errors.email}
            />
            <SelectField
                label="Выбери свою профессию"
                onChange={handleChange}
                value={data.profession.name}
                defaultOption="Choose"
                options={professions}
                error={errors.profession}
                name="profession"
            />
            <RadioField
                options={[
                    { name: "Female", value: "female" },
                    { name: "male", value: "male" },
                    { name: "other", value: "other" }
                ]}
                name="sex"
                onChange={handleChange}
                value={data.sex}
                label="Ваш пол"
            />
            <MultiSelectField
                options={qualities}
                onChange={handleChange}
                name="qualities"
                label="Выберите качества"
                defaultValue={data.qualities}
            />
            <button
                type="submit"
                disabled={!isValid}
                className="btn btn-primary w-100 mx-auto"
            >
                <Link to={`/users/${user._id}`}>СОХРАНИТЬ</Link>
            </button>
        </form>
    );
};
EditForm.propTypes = {
    user: PropTypes.object
};
export default EditForm;
