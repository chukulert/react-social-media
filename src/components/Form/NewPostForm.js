import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import styles from "./Form.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const NewPostForm = ({ submitHandler }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  console.log(uploadedImage);
  library.add(faImage);
  const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);

    return (
      <>
        <label htmlFor={props.id || props.name}>{label}</label>
        <input className={styles.formInput} {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className={styles.formError}>{meta.error}</div>
        ) : null}
      </>
    );
  };

  const TextareaInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <>
        <label htmlFor={props.id || props.name}>{label}</label>
        <textarea
          className={`${styles.formInput} ${styles.textArea}`}
          {...field}
          {...props}
        />
        {meta.touched && meta.error ? (
          <div className={styles.formError}>{meta.error}</div>
        ) : null}
      </>
    );
  };

  const FileInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div>
        <label htmlFor={props.id || props.name}>
          <div className={styles.uploadFileLabelContainer}>
            {uploadedImage && (
              <Image
                src={uploadedImage}
                alt="Uploaded Image"
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="cover"
                className={styles.image}
              />
            )}
            {!uploadedImage && (
              <div className={styles.uploadFileLabel}>
                <FontAwesomeIcon icon="fa-solid fa-image" />
                <p>Upload an Image</p>
              </div>
            )}
          </div>
        </label>
        
        <input className="hide" {...field} {...props} value={undefined} />

        {meta.touched && meta.error ? (
          <p className={styles.formError}>{meta.error}</p>
        ) : null}
        
      </div>
    );
  };

  return (
    <Formik
      initialValues={{ title: "", description: "", file: "" }}
      validationSchema={Yup.object({
        description: Yup.string().required("Please enter a description"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);

        submitHandler({
          title: values.title,
          description: values.description,
          file: values.file,
        });
      }}
    >
      {(props) => (
        <Form className={styles.formContainer}>
          <TextInput
            name="title"
            type="title"
            placeholder="Post Title"
          />
          <TextareaInput
            name="description"
            type="textarea"
            placeholder="Post Description"
          />
          <FileInput
            id="file"
            name="file"
            type="file"
            accept="image/*"
            label="Upload an Image"
            onChange={(event) => {
              const imageURL = URL.createObjectURL(
                event.currentTarget.files[0]
              );
              setUploadedImage(imageURL);
              props.setFieldValue("file", event.currentTarget.files[0]);
            }}
          />
          <div className={styles.footer}><button type="submit" className={styles.submitBtn}>
            Post
          </button></div>
        </Form>
      )}
    </Formik>
  );
};

export default NewPostForm;
