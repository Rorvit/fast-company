import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import TextField from "../../common/form/textField";
import { validator } from "../../../utils/validator";
import api from "../../../api";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import { useHistory } from "react-router";
import MultiSelectField from "../../common/form/multiSelectField";

const UserPageEdit = ({ userId }) => {
    const history = useHistory();

    const [data, setData] = useState({
        email: "",
        password: "",
        profession: "",
        sex: "male",
        qualities: [],
        name: ""
    });
    const [errors, setErrors] = useState({});
    const [professions, setProfession] = useState();
    const [qualities, setQualities] = useState({});

    useEffect(() => {
        api.users.getById(userId).then(({ profession, ...data }) =>
            setData((prevState) => ({
                ...prevState,
                ...data,
                profession: profession._id
            }))
        );
        api.professions.fetchAll().then((data) => setProfession(data));
        api.qualities.fetchAll().then((data) => setQualities(data));
    }, []);

    const handleChange = (target) => {
        setData((prevState) => ({ ...prevState, [target.name]: target.value }));
    };

    const validatorConfog = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        password: {
            isRequired: {
                message: "Пароль обязательна для заполнения"
            },
            isCapitalSymbol: {
                message: "Пароль должен содержать хотя бы одну заглавную букву"
            },
            isContainDigit: {
                message: "Пароль должен содержать хотя бы одно число"
            },
            min: {
                message: "Пароль должен состоять миниму из 8 символов",
                value: 8
            }
        },
        profession: {
            isRequired: {
                message: "Обязательно выберите вашу профессию"
            }
        },
        licence: {
            isRequired: {
                message:
                    "Вы не можете использовать наш сервис без подтверждения лицензионного соглашения"
            }
        },
        name: {
            min: {
                message: "Имя должно состоять миниму из 3 символов",
                value: 3
            }
        }
    };
    useEffect(() => {
        validate();
    }, [data]);
    const validate = () => {
        const errors = validator(data, validatorConfog);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;

    const getProfessionById = (id) => {
        for (const prof in professions) {
            const profData = professions[prof];
            if (profData._id === id) return profData;
        }
    };

    const isCorrectArray = (elements, patternArray) => {
        let equalsKeys =
            patternArray && qualities[Object.keys(patternArray)[0]];
        if (!equalsKeys) return false;
        const arrPatternKeys = Object.keys(
            qualities[Object.keys(patternArray)[0]]
        );

        equalsKeys = elements[0] !== undefined;

        for (const key in elements[0]) {
            equalsKeys = equalsKeys && arrPatternKeys.includes(key);
        }

        return equalsKeys;
    };

    const getQualities = (elements) => {
        if (isCorrectArray(elements, qualities)) {
            return elements;
        }
        const qualitiesQrray = [];
        for (const elem of elements) {
            for (const qualy in qualities) {
                if (elem.value === qualities[qualy]._id) {
                    qualitiesQrray.push(qualities[qualy]);
                }
            }
        }
        return qualitiesQrray;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        console.log(data);
    };

    const handleUserUpdate = () => {
        api.users
            .update(userId, {
                ...data,
                profession: getProfessionById(data.profession),
                qualities: getQualities(data.qualities)
            })
            .then((data) => {});
        history.push(`/users/${userId}`);
    };

    const handleClickBack = () => {
        history.push(`/users/${userId}`);
    };
    if (professions) {
        return (
            <>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleClickBack}
                >
                    Назад
                </button>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Имя"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        error={errors.name}
                    />
                    <TextField
                        label="Электронная почта"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <TextField
                        label="Пароль"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <SelectField
                        name="profession"
                        label="Выбери свою профессию"
                        value={data.profession}
                        onChange={handleChange}
                        defaultOption="Choose..."
                        options={professions}
                        error={errors.profession}
                    />
                    <RadioField
                        options={[
                            { name: "Male", value: "male" },
                            { name: "Female", value: "female" },
                            { name: "Other", value: "other" }
                        ]}
                        value={data.sex}
                        name="sex"
                        onChange={handleChange}
                        label="Выберите ваш пол"
                    />
                    <MultiSelectField
                        options={qualities}
                        onChange={handleChange}
                        name="qualities"
                        label="Выберите ваши качества"
                        defaultValue={data.qualities}
                    />
                    <button
                        type="button"
                        disabled={!isValid}
                        className="btn btn-primary w-100 mx-auto"
                        onClick={handleUserUpdate}
                    >
                        Обновить
                    </button>
                </form>
            </>
        );
    } else {
        return <h1>Loading Edit</h1>;
    }
};

UserPageEdit.propTypes = {
    userId: PropTypes.string
};

export default UserPageEdit;
