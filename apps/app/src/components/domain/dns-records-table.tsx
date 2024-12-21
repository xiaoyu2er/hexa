import { DNSRecordGrid } from '@/components/domain/dns-record-grid';
import { InfoMessage } from '@/components/domain/info-message';
import type { QueryDomainType } from '@hexa/server/schema/domain';

interface DNSRecordsTableProps {
  domain: QueryDomainType;
  subdomain: string;
  currentStep: 'ownership' | 'ssl' | 'cname';
}

export function DNSRecordsTable({
  domain,
  subdomain,
  currentStep,
}: DNSRecordsTableProps) {
  const recordsToShow = {
    ownership: domain.detail?.ownership_verification && (
      <>
        <div className="my-5">
          <p className="prose-sm max-w-none break-words">
            To verify domain ownership, add this TXT record:
          </p>
        </div>

        <DNSRecordGrid
          columns={[
            { header: 'Type', value: 'TXT' },
            {
              header: 'Name',
              value: domain.detail.ownership_verification.name,
              copy: true,
              hideOnMobile: true,
            },
            {
              header: 'Value',
              value: domain.detail.ownership_verification.value,
              copy: true,
              hideOnMobile: true,
            },
          ]}
        />

        <InfoMessage variant="orange">
          Warning: if you are using this domain for another site, setting this
          TXT record will transfer domain ownership away from that site and
          break it.
        </InfoMessage>
      </>
    ),
    ssl: domain.detail?.ssl && (
      <>
        <div className="my-5">
          <p className="prose-sm max-w-none break-words">
            To enable SSL, add this TXT record:
          </p>
        </div>

        <DNSRecordGrid
          columns={[
            { header: 'Type', value: 'TXT' },
            {
              header: 'Name',
              value: domain.detail.ssl.txt_name || '',
              copy: true,
              hideOnMobile: true,
            },
            {
              header: 'Value',
              value: domain.detail.ssl.txt_value || '',
              copy: true,
              hideOnMobile: true,
            },
          ]}
        />

        <InfoMessage variant="blue">
          As soon as the TXT record listed in the table above is in place, the
          SSL certificates will be issued and deployed. Please allow a few
          minutes after the TXT record has been added before attempting to
          connect via HTTPS.
        </InfoMessage>
      </>
    ),
    cname: (
      <>
        <div className="my-5">
          <p className="prose-sm max-w-none break-words">
            To configure your subdomain <code>{domain.hostname}</code>, set the
            following CNAME record on your provider:
          </p>
        </div>

        <DNSRecordGrid
          columns={[
            { header: 'Type', value: 'CNAME' },
            { header: 'Name', value: subdomain, copy: true },
            {
              header: 'Value',
              value: 'cname.dub.co',
              copy: true,
              hideOnMobile: true,
            },
            { header: 'TTL', value: '86400' },
          ]}
        />

        <InfoMessage variant="blue">
          If a TTL value of 86400 is not available, choose the highest available
          value. Domain propagation may take up to 12 hours.
        </InfoMessage>
      </>
    ),
  };

  return recordsToShow[currentStep] || null;
}
