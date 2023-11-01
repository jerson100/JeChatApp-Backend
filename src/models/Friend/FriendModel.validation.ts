import * as yup from "yup";

export const NewFriendSchemaValidation = yup.object().shape({
  receiverUserId: yup.string().required("receiverUserId is required"),
});

export const FriendSchemaUpdateValidation = yup.object().shape({
  connected: yup.boolean().required("connected is required"),
});
