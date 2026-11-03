'use client';

import React from 'react';
import { ClinicDescriptionEditor } from './clinic-description-editor';
import { ClinicVisionMissionEditor } from './clinic-vision-mission-editor';

interface ClinicProfileTextEditorProps {
  currentDescription: string | null;
  currentVision: string | null;
  currentMission: string | null;
}

export default function ClinicProfileTextEditor({
  currentDescription,
  currentVision,
  currentMission,
}: ClinicProfileTextEditorProps) {
  return (
    <div className="space-y-8">
      <ClinicDescriptionEditor currentDescription={currentDescription} />
      <ClinicVisionMissionEditor
        currentVision={currentVision}
        currentMission={currentMission}
      />
    </div>
  );
}
