import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import styles from './SignUpForm.module.css'

const SignupForm = ({submitHandler}) => {
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
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().min(5, 'Must be 5 characters or more').required('Required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
        submitHandler(values.email, values.password)
      }}
    >
      <Form className={styles.formContainer}>
      <TextInput
            name="email"
            type="email"
            placeholder="Email address"
          />
              <TextInput
            name="password"
            type="text"
            placeholder="Password"
          />


<div className={styles.footer}><button type="submit" className={styles.submitBtn}>
            Submit
          </button></div>
      </Form>
    </Formik>
  );
};

export default SignupForm