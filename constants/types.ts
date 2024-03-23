export type connections =
  | {
      name: string;
      image: string;
      id: any;
      time: string;
    }[]
  | null;

export type Organization = {
  org: {
    _id: string;
    avatar: string;
    category: string;
    createdAt?: string;
    description: string;
    email: string;
    endDay: string;
    followers?: string[];
    location: string;
    organizationName: string;
    ownerId: string;
    password?: string;
    startDay: string;
    websiteUrl: string;
    startTime: string;
    endTime: string;
  };
};
export type Org = {
  avatar: string;
  category: string;

  description: string;
  email: string;
  endDay: string;

  location: string;
  organizationName: string;
  ownerId: { _id: string; name: string };
  password?: string;
  startDay: string;
  websiteUrl: string;
  endTime: string;
  startTime: string;
  _id: string;
  followers: string[];
};
export type Profile = {
  name: string | null;
  avatarUrl: string;
  email: string;
  user_id: string;
  id?: number;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  streamToken?: string;
  boarded?: boolean;
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

export type Person = {
  user: {
    avatarUrl: string;
    dateOfBirth: string | null;
    email: string;
    followers: number;
    id: string;
    name: string;
    organizations: string | null;
    posts: number;
    streamToken: string;
    workspace: number;
  };
};
