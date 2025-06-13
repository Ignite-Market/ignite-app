import { ProposalRoundStatus, type ProposalRound } from '../types/proposal';

/**
 * Tells if proposal round is active.
 * @param status Proposal round status.
 * @param startTime Round start time.
 * @param endTime Round end time.
 * @returns Boolean.
 */
export function isProposalRoundActive(round: ProposalRound | undefined): boolean {
  if (!round?.id) {
    return false;
  }

  const currDate = Number(new Date());
  return (
    round.roundStatus === ProposalRoundStatus.ACTIVE &&
    Number(new Date(round.startTime)) < currDate &&
    currDate < Number(new Date(round.endTime))
  );
}
