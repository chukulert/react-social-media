import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const NewCommentForm = ({ submitHandler }) => {

  return (
    <Formik
      initialValues={{ content: ""}}
      validationSchema={Yup.object({
        content: Yup.string().required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
        //get file from input
        submitHandler({
          content: values.content,
        });
      }}
    
    >
      <Form>
        <label htmlFor="content">Content</label>
        <Field name="content" type="string" as='textarea'/>
        <ErrorMessage name="content" />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default NewCommentForm;