import * as Yup from "yup";

const IdValidationSchema = Yup.object().shape({
  id: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Id no válido")
    .required(),
});

export default IdValidationSchema;
