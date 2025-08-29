<template>
  <div class="flex items-center justify-center p-0 m-0">
    <div
      :class="getStatusClass(status)"
      class="font-bold rounded-[20px] py-[2px] px-[6px] text-[12px] leading-4 tracking-[0.04em]"
    >
      {{ getStatusName(status) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SqlModelStatus } from '~/lib/types';

defineProps({
  status: { type: Number, default: null, required: true },
});

/**
 *
 * @param status
 * @param endTime
 * @returns
 */
function getStatusName(status: SqlModelStatus) {
  switch (status) {
    case SqlModelStatus.DRAFT:
      return 'Draft';

    case SqlModelStatus.INCOMPLETE:
      return 'Incomplete';

    case SqlModelStatus.INACTIVE:
      return 'Inactive';

    case SqlModelStatus.ACTIVE:
      return 'Active';

    case SqlModelStatus.BLOCKED:
      return 'Blocked';

    case SqlModelStatus.ARCHIVED:
      return 'Voting...';

    case SqlModelStatus.DELETED:
      return 'Closed';

    default:
      break;
  }
}

function getStatusClass(status: SqlModelStatus) {
  switch (status) {
    case SqlModelStatus.DRAFT:
      return 'bg-white/25 text-white';

    case SqlModelStatus.INCOMPLETE:
      return 'bg-white/25 text-white';

    case SqlModelStatus.INACTIVE:
      return 'bg-statusGreen/20 text-statusGreen';

    case SqlModelStatus.ACTIVE:
      return 'bg-statusGreen/20 text-statusGreen';

    case SqlModelStatus.BLOCKED:
      return 'bg-statusBlue/20 text-statusBlue';

    case SqlModelStatus.ARCHIVED:
      return 'bg-statusYellow/20 text-statusYellow';

    case SqlModelStatus.DELETED:
      return 'bg-white/25 text-white';

    default:
      break;
  }
}
</script>
