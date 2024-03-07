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
  streamToken: string;
  boarded: boolean;
};

export type Wks = {
  active: boolean;
  created_at: string;
  id: number;
  leisure: boolean;
  role: string;
  waiting_list: string;
};

export type Workers = {
  created_at: string;
  email: string;
  exp: string;
  gender: string;
  id: number;
  imageUrl: string;
  location: string;
  name: string;
  orgId: string | null;
  qualification: string;
  skill: string;
  userId: string;
  workspaceId: string | null;
  role: string;
};

export type Requests = {
  created_at: string;
  employerId: string;
  id: number;
  responsibility: string;
  role: string;
  salary: string;
  status: string;
  workerId: number;
  workers: Workers;
};
