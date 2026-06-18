import { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useAppDispatch } from '../../store/hooks';
import { getProjectMembers } from '../../store/projectSlice';

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
