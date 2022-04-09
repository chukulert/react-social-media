import React from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import styles from "./Form.module.css";

const SignupForm = ({ submitHandler, error, setError }) => {
  const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);

    return (
      <>
        <label htmlFor={props.id || props.name}>{label}</label>
        <input className={styles.formInput} {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className={styles.formError}>{meta.error}</div>
        ) : null}
        {error && <div className={styles.formError}>{error}</div>}
      </>
    );
  };
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Invalid email address")
          .required("Please enter an email address"),
        password: Yup.string()
          .min(5, "Must be 5 characters or more")
          .required("Please enter a password"),
      })}
      onSubmit={(values) => {
        submitHandler(values.email, values.password);
      }}
    >
      <Form className={styles.formContainer}>
        <TextInput name="email" type="email" placeholder="Email address" />
        <TextInput name="password" type="password" placeholder="Password" />

        <div className={styles.footer}>
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default SignupForm;
