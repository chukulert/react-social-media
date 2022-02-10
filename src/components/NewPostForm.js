import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const NewPostForm = ({submitHandler}) => {
  return (
    <Formik
      initialValues={{ title: '', description: '' }}
      validationSchema={Yup.object({
        title: Yup.string().required('Required'),
        description: Yup.string().required('Required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
        submitHandler({
            title: values.title, description: values.description})
      }}
    >
      <Form>
        <label htmlFor="title">Title</label>
        <Field name="title" type="title" />
        <ErrorMessage name="title" />

        <label htmlFor="description">Description</label>
        <Field name="description" type="textarea" />
        <ErrorMessage name="description" />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default NewPostForm