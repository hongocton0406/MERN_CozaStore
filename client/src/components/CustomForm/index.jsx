import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { yupResolver } from "@hookform/resolvers/yup";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

import "./CustomForm.scss";
import { IMAGE_CLOUDINARY } from "constants/Data";

const animatedComponents = makeAnimated();
const customStyles = {
    control: (base, state) => ({
        ...base,
        paddingTop: 6,
        paddingBottom: 6,
    }),
    multiValueLabel: (base, state) => ({
        ...base,
        fontSize: "16px",
        color: "#333",
        lineHeight: 1.4,
    }),
};

export function Form({ defaultValues, validation, children, onSubmit }) {
    const {
        control,
        handleSubmit,
        reset,
        register,
        formState: { errors },
    } = useForm({ defaultValues, resolver: yupResolver(validation) });

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            {Array.isArray(children)
                ? children.map((child) => {
                      return child.props.name
                          ? React.createElement(child.type, {
                                ...{
                                    ...child.props,
                                    register,
                                    control,
                                    errors,
                                    key: child.props.name,
                                },
                            })
                          : child;
                  })
                : React.createElement(children.type, {
                      ...{
                          ...children.props,
                          register,
                          control,
                          errors,
                          key: children.props.name,
                      },
                  })}
        </form>
    );
}

export function InputField({ register, errors, name, ...rest }) {
    return (
        <>
            <div className="form-group">
                <label className="form-label" htmlFor={name}>
                    {name}
                </label>
                <div className="form-control">
                    <input type="text" {...register(name)} {...rest} id={name} className="form-input" />
                    {errors[name] && <p className="error-message">*{errors[name].message}</p>}
                </div>
            </div>
        </>
    );
}

export function SelectField({ control, errors, options, name, isMultiple, ...rest }) {
    return (
        <>
            <div className="form-group">
                <label className="form-label">{name}</label>
                <div className="form-control">
                    <Controller
                        name={name}
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                closeMenuOnSelect={isMultiple ? false : true}
                                components={animatedComponents}
                                isMulti={isMultiple}
                                options={options}
                                styles={customStyles}
                                {...rest}
                            />
                        )}
                    />
                    {errors[name] && <p className="error-message">*{errors[name].message}</p>}
                </div>
            </div>
        </>
    );
}

export function RadioField({ register, errors, options, name, ...rest }) {
    return (
        <>
            <div className="form-group">
                <label className="form-label">{name}</label>
                <div className="form-control flex">
                    {options.map((option) => (
                        <div className="form-radio" key={option.label}>
                            <label className="radio">
                                <div className="radio-label">{option.label}</div>
                                <input {...register(name)} type="radio" name="radio" {...rest} value={option.value} />
                                <span className="radio-checkmark"></span>
                            </label>
                        </div>
                    ))}
                    {errors[name] && <p className="error-message">*{errors[name].message}</p>}
                </div>
            </div>
        </>
    );
}

export function ImageField({ control, register, errors, name }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "images",
    });

    const [currentFiles, setCurrentFiles] = useState([]);
    const imageList = control._defaultValues.images;
    useEffect(() => {
        if (imageList) setCurrentFiles(imageList.map((item) => IMAGE_CLOUDINARY + item.name));
    }, [imageList]);

    const handleUpload = (e) => setCurrentFiles((prev) => [...prev, URL.createObjectURL(e.target.files[0])]);
    const handleRemoveUpload = (key) => setCurrentFiles(currentFiles.filter((item, index) => index != key));

    return (
        <>
            <div className="form-group">
                <label className="form-label" htmlFor={name}>
                    {name}
                </label>
                <div className="form-control flex">
                    <div className="images-upload">
                        <div className="preview">
                            <div className="preview__container">
                                {fields.map((item, index) => (
                                    <div key={item.id} className="preview-box">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="form-upload"
                                            id={`image-${index}`}
                                            {...register(`images.${index}.name`)}
                                            onChange={(e) => {
                                                const imageRegister = register(`images.${index}.name`);
                                                imageRegister.onChange(e);
                                                handleUpload(e);
                                            }}
                                        />
                                        {currentFiles[index] ? (
                                            <img src={currentFiles[index]} className="preview-box__image" />
                                        ) : (
                                            <label htmlFor={`image-${index}`}>
                                                <FileUploadIcon />
                                                <span>Upload Image</span>
                                            </label>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleRemoveUpload(index);
                                                remove(index);
                                            }}
                                        >
                                            <CloseIcon sx={{ color: "#666" }} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="preview-box button-add"
                                    onClick={() => append({ name: null })}
                                >
                                    <AddPhotoAlternateIcon fontSize="large" />
                                    <span>Add Image</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {errors[name]?.message && <p className="error-message">*{errors[name].message}</p>}
                    {errors[name]?.[fields.length - 1] && (
                        <p className="error-message">*{errors[name]?.[fields.length - 1]?.name.message}</p>
                    )}
                </div>
            </div>
        </>
    );
}