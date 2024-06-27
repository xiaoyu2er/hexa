import * as React from 'react';

interface EmailTemplateProps {
  message: string;
}

export const HelloEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  message,
}) => (
  <div>{message}</div>
);
