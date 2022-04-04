import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const ResetPasswordForm = ({ submitHandler, type, oobCode }) => {
  const validation =
    type === "email"
      ? Yup.string().email("Invalid email address").required("Required")
      : Yup.string()
          .min(5, "Must be 5 characters or more")
          .required("Required");

  return (
    <Formik
      initialValues={{ type: "" }}
      validationSchema={Yup.object({
        type: validation,
      })}
      onSubmit={(values, { setSubmitting }) => {
        if (oobCode) {
          submitHandler(oobCode, values.type);
        } else {
          submitHandler(values.type);
        }
      }}
    >
      <Form>
        <label htmlFor={type}>{type}</label>
        <Field name="type" type={type} />
        <ErrorMessage name="type" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default ResetPasswordForm;
