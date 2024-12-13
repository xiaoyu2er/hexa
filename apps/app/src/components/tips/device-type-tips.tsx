import { TipButton } from '@/components/tips/tip-button';
import { DEVICE_TYPES } from '@hexa/const/device-type';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import {
  GamepadIcon,
  GlassesIcon,
  MicrochipIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
  TvIcon,
  WatchIcon,
} from '@hexa/ui/icons';
import type { LucideIcon } from '@hexa/ui/icons';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { useState } from 'react';

interface DeviceTypeConfig {
  icon: LucideIcon;
  type: keyof typeof DEVICE_TYPES;
  description: string;
  example: string;
}

const deviceTypes: DeviceTypeConfig[] = [
  {
    icon: MonitorIcon,
    type: 'DESKTOP',
    description:
      'Desktop is determined by exclusion - if no other device type is detected. Typically includes laptops and desktop computers.',
    example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
  {
    icon: SmartphoneIcon,
    type: 'MOBILE',
    description: 'Mobile phones and smartphones.',
    example: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
  },
  {
    icon: TabletIcon,
    type: 'TABLET',
    description: 'Tablet devices like iPads and Android tablets.',
    example: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)',
  },
  {
    icon: TvIcon,
    type: 'SMARTTV',
    description: 'Smart TVs and streaming devices.',
    example: 'Mozilla/5.0 (SMART-TV; SAMSUNG; SmartTV)',
  },
  {
    icon: WatchIcon,
    type: 'WEARABLE',
    description: 'Wearable devices like smartwatches.',
    example: 'Mozilla/5.0 (Apple Watch; CPU Watch OS 9_0 like Mac OS X)',
  },
  {
    icon: GamepadIcon,
    type: 'CONSOLE',
    description: 'Gaming consoles and related devices.',
    example: 'Mozilla/5.0 (PlayStation; PlayStation 5/2.26)',
  },
  {
    icon: MicrochipIcon,
    type: 'EMBEDDED',
    description: 'Embedded systems and IoT devices.',
    example: 'Mozilla/5.0 (Linux; Raspberry Pi)',
  },
  {
    icon: GlassesIcon,
    type: 'XR',
    description: 'Virtual, augmented and mixed reality devices.',
    example: 'Mozilla/5.0 (X11; Quest 2)',
  },
];

const DeviceTypeEntry = ({ config }: { config: DeviceTypeConfig }) => {
  const Icon = config.icon;
  return (
    <div className="flex gap-2 py-1.5">
      <Icon className="my-1 h-4 w-4 shrink-0" />
      <div>
        <div className="font-medium text-sm">{DEVICE_TYPES[config.type]}</div>
        <div className="text-default-500 text-xs">{config.description}</div>
        <div className="text-default-500 text-xs">
          Example: {config.example}
        </div>
      </div>
    </div>
  );
};

const DeviceTypeContent = () => (
  <div className="space-y-3">
    <div>
      <h4 className="font-medium text-sm">Device Type Detection</h4>
      <p className="text-default-500 text-xs">
        Device types are detected based on User-Agent patterns. Desktop is
        determined by exclusion - if no other device type is detected.
      </p>
    </div>
    <div className="space-y-0.5">
      {deviceTypes.map((config) => (
        <DeviceTypeEntry key={config.type} config={config} />
      ))}
    </div>
  </div>
);

export const DeviceTypeTips = ({ className }: { className?: string }) => {
  const { isMobile } = useScreenSize();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <TipButton
          className={className}
          aria-label="About device types"
          onClick={() => setIsModalOpen(true)}
        />
        <Modal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          scrollBehavior="inside"
          size="full"
        >
          <ModalContent>
            <ModalHeader>Device Type Detection</ModalHeader>
            <ModalBody className="pb-6">
              <DeviceTypeContent />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Popover placement="left-start">
      <PopoverTrigger>
        <TipButton className={className} aria-label="About device types" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="p-4">
          <DeviceTypeContent />
        </div>
      </PopoverContent>
    </Popover>
  );
};
