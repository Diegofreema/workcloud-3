export type connections =
  | {
      name: string;
      image: string;
      id: any;
      time: string;
    }[]
  | null;

export type Organization = {
  avatar: string;
  category: string;
  created_at: string;
  description: string;
  email: string;
  end: string;
  folllowers: string[];
  followers: number[];
  id: number;
  location: string;
  name: string;
  ownerId: Profile | null;
  start: string;
  website: string;
  workDays: string;
  workspaces: number[];
};
export type Org = {
  avatar: string;
  category: string;
  created_at: string;
  description: string;
  email: string;
  end: string;
  folllowers: string[];
  followers: number[];
  id: number;
  location: string;
  name: string;
  ownerId: string;
  start: string;
  website: string;
  workDays: string;
  workspaces: number[];
};
export type Profile = {
  avatar: string;
  birthday?: string;
  created_at?: string;
  email: string;
  id?: number;
  name: string;
  organizationId: {
    id: number;
    avatar: string;
    category: string;
    created_at?: string;
    description: string;
    email: string;
    end: string;
    folllowers: string[];
    followers: number[];

    location: string;
    name: string;
    ownerId: string;
    start: string;
    website: string;
    workDays: string;
    workspaces: number[];
  };
  phoneNumber?: string;
  posts?: number[];
  streamToken: string;
  userId: string;
  workerId: {
    created_at: string;
    experience: string;
    id: number;
    location: string;
    organizationId: number;
    qualifications: string;
    servicePointId: number;
    skills: string;
    userId: number;
    workspaceId: number;
  } | null;

  workspace:
    | {
        active: boolean | null;
        created_at: string;
        id: number;
        leisure: boolean | null;
        organizationId: number | null;
        ownerId: number | null;
        responsibility: string | null;
        salary: string | null;
        waitlist: number[] | null;
      }[]
    | null;
};

export type Wks = {
  active: boolean;
  created_at: string;
  id: number;
  leisure: boolean;
  organizationId: number;
  ownerId: number;
  responsibility: string;
  salary: string;
  waitlist: number[];
  role: string;
  workerId: string;
};

export type Workers = {
  created_at: string;
  experience?: string;
  id?: number;
  location?: string;
  organizationId?: Organization;
  qualifications?: string;
  servicePointId?: number;
  skills: string;
  userId: Profile;
  workspaceId?: number;
  role: string;
  bossId: string;
};

export type Requests = {
  created_at: string;
  from: string;
  id: number;
  responsibility: string;
  role: string;
  salary: string;
  to: string;
  pending: boolean;
};

export type Person = {
  user: {
    avatarUrl: string;
    dateOfBirth: string | null;
    email: string;
    followers: number;
    id: string;
    name: string;
    organizations: { _id: string };
    posts: number;
    streamToken: string;
    workspace: number;
    worker: { _id: string };
    phoneNumber: string;
  };
};

export type ConnectionType = {
  allConnections: {
    _id: string;
    userId: string;
    organizationsId: string;
    organization: {
      organizationName: string;
      open: boolean;
      avatar: { url: string };
      _id: string;
    };
    createdAt: string;
  }[];
};

export type WorkerProfile = {
  profile: {
    _id: string;
    createdAt: string;
    exp: string;
    gender: string;
    location: string;
    qualifications: string;
    skills: string;
    updatedAt: string;
    userId: {
      _id: string;
      avatar: {
        public_id: string;
        url: string;
      };
      email: string;
      name: string;
    };
    assignedWorkspace?: { _id: string; role: string };
  };
};

export type WorkerProfileArray = {
  profile: {
    _id: string;
    createdAt: string;
    exp: string;
    gender: string;
    location: string;
    qualifications: string;
    skills: string;
    updatedAt: string;
    userId: {
      _id: string;
      avatar: {
        public_id: string;
        url: string;
      };
      email: string;
      name: string;
    };
    assignedWorkspace?: string;
  }[];
};

export type WorkType = {
  created_at?: string;
  experience?: string;
  id?: number;
  location?: string;
  organizationId?: number;
  qualifications?: string;
  servicePointId?: number;
  skills?: string;
  userId?: {
    avatar: string;
    birthday: string;
    created_at: string;
    email: string;
    id: number;
    name: string;
    organizationId: number;
    phoneNumber: string;
    posts: number[];
    streamToken: string;
    userId: string;
    workerId: number;
  };
  workspaceId?: number;
  bossId: string;
  role: string;
};

export type Workspace = {
  active: boolean;
  created_at: string;
  id: number;
  leisure: boolean;
  organizationId: number;
  ownerId: string;
  responsibility: string;
  role: string;
  salary: string;
  waitlist: number[];
  workerId: string;
};
