export type UserType = "contractor" | "provider";

export type UserTypeToggleProps = {
  selected: UserType;
  onSelect: (type: UserType) => void;
};
