export type connections =
  | {
      name: string;
      image: string;
      id: any;
      time: string;
    }[]
  | null;

export type Organization = {
  organization_name: string;
  id: number;
  website: string;
  location: string;
  category: string;
  work_days: string;
  description: string;
  image_url: string;
  email: string;
  active: boolean;
  leisure: boolean;
  createAt: string;
  owner_id: string;
  opening_time: string;
  closing_time: string;
};

export type Profile = {
  id: number;
  name: string;
  avatarUrl: string;
  date_of_birth: string;
  email: string;
  phone: string;
  gender: string;
  user_id: string;
};
