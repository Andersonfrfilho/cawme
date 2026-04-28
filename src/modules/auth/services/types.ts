export type LoginServiceParams = {
  username: string;
  password: string;
};

export type LoginServiceResult = {
  id: string;
  name: string;
  email: string;
};

export type ForgotPasswordServiceParams = {
  email: string;
};
