import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const NewPostForm = ({ submitHandler }) => {

  return (
    <Formik
      initialValues={{ title: "", description: "", file: "" }}
      validationSchema={Yup.object({
        title: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
      })}
      onSubmit={(values, { setSubmitting, setFieldValue }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
        //get file from input
        let file;
        const fileInput = document.getElementById('file');
        if(fileInput.files[0]) {
            file = fileInput.files[0]
        }
        submitHandler({
          title: values.title,
          description: values.description,
          file: file
        });
      }}
    
    >
      <Form>
        <label htmlFor="title">Title</label>
        <Field name="title" type="title" />
        <ErrorMessage name="title" />

        <label htmlFor="description">Description</label>
        <Field name="description" type="textarea" />
        <ErrorMessage name="description" />

        <label htmlFor="file">File</label>
        <Field
            id='file'
          name="file"
          type="file"
          accept="image/*"
        //   onChange={(event) => 
        //    setFieldValue("file", event.currentTarget.files[0])
        //   }
        />
        <ErrorMessage name="file" />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default NewPostForm;
