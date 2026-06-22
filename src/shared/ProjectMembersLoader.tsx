import { useEffect } from 'react';
import { useAppSelector } from '../Store/hooks';
import { useAppDispatch } from '../Store/hooks';
import { getProjectMembers } from '../Store/ProjectSlice';

type Props = {
  projectId: string;
};

export default function ProjectMembersLoader({ projectId }: Props) {
  const { members } = useAppSelector((state) => state.Project);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!members.length) {
      dispatch(getProjectMembers({ projectId }));
    }
  }, [projectId, dispatch, members]);
  return null;
}
