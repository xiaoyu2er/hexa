import { DNSRecordsTable } from '@/components/domain/dns-records-table';
import { VerificationTab } from '@/components/domain/verification-tab';
import type { QueryDomainType } from '@/server/schema/domain';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import { GlobeIcon } from '@hexa/ui/icons';
import type { Row } from '@tanstack/react-table';
import { useState } from 'react';

interface DomainCardProps {
  row: Row<QueryDomainType>;
  onRefresh?: () => Promise<void>;
}

export function DomainCard({ row, onRefresh }: DomainCardProps) {
  const domain = row.original;
  const detail = domain.detail;
  const subdomain = domain.hostname.split('.')[0];

  // Verification states
  const isVerified = domain.verified;
  const _hasCNameError = detail?.verification_errors?.some((error) =>
    error.includes('CNAME')
  );
  const hasOwnershipVerification = detail?.ownership_verification;
  const hasSSLValidation = detail?.ssl?.status === 'pending_validation';

  // Set initial step to ownership if available
  const [activeStep, setActiveStep] = useState<'ownership' | 'ssl' | 'cname'>(
    hasOwnershipVerification ? 'ownership' : hasSSLValidation ? 'ssl' : 'cname'
  );

  // Handle tab clicks
  const handleTabClick = (step: 'cname' | 'ownership' | 'ssl') => {
    setActiveStep(step);
  };

  return (
    <div className="group rounded-xl border border-gray-200 bg-white transition-[filter] hover:drop-shadow-card-hover">
      <div className="p-4 sm:p-5">
        {/* Header with actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Domain info */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="hidden rounded-full border border-gray-200 sm:block">
              <div className="rounded-full border border-white bg-gradient-to-t from-gray-100 p-1 md:p-2">
                <GlobeIcon className="size-5" />
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <a
                  href={`http://${domain.hostname}`}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate font-medium text-sm"
                >
                  {domain.hostname}
                </a>
                {!isVerified && (
                  <Badge variant="destructive" className="rounded-md">
                    Pending (Error)
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {/* <RedirectIcon className="h-3 w-3 text-gray-400" /> */}
                <span className="truncate text-gray-400">
                  No redirect configured
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="flex-shrink-0"
            >
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-destructive"
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Verification Content */}
        {!isVerified && (
          <div className="mt-6">
            <div className="-ml-1.5 border-gray-200 border-b">
              <div className="flex flex-wrap text-sm">
                {hasOwnershipVerification && (
                  <VerificationTab
                    label="Domain Ownership"
                    isActive={activeStep === 'ownership'}
                    onClick={() => handleTabClick('ownership')}
                  />
                )}
                {hasSSLValidation && (
                  <VerificationTab
                    label="SSL Certificate"
                    isActive={activeStep === 'ssl'}
                    onClick={() => handleTabClick('ssl')}
                  />
                )}
                <VerificationTab
                  label="CNAME Record"
                  isActive={activeStep === 'cname'}
                  onClick={() => handleTabClick('cname')}
                />
              </div>
            </div>

            <div className="mt-3 text-left text-gray-600">
              <DNSRecordsTable
                domain={domain}
                subdomain={subdomain as string}
                currentStep={activeStep}
              />
            </div>
          </div>
        )}

        {/* Verified Content */}
        {isVerified && (
          <div className="mt-4">
            {/* Add your verified domain content here */}
          </div>
        )}
      </div>
    </div>
  );
}
