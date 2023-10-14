import * as Yup from "yup";

export const SingInValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Correo electrónico no es válido")
    .required("El correo electrónico es requerido"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "La contraseña debe tener al menos 8 carácteres, un número, una letra mayúscula y una letra minúscula"
    )
    .required("La contraseña es requerida"),
});

export const CreatedUserValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "El nombre de usuario debe tener al menos 4 carácteres")
    .max(20, "El nombre de usuario debe tener como máximo 20 carácteres")
    .required("El nombre de usuario es requerido"),
  email: Yup.string()
    .email("Correo electrónico no es válido")
    .required("El correo electrónico es requerido"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "La contraseña debe tener al menos 8 carácteres, un número, una letra mayúscula y una letra minúscula"
    )
    .required("La contraseña es requerida"),
  passwordConfirm: Yup.string()
    .oneOf(
      [Yup.ref("password"), undefined],
      "La confirmación de la contraseña no coincide con la contraseña"
    )
    .required("La confirmación de la contraseña es requerida"),
});
