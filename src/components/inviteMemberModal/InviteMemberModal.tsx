import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import InviteIcon from '../../assets/inviteMembericon.png';
import closeIcon from '../../assets/closeIcon.png';
import emailIcon from '../../assets/emaiIcon.png';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteMemberSchema } from '../../utils/validationSchema';
import { inviteMemberFunc } from '../../services/invtiteMemberService';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

type Inputs = z.infer<typeof inviteMemberSchema>;
export default function InviteMemberModal({
  setOpenInviteModal,
}: {
  setOpenInviteModal: (e: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(inviteMemberSchema),
  });
  const { projectId } = useParams();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!projectId) return;
    const payload = {
      ...data,
      p_project_id: projectId,
      p_app_url: 'http://localhost:5174',
      p_base_url: import.meta.env.VITE_SUPABASE_URL,
    };

    try {
      await inviteMemberFunc(payload);
      toast.success('Invitation sent successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <div className="fixed z-50 inset-0 bg-black/20 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-7 flex flex-col gap-5 max-w-full rounded ">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded bg-surface-low flex justify-center items-center">
            <img src={InviteIcon} alt="invite-icon"></img>
          </div>

          <img
            src={closeIcon}
            alt="close-icon"
            onClick={() => setOpenInviteModal(false)}
            className="cursor-pointer"
          ></img>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-dark">
            Invite Team Member
          </h1>
          <p className="text-sm font-medium text-slate-md">
            Send an invitation to join the Architectural Studio workspace.
          </p>
        </div>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-16"
          >
            {/* register your input into the hook by invoking the "register" function */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-bold text-[11px] text-slate-md"
              >
                Email Address
              </label>
              <div className="flex bg-surface-high p-3 justify-between max-w-full">
                <input
                  placeholder="Enter email address"
                  id="email"
                  {...register('p_email')}
                  className="outline-none w-full"
                />
                <img src={emailIcon} alt="email-icon"></img>
              </div>

              {errors.p_email && (
                <span className="text-red-500">{errors.p_email.message}</span>
              )}
            </div>

            <div className="flex justify-between">
              <button
                className="font-semibold text-slate-md w-44 h-11"
                onClick={() => setOpenInviteModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-linear-to-r from-primary-container to-primary text-white w-44 h-11 cursor-pointer rounded font-semibold"
              >
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
