export type Tab = {
  id: string,
  title: string,
  icon: string;
  component: string,
  active: boolean,
};

export type ListItem = {
  value: string;
  text: string;
}

export type Position = {
  top: number;
  left: number;
}

export type SelectItem = {
  value: string;
  label: string;
  selected: boolean;
}

export type Collection = {
  id: string;
  title: string;
}

