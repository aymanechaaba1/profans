'use client';

import React from 'react';
import Dialog from './Dialog';
import { MapPin, Pin, X } from 'lucide-react';
import Map from './Map';

function DialogMap({ eventLocation }: { eventLocation: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger={
        <div className="flex items-center gap-x-2">
          <MapPin size={15} className="" />
          <p className="text-sm">{eventLocation}</p>
        </div>
      }
      panelClassName="bg-transparent"
    >
      <div className="flex flex-col gap-y-3">
        <Map lat={33.9924262} lng={-6.8385805} />
      </div>
    </Dialog>
  );
}

export default DialogMap;
