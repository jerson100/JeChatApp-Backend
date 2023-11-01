import * as Yup from "yup";

export const SingInValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "El nombre de usuario debe tener al menos 4 carácteres")
    .max(20, "El nombre de usuario debe tener como máximo 20 carácteres")
    .required("El correo electrónico es requerido")
    .lowercase(),
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
    .required("El nombre de usuario es requerido")
    .lowercase(),
  email: Yup.string()
    .email("Correo electrónico no es válido")
    .required("El correo electrónico es requerido")
    .lowercase(),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "La contraseña debe tener al menos 8 carácteres, un número, una letra mayúscula y una letra minúscula"
    )
    .required("La contraseña es requerida"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), undefined],
      "La confirmación de la contraseña no coincide con la contraseña"
    )
    .required("La confirmación de la contraseña es requerida"),
});

const validFileExtensions = { image: ["jpg", "jpeg"] };

function isValidFileType(fileExtension: string, fileType: "image"): boolean {
  return fileExtension
    ? validFileExtensions[fileType].findIndex((ext) =>
        fileExtension.endsWith(ext)
      ) !== -1
    : false;
}

export const PatchUserValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "El nombre de usuario debe tener al menos 4 carácteres")
    .max(20, "El nombre de usuario debe tener como máximo 20 carácteres")
    .lowercase(),
  email: Yup.string().email("Correo electrónico no es válido").lowercase(),
  password: Yup.string().matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    "La contraseña debe tener al menos 8 carácteres, un número, una letra mayúscula y una letra minúscula"
  ),
  image: Yup.mixed<Express.Multer.File>()
    .test("tipo", "El archivo debe ser una imagen jpg o jpeg", (value) => {
      if (!value) return true;
      const [fileType, fileExtension] = value.mimetype.split("/");
      return isValidFileType(fileExtension, fileType as "image");
    })
    .test("tamaño", "El archivo es demasiado grande", (value) => {
      if (!value) return true;
      return value.size <= 1024 * 1024 * 1; // 1 MB
    }),
});

export const ParamsGetAllUserSchema = Yup.object().shape({
  page: Yup.number().min(1, "La página debe ser mayor a 0").default(1),
  limit: Yup.number().default(10).min(1, "El límite debe ser mayor a 0"),
  username: Yup.string(),
});
