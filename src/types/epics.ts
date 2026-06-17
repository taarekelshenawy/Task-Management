

export type InputProps={
      title: string;
  description: string;
  deadline: string;

}


export type UserEpics = {
  sub: string;
  name: string;
  email: string;
  department: string;
};
export type EpicDetailsProps = {
  id: string;
  epic_id: string;
  title: string;
  description: string;
  deadline: string;
  project_id: string;
  created_at: string;
  created_by: UserEpics;
  assignee: UserEpics;
};

export type PayloadEpics = {
  title: string;
  description: string;
  assignee_id: string;
  deadline: string;
};


export type epicsTasksProps={
    created_by:{name:string},
    title:string,
    due_date:string,
}


export type EpicProps = {
  id: string;
  epic_id: string;
  title: string;
  description?: string;
  deadline?: string;
  created_at: string;
  created_by: {
    name: string;
  };
  assignee: {
    name: string;
    email?: string;
  };
};