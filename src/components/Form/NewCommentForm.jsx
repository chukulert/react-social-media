import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from './NewCommentForm.module.css'

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
        <div className={styles.inputContainer}>
        <Field name="content" type="string" as='textarea' className={styles.commentInput} placeholder='Write your comment...'/>
        <div><button type="submit" className={styles.submitBtn}>Submit</button></div>
        </div>
      </Form>
    </Formik>
  );
};

export default NewCommentForm;