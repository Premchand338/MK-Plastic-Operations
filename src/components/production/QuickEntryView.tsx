import React from 'react';
import { OperatorMachineView } from './OperatorMachineView';

/**
 * QuickEntryView now renders the dedicated OperatorMachineView:
 * - 2 Moulding machines (M1: Pawan Kumar, M2: Raju Vishwakarma)
 * - Single-machine operation with raw kg input, waste kg, moulded beads kg
 * - Real-time piece-rate operator salary calculations
 * - Instant Admin notification on submission
 * - 3 post-completion paths: Loose Bead Sale, Move to Threading, Recycle Waste
 */
export const QuickEntryView: React.FC = () => {
  return <OperatorMachineView />;
};

export { OperatorMachineView };
