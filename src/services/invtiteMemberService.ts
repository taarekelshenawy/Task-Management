import { apiClient } from '../utils/apiClient';
import getBaseUrl from '../utils/api';

type DataProps = {
  p_email: string;
  p_project_id: string;
  p_app_url: string;
  p_base_url: string;
};

export const inviteMemberFunc = async (data: DataProps) => {
  try {
    const response = await apiClient(getBaseUrl('rest/v1/rpc/invite_member'), {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to invite member');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('unexpected Error');
  }
};

type AcceptInvitationData = {
  p_token: string;
};

export const acceptInvitation = async (data: AcceptInvitationData) => {
  console.log(data);
  try {
    const response = await apiClient(
      getBaseUrl('rest/v1/rpc/accept_invitation'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to accept invitation');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Unexpected error');
  }
};
