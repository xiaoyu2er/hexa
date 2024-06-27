import * as React from 'react';

interface EmailTemplateProps {
  link: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  link,
}) => (
  <a href={link}>{link}</a>
);
