'use client';

import { useEffect } from 'react';
import { getSocket, joinAssignmentRoom } from '@/lib/socket';
import { SOCKET_EVENTS } from '@/types';
import type {
  AssignmentStatusPayload,
  AssignmentCompletedPayload,
  AssignmentFailedPayload,
} from '@/types';
import { useAssignmentStore } from '@/store/assignment-store';

export function useSocketSubscriptions(assignmentIds: string[]) {
  const { updateStatus, setCompleted, setFailed } = useAssignmentStore();

  useEffect(() => {
    if (assignmentIds.length === 0) return;

    const socket = getSocket();

    assignmentIds.forEach((id) => joinAssignmentRoom(id));

    const onStatus = (payload: AssignmentStatusPayload) => {
      updateStatus(payload.assignmentId, payload.status);
    };

    const onCompleted = (payload: AssignmentCompletedPayload) => {
      setCompleted(payload.assignmentId, payload.questionPaper);
    };

    const onFailed = (payload: AssignmentFailedPayload) => {
      setFailed(payload.assignmentId, payload.errorMessage);
    };

    socket.on(SOCKET_EVENTS.STATUS, onStatus);
    socket.on(SOCKET_EVENTS.COMPLETED, onCompleted);
    socket.on(SOCKET_EVENTS.FAILED, onFailed);

    const onConnect = () => {
      assignmentIds.forEach((id) => joinAssignmentRoom(id));
    };
    socket.on('connect', onConnect);

    return () => {
      socket.off(SOCKET_EVENTS.STATUS, onStatus);
      socket.off(SOCKET_EVENTS.COMPLETED, onCompleted);
      socket.off(SOCKET_EVENTS.FAILED, onFailed);
      socket.off('connect', onConnect);
    };
  }, [assignmentIds, updateStatus, setCompleted, setFailed]);
}

export function useAssignmentSocket(assignmentId: string | undefined) {
  const ids = assignmentId ? [assignmentId] : [];
  useSocketSubscriptions(ids);
}
